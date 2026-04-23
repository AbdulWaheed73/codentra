"use client";

import { useEffect, useRef } from "react";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

/**
 * Interactive robot scene used in the hero.
 *
 * The Spline runtime tracks the mouse relative to its own <canvas> bounds —
 * if the canvas is just a panel on the right, the robot only reacts when the
 * cursor is in that panel. To make the whole screen drive the robot, we grab
 * the underlying canvas once it mounts and forward every window mousemove
 * into it with the original clientX / clientY. Spline translates those to
 * canvas-local space internally, so the robot now tracks the cursor even
 * when it's over the hero copy on the left.
 */
export function HeroRobot() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let canvas: HTMLCanvasElement | null = null;
    let off: (() => void) | null = null;

    function attach() {
      canvas = wrapper!.querySelector("canvas");
      if (!canvas) return false;

      const onMove = (e: MouseEvent) => {
        if (!canvas) return;
        const r = canvas.getBoundingClientRect();
        // Let native events handle the in-canvas case; only forward from outside.
        if (
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom
        )
          return;
        const forwarded = new MouseEvent("mousemove", {
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: true,
          cancelable: true,
          view: window,
        });
        canvas.dispatchEvent(forwarded);
      };
      window.addEventListener("mousemove", onMove, { passive: true });
      off = () => window.removeEventListener("mousemove", onMove);
      return true;
    }

    if (attach()) return () => off?.();

    // Canvas may not be in the DOM yet — poll briefly until the lazy Spline
    // scene mounts, then wire up the forwarder.
    const obs = new MutationObserver(() => {
      if (attach()) obs.disconnect();
    });
    obs.observe(wrapper, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      off?.();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-auto relative h-full w-full"
    >
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <SplineScene
        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        className="!h-full !w-full"
      />
    </div>
  );
}
