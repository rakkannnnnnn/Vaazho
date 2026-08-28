import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("Please complete all fields.");
      return;
    }

    if (!emailIsValid) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <section className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
            Contact VAZHO
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Get in touch</h1>
          <p className="mt-5 max-w-md leading-7 text-neutral-600 dark:text-neutral-400">
            Have a question, feedback, or need help exploring the platform? Send
            us a message and we&apos;ll keep it in mind as VAZHO grows.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold">Name</label>
              <Input
                id="contact-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold">Email</label>
              <Input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold">Subject</label>
            <Input
              id="contact-subject"
              value={form.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              placeholder="How can we help?"
              required
            />
          </div>

          <div className="mt-5">
            <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold">Message</label>
            <textarea
              id="contact-message"
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Write your message here"
              rows="6"
              required
              className="flex w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm text-neutral-900 shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30 dark:text-white"
            />
          </div>

          {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">{error}</p>}
          {submitted && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">Thanks! Your message has been received.</p>}

          <Button type="submit" size="lg" className="mt-6 h-12 w-full rounded-xl">Send Message</Button>
        </form>
      </section>
    </main>
  );
}

export default Contact;
