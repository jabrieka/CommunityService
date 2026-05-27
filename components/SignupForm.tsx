"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function SignupForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-ink/70 border-2 border-gold rounded-xl p-8 text-center">
        <div className="text-5xl mb-3">🎨</div>
        <h3 className="font-display text-3xl text-gold tracking-wide mb-2">
          You're In!
        </h3>
        <p className="text-cream/85 leading-relaxed">
          Thanks for signing up! Check your inbox — we just sent you the
          volunteer waiver and an hours-tracking sheet. We'll follow up with
          date &amp; time details soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 underline text-gold hover:text-gold-light"
        >
          Sign someone else up
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-ink/70 border-2 border-gold/60 rounded-xl p-6 md:p-8 space-y-5"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="label" htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" required className="field" placeholder="Jane" />
        </div>
        <div>
          <label className="label" htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" required className="field" placeholder="Doe" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="field" placeholder="you@example.com" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" className="field" placeholder="(769) 243-0309" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="label" htmlFor="age">Age</label>
          <input id="age" name="age" type="number" min={13} max={120} className="field" placeholder="18" />
        </div>
        <div>
          <label className="label" htmlFor="experience">Painting Experience</label>
          <select id="experience" name="experience" className="field">
            <option value="none">None — I just want to help!</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="professional">Professional / Studio Artist</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">What do you want to bring to the project?</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {[
            "Painting",
            "Sketching / Design",
            "Setup & Cleanup",
            "Photography",
            "Snacks & Hospitality",
            "Just enthusiasm!",
          ].map((skill) => (
            <label
              key={skill}
              className="flex items-center gap-2 bg-ink/60 border border-gold/30 rounded px-3 py-2 hover:border-gold/70 cursor-pointer"
            >
              <input
                type="checkbox"
                name="skills"
                value={skill}
                className="accent-gold"
              />
              <span>{skill}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="message">
          Anything else? (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="field"
          placeholder="Availability, accessibility needs, group sign-ups, questions..."
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-cream/80">
        <input
          type="checkbox"
          name="agree"
          required
          value="yes"
          className="mt-1 accent-gold"
        />
        <span>
          I understand a volunteer waiver and an hours-tracking sheet will be
          emailed to me, and I'll need to return the signed waiver before the
          event.
        </span>
      </label>

      {errorMsg ? (
        <p className="text-red-400 text-sm">{errorMsg}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-gold w-full md:w-auto"
      >
        {status === "submitting" ? "Sending..." : "Count Me In →"}
      </button>
    </form>
  );
}
