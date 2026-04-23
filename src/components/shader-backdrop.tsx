"use client";

import { useEffect, useRef } from "react";

/**
 * Vanilla-WebGL flow-field backdrop. Intentionally does NOT use three.js or
 * react-three-fiber — the entire render surface is one fullscreen quad, so
 * we avoid ~600 KiB of Three/R3F and ship a couple KB instead.
 *
 * Extras for mobile perf:
 *   - DPR clamped to 1 on small viewports
 *   - Defers first render until the browser is idle (post-LCP)
 *   - Honors prefers-reduced-motion (renders one static frame)
 *   - Pauses rAF when the tab is hidden
 */

const VS = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FS = `
precision mediump float;
varying vec2 vUv;
uniform float uTime;
uniform float uScroll;
uniform float uDark;
uniform vec2  uMouse;
uniform vec2  uResolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5) * 2.2;

  float t = uTime * 0.05 + uScroll * 1.4;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, t + 1.3)));
  vec2 r = vec2(
    fbm(p + 3.5 * q + vec2(1.7, 9.2) + t * 0.4),
    fbm(p + 3.5 * q + vec2(8.3, 2.8) + t * 0.4)
  );
  float n = fbm(p + 3.5 * r);

  // dark palette
  vec3 d0 = vec3(0.012, 0.018, 0.045);
  vec3 d1 = vec3(0.03,  0.07,  0.22);
  vec3 d2 = vec3(0.12,  0.38,  0.95);
  vec3 d3 = vec3(0.55,  0.22,  1.0);
  vec3 d4 = vec3(0.45,  0.85,  1.0);
  vec3 darkCol = mix(d0, d1, smoothstep(0.0, 0.45, n));
  darkCol = mix(darkCol, d2, smoothstep(0.45, 0.72, n) * 0.9);
  darkCol = mix(darkCol, d3, smoothstep(0.66, 0.88, n) * 0.55);
  darkCol += d4 * smoothstep(0.82, 0.97, n) * 0.25;

  // light palette
  vec3 l0 = vec3(0.94, 0.96, 1.0);
  vec3 l1 = vec3(0.74, 0.84, 1.0);
  vec3 l2 = vec3(0.40, 0.58, 0.98);
  vec3 l3 = vec3(0.55, 0.42, 0.95);
  vec3 l4 = vec3(0.28, 0.76, 0.98);
  vec3 lightCol = mix(l0, l1, smoothstep(0.0, 0.45, n));
  lightCol = mix(lightCol, l2, smoothstep(0.4, 0.72, n) * 0.85);
  lightCol = mix(lightCol, l3, smoothstep(0.58, 0.85, n) * 0.55);
  lightCol = mix(lightCol, l4, smoothstep(0.8, 0.97, n) * 0.35);

  vec3 col = mix(lightCol, darkCol, uDark);

  // scroll highlight band
  float band = smoothstep(0.0, 0.22, abs(uv.y - fract(uScroll * 1.6)));
  col += mix(vec3(-0.03, -0.04, -0.06), vec3(0.25, 0.55, 1.0) * 0.05, uDark) * (1.0 - band);

  // mouse glow
  vec2 mouseP = vec2((uMouse.x - 0.5) * aspect, uMouse.y - 0.5) * 2.0;
  vec2 curP   = vec2((uv.x  - 0.5) * aspect, uv.y  - 0.5) * 2.0;
  float md = length(curP - mouseP);
  col += mix(vec3(-0.04, -0.05, -0.07), vec3(0.4, 0.65, 1.0) * 0.07, uDark) * smoothstep(1.0, 0.0, md);

  // grid lines
  vec2 gridUV = uv * vec2(aspect, 1.0) * 42.0;
  vec2 grid = abs(fract(gridUV) - 0.5);
  float gline = smoothstep(0.47, 0.5, max(grid.x, grid.y));
  col += mix(vec3(-0.025, -0.03, -0.05), vec3(0.18, 0.32, 0.7) * 0.05, uDark) * (1.0 - gline);

  // vignette
  float vig = smoothstep(1.35, 0.3, length((uv - 0.5) * vec2(aspect, 1.0)));
  vec3 darkVig  = col * vig;
  vec3 lightVig = mix(col, vec3(0.98, 0.99, 1.0), (1.0 - vig) * 0.25);
  col = mix(lightVig, darkVig, uDark);

  // film grain
  float grain = hash(uv * uResolution + uTime) - 0.5;
  col += grain * mix(0.006, 0.018, uDark);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("shader compile:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function ShaderBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "default",
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("program link:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // fullscreen quad (TRIANGLE_STRIP)
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uScroll = gl.getUniformLocation(prog, "uScroll");
    const uDark = gl.getUniformLocation(prog, "uDark");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uRes = gl.getUniformLocation(prog, "uResolution");

    let curScroll = 0;
    let curDark = document.documentElement.classList.contains("dark") ? 1 : 0;
    let curMouseX = 0.5;
    let curMouseY = 0.5;
    let tgtScroll = 0;
    let tgtDark = curDark;
    let tgtMouseX = 0.5;
    let tgtMouseY = 0.5;

    function resize() {
      if (!canvas) return;
      const mobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      gl!.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();

    function onScroll() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      tgtScroll = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
    }
    function onMove(e: MouseEvent) {
      tgtMouseX = e.clientX / window.innerWidth;
      tgtMouseY = 1 - e.clientY / window.innerHeight;
    }
    function syncTheme() {
      tgtDark = document.documentElement.classList.contains("dark") ? 1 : 0;
      if (reduced) queueStaticRender();
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!reduced) window.addEventListener("mousemove", onMove, { passive: true });

    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let raf = 0;
    const start = performance.now();
    let lastFrame = start;

    function draw(timeSec: number) {
      gl!.uniform1f(uTime, timeSec);
      gl!.uniform1f(uScroll, curScroll);
      gl!.uniform1f(uDark, curDark);
      gl!.uniform2f(uMouse, curMouseX, curMouseY);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    function render() {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;
      const k = 1 - Math.exp(-8 * dt);
      curScroll += (tgtScroll - curScroll) * k;
      curDark += (tgtDark - curDark) * k;
      curMouseX += (tgtMouseX - curMouseX) * k * 0.7;
      curMouseY += (tgtMouseY - curMouseY) * k * 0.7;
      draw((now - start) / 1000);
      raf = requestAnimationFrame(render);
    }

    let staticQueued = false;
    function queueStaticRender() {
      if (staticQueued) return;
      staticQueued = true;
      requestAnimationFrame(() => {
        staticQueued = false;
        curScroll = tgtScroll;
        curDark = tgtDark;
        curMouseX = tgtMouseX;
        curMouseY = tgtMouseY;
        draw(0);
      });
    }

    function onVisibility() {
      if (reduced) return;
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (raf === 0) {
        lastFrame = performance.now();
        raf = requestAnimationFrame(render);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    // defer first render to after LCP / browser idle
    const ric: ((cb: IdleRequestCallback, opts?: IdleRequestOptions) => number) | undefined =
      (window as unknown as { requestIdleCallback?: typeof requestIdleCallback })
        .requestIdleCallback;
    const kickoff = () => {
      if (reduced) queueStaticRender();
      else raf = requestAnimationFrame(render);
    };
    const kickHandle = ric
      ? ric(kickoff, { timeout: 1500 })
      : (window.setTimeout(kickoff, 250) as unknown as number);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (ric) {
        (window as unknown as {
          cancelIdleCallback?: (h: number) => void;
        }).cancelIdleCallback?.(kickHandle);
      } else {
        clearTimeout(kickHandle);
      }
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      themeObserver.disconnect();
      try {
        gl!.deleteProgram(prog);
        gl!.deleteShader(vs);
        gl!.deleteShader(fs);
        gl!.deleteBuffer(buf);
      } catch {}
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
