"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent(
      `Project enquiry — ${data.get("name") || "New visitor"}`
    );
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nCompany: ${
        data.get("company") || "—"
      }\n\n${data.get("message") || ""}`
    );
    // Read-only site: hand off to the user's mail client.
    window.location.href = `mailto:hello@codentra.dev?subject=${subject}&body=${body}`;
    setTimeout(() => {
      toast.success("Opening your mail client…", {
        description: "If nothing happens, email hello@codentra.dev directly.",
      });
      setSubmitting(false);
    }, 300);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="gradient-border space-y-5 rounded-2xl bg-card/40 p-6 backdrop-blur-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Ada Lovelace"
            className="h-11 rounded-lg bg-background/60"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="h-11 rounded-lg bg-background/60"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          placeholder="Acme Inc."
          className="h-11 rounded-lg bg-background/60"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">What are you building?</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us about the product, timeline, and what success looks like…"
          className="resize-none rounded-lg bg-background/60"
        />
      </div>
      <Button
        type="submit"
        disabled={submitting}
        size="lg"
        className="h-12 w-full rounded-full bg-gradient-tech text-primary-foreground shadow-glow hover:opacity-95 sm:w-auto"
      >
        {submitting ? "Sending…" : "Send message"}
        <Send className="ml-1 size-4" />
      </Button>
      <p className="text-xs text-muted-foreground">
        By sending you agree to Codentra processing your message in line with
        GDPR for the sole purpose of replying.
      </p>
    </form>
  );
}
