import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { track } from "@vercel/analytics";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  condition: string;
  title: string;
  story: string;
  anythingElse: string;
  consent: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  story?: string;
  consent?: string;
}

// ── Validation ────────────────────────────────────────────────────────────────

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Please enter your name.";
  if (!form.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!form.story.trim()) errors.story = "Please share something — even a few lines is a start.";
  if (!form.consent) errors.consent = "Please confirm you're happy for us to review your story.";
  return errors;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BloomingInPainSubmit() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    condition: "",
    title: "",
    story: "",
    anythingElse: "",
    consent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleConsent(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, consent: e.target.checked }));
    if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      const focusableIds: Partial<Record<keyof FormErrors, string>> = {
        name: "name",
        email: "email",
        story: "story",
        consent: "consent",
      };
      const firstKey = Object.keys(validation)[0] as keyof FormErrors;
      const focusId = focusableIds[firstKey];
      if (focusId) document.getElementById(focusId)?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const endpoint = import.meta.env.VITE_STORY_FORM_ENDPOINT;
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            condition: form.condition,
            title: form.title,
            story: form.story,
            anything_else: form.anythingElse,
          }),
        });

        if (!response.ok) {
          throw new Error("Submission failed");
        }
      } else {
        // Fallback for preview/development when form endpoint is not configured
        await new Promise((res) => setTimeout(res, 800));
        const saved = JSON.parse(localStorage.getItem("bip_story_submissions") || "[]");
        saved.push({ ...form, timestamp: new Date().toISOString() });
        localStorage.setItem("bip_story_submissions", JSON.stringify(saved));
      }

      track("story_submitted");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Something went wrong. Please try again, or email hello@bloominginpain.com directly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Success ───────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <section aria-labelledby="submit-success-heading" className="px-6 py-24 md:py-36">
        <div className="max-w-[60ch] mx-auto text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ color: "var(--bloom)" }}
          >
            Story received
          </p>
          <h1
            id="submit-success-heading"
            className="text-4xl md:text-5xl text-foreground mb-6"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Thank you for sharing.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            We read every submission personally. You'll hear from us within two
            weeks — whether your story is ready to publish as-is, or whether we'd
            like to work on it with you a little more.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            Either way, the fact that you wrote it matters.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              to="/blooming-in-pain"
              className="inline-flex items-center px-7 py-3 rounded-md font-semibold text-base text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--plum)" }}
            >
              Back to Blooming in Pain
            </Link>
            <Link
              to="/"
              className="text-base text-foreground underline underline-offset-4 hover:text-primary transition-colors self-center"
            >
              Go to home →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────

  return (
    <>
      <PageMeta
        title="Share Your Story — Blooming in Pain"
        description="Submit your story to Blooming in Pain — a storytelling platform for people living with invisible disabilities. No diagnosis required. Just honesty."
        path="/blooming-in-pain/submit"
        keywords="submit invisible disability story, share chronic illness experience, Blooming in Pain submissions"
      />
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Share Your Story — Blooming in Pain",
        "url": "https://pratik-aggarwal-website.vercel.app/blooming-in-pain/submit",
        "description": "Story submission page for Blooming in Pain. People living with invisible disabilities can share their honest accounts for publication on the platform.",
        "isPartOf": { "@id": "https://pratik-aggarwal-website.vercel.app/#blooming-in-pain" }
      }} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="px-6 pt-20 pb-14 border-b border-border"
        style={{ backgroundColor: "var(--ground)" }}
      >
        <div className="max-w-[70ch] mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "var(--bloom)" }}
          >
            Blooming in Pain
          </p>
          <h1
            className="text-4xl md:text-5xl text-foreground mb-5 tracking-tight"
            style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.07 }}
          >
            Share your story.
          </h1>
          <div className="space-y-3 text-lg text-muted-foreground leading-relaxed max-w-[52ch]">
            <p>
              We're not looking for polished essays. We're looking for <span data-key-info>honest accounts of what your life actually looks like</span> — how you manage, how you don't, what helps, and what doesn't.
            </p>
            <p>
              <span data-key-info>You don't need a diagnosis to contribute.</span> You need to have lived it.
            </p>
          </div>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[280px_1fr] gap-16">

          {/* ── Sidebar ────────────────────────────────────────────────────── */}
          <aside aria-label="Submission guidelines">
            <div className="space-y-10">

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--bloom)" }}
                >
                  What we publish
                </p>
                <ul className="space-y-2.5 text-sm text-muted-foreground leading-relaxed list-none m-0 p-0">
                  {[
                    "First-person accounts of living with invisible or chronic conditions",
                    "Stories about navigating healthcare, work, or relationships",
                    "Experiences of being doubted, misdiagnosed, or dismissed",
                    "What good days and bad days actually feel like",
                    "Anything honest about a life that doesn't fit the standard script",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 items-start">
                      <span
                        className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "var(--plum)" }}
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--bloom)" }}
                >
                  What we don't publish
                </p>
                <ul className="space-y-2.5 text-sm text-muted-foreground leading-relaxed list-none m-0 p-0">
                  {[
                    "Inspiration-porn or 'overcoming' narratives",
                    "Medical advice or treatment recommendations",
                    "Content that identifies or shames specific individuals",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 items-start">
                      <span
                        className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-muted-foreground/40"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--bloom)" }}
                >
                  Timeline
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We'll be in touch within two weeks — whether we want to
                  publish as-is, or work on it together.
                </p>
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--bloom)" }}
                >
                  Questions?
                </p>
                <a
                  href="mailto:hello@bloominginpain.com"
                  className="text-sm text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                >
                  hello@bloominginpain.com
                </a>
              </div>

            </div>
          </aside>

          {/* ── Form ──────────────────────────────────────────────────────── */}
          <div>
            <form onSubmit={handleSubmit} noValidate aria-label="Story submission form">

              {/* Name */}
              <div className="mb-6">
                <Label htmlFor="name" className="text-base font-semibold text-foreground mb-2 block">
                  Your name{" "}
                  <span aria-hidden="true" className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  We publish under whatever name you choose — real name, first name only, or a pseudonym.
                </p>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.name ? "name-error" : undefined}
                  aria-invalid={!!errors.name}
                  className={`text-base h-12 ${errors.name ? "border-destructive" : ""}`}
                  placeholder="The name you'd like published with your story"
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="text-sm text-destructive mt-1.5">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-6">
                <Label htmlFor="email" className="text-base font-semibold text-foreground mb-2 block">
                  Email address{" "}
                  <span aria-hidden="true" className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={!!errors.email}
                  className={`text-base h-12 ${errors.email ? "border-destructive" : ""}`}
                  placeholder="We'll only use this to follow up with you"
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="text-sm text-destructive mt-1.5">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Condition */}
              <div className="mb-6">
                <Label htmlFor="condition" className="text-base font-semibold text-foreground mb-2 block">
                  What are you writing about?{" "}
                  <span className="text-sm font-normal text-muted-foreground">(optional)</span>
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  A condition, a situation, an experience — whatever fits. You don't need a diagnosis.
                </p>
                <Input
                  id="condition"
                  name="condition"
                  type="text"
                  value={form.condition}
                  onChange={handleChange}
                  className="text-base h-12"
                  placeholder="e.g. fibromyalgia, chronic fatigue, navigating diagnosis, workplace disclosure"
                />
              </div>

              {/* Title */}
              <div className="mb-6">
                <Label htmlFor="title" className="text-base font-semibold text-foreground mb-2 block">
                  Working title{" "}
                  <span className="text-sm font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  className="text-base h-12"
                  placeholder="We can work on this together if you're not sure yet"
                />
              </div>

              {/* Story */}
              <div className="mb-6">
                <Label htmlFor="story" className="text-base font-semibold text-foreground mb-2 block">
                  Your story{" "}
                  <span aria-hidden="true" className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Write as much or as little as you have. Drafts, fragments, and half-formed things are welcome — we'll work from there.
                </p>
                <Textarea
                  id="story"
                  name="story"
                  rows={12}
                  value={form.story}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.story ? "story-error" : undefined}
                  aria-invalid={!!errors.story}
                  className={`text-base resize-y ${errors.story ? "border-destructive" : ""}`}
                  placeholder="Start wherever feels right."
                />
                {errors.story && (
                  <p id="story-error" role="alert" className="text-sm text-destructive mt-1.5">
                    {errors.story}
                  </p>
                )}
              </div>

              {/* Anything else */}
              <div className="mb-8">
                <Label htmlFor="anythingElse" className="text-base font-semibold text-foreground mb-2 block">
                  Anything else you'd like us to know?{" "}
                  <span className="text-sm font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="anythingElse"
                  name="anythingElse"
                  rows={3}
                  value={form.anythingElse}
                  onChange={handleChange}
                  className="text-base resize-none"
                  placeholder="Concerns about anonymity, context about your situation, or anything else."
                />
              </div>

              {/* Consent */}
              <div className="mb-10">
                <div className="flex gap-3 items-start">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={handleConsent}
                    aria-required="true"
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    aria-invalid={!!errors.consent}
                    className="mt-1 w-4 h-4 flex-shrink-0 accent-secondary cursor-pointer"
                  />
                  <Label
                    htmlFor="consent"
                    className="text-base text-foreground leading-relaxed cursor-pointer"
                  >
                    I understand my story will be reviewed before publication, and that the team may reach out to discuss edits or context.{" "}
                    <span aria-hidden="true" className="text-destructive">*</span>
                  </Label>
                </div>
                {errors.consent && (
                  <p id="consent-error" role="alert" className="text-sm text-destructive mt-2 ml-7">
                    {errors.consent}
                  </p>
                )}
              </div>

              {/* Submit */}
              {submitError && (
                <p role="alert" className="text-sm text-destructive mb-4">
                  {submitError}
                </p>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 text-base font-semibold disabled:opacity-60"
                  style={{ backgroundColor: "var(--plum)" }}
                >
                  {isSubmitting ? "Sending…" : "Submit your story"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  <span aria-hidden="true">*</span> Required fields
                </p>
              </div>

            </form>
          </div>
        </div>
      </section>
    </>
  );
}
