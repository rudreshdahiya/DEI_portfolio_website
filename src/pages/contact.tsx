import { useState } from "react";
import { Link } from "react-router";
import { track } from "@vercel/analytics";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGlobalSettings } from "@/hooks/use-global-settings";

// ── Types ─────────────────────────────────────────────────────────────────────

type InquiryType = "speaking" | "consulting" | "partner" | "community" | "";

interface FormState {
  inquiryType: InquiryType;
  name: string;
  organisation: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  inquiryType?: string;
  email?: string;
  message?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Please tell me your name.";
  if (!form.inquiryType) errors.inquiryType = "Please choose what you're reaching out about.";
  if (!form.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!form.message.trim()) errors.message = "Please share a bit more about what you have in mind.";
  return errors;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Contact() {
  const { settings: globalSettings } = useGlobalSettings();
  const contactEmail = globalSettings.contact_email || "hello@bloominginpain.com";

  const [form, setForm] = useState<FormState>({
    inquiryType: "",
    name: "",
    organisation: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleInquiryType(value: InquiryType) {
    setForm((prev) => ({ ...prev, inquiryType: value }));
    if (errors.inquiryType) setErrors((prev) => ({ ...prev, inquiryType: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      const focusOrder: (keyof FormErrors)[] = ["name", "inquiryType", "email", "message"];
      const firstKey = focusOrder.find((k) => validation[k]);
      if (firstKey) document.getElementById(firstKey)?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          inquiry_type: form.inquiryType,
          name: form.name,
          organisation: form.organisation,
          email: form.email,
          message: form.message,
        }),
      });

      if (!response.ok) throw new Error("Submission failed");

      track("contact_form_submitted", { inquiry_type: form.inquiryType });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(
        `Something went wrong sending your message. Please try again, or email ${contactEmail} directly.`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <section aria-labelledby="success-heading" className="px-6 py-24 md:py-36">
        <div className="max-w-[60ch] mx-auto text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ color: "var(--bloom)" }}
          >
            Message received
          </p>
          <h1
            id="success-heading"
            className="text-4xl md:text-5xl text-foreground mb-6"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Thank you for reaching out.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            I read every message personally and typically respond within 3–5
            working days. If your inquiry is time-sensitive, you can also reach
            me directly at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              {contactEmail}
            </a>
            .
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              to="/"
              className="inline-flex items-center px-7 py-3 rounded-md font-semibold text-base text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--plum)" }}
            >
              Back to home
            </Link>
            <Link
              to="/blooming-in-pain"
              className="text-base text-foreground underline underline-offset-4 hover:text-primary transition-colors self-center"
            >
              Read stories →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <PageMeta
        title="Contact — Work With Pratik Aggarwal"
        description="Get in touch with Pratik Aggarwal for partnership, speaking, consulting, or community inquiries. Disability inclusion work rooted in lived experience."
        path="/contact"
        keywords="hire disability speaker India, partner with Pratik Aggarwal, book disability inclusion training, contact Blooming in Pain"
      />
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Pratik Aggarwal",
        "url": "https://pratik-aggarwal-website.vercel.app/contact",
        "description": "Contact page for Pratik Aggarwal — disability inclusion expert, speaker, and founder of Blooming in Pain.",
        "mainEntity": { "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal" }
      }} />

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <section aria-labelledby="contact-heading" className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--bloom)" }}
          >
            Get in touch
          </p>
          <h1
            id="contact-heading"
            className="text-4xl md:text-5xl text-foreground mb-5"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Let's work together.
          </h1>
          <p className="text-lg text-muted-foreground max-w-[52ch] leading-relaxed">
            Fill in the blanks below — or if you prefer,{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              email me directly
            </a>
            .
          </p>
        </div>
      </section>

      <div className="border-t border-border" aria-hidden="true" />

      {/* ── Body: sidebar + form ─────────────────────────────────────────── */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[280px_1fr] gap-16">

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside aria-label="Contact details">
            <div className="space-y-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Email
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-base text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                >
                  {contactEmail}
                </a>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  I typically respond within 3–5 working days.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Follow
                </p>
                <ul className="space-y-2.5 list-none m-0 p-0">
                  <li>
                    <a
                      href="https://instagram.com/bloominginpain"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                    >
                      Instagram
                      <span className="sr-only">(opens in new tab)</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com/in/pratikaggarwal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                    >
                      LinkedIn
                      <span className="sr-only">(opens in new tab)</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Blooming in Pain
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Want to share your story of living with an invisible disability?
                </p>
                <Link
                  to="/blooming-in-pain"
                  className="text-sm font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
                  style={{ color: "var(--sage)" }}
                >
                  Learn how to contribute →
                </Link>
              </div>
            </div>
          </aside>

          {/* ── Form ─────────────────────────────────────────────────────── */}
          <div>
            <form onSubmit={handleSubmit} noValidate aria-label="Contact form">

              {/* ── Mad-Libs sentence ──────────────────────────────────── */}
              <fieldset className="mb-10 border-0 p-0 m-0">
                <legend className="sr-only">Tell me about yourself and your inquiry</legend>

                <p
                  className="leading-[2.2]"
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: "clamp(1.25rem, 2.8vw, 1.75rem)",
                    color: "var(--ink)",
                  }}
                >
                  <span>Hi Pratik, I'm </span>
                  <label htmlFor="name" className="sr-only">Your name (required)</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="your name"
                    value={form.name}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "err-name" : undefined}
                    className="ml-field"
                    style={{ width: "clamp(8ch, 18ch, 22ch)" }}
                  />
                  <span> from </span>
                  <label htmlFor="organisation" className="sr-only">Organisation (optional)</label>
                  <input
                    id="organisation"
                    name="organisation"
                    type="text"
                    autoComplete="organization"
                    placeholder="your org"
                    value={form.organisation}
                    onChange={handleChange}
                    className="ml-field"
                    style={{ width: "clamp(8ch, 18ch, 22ch)" }}
                  />
                  <span>, reaching out about </span>
                  <label htmlFor="inquiryType" className="sr-only">Type of inquiry (required)</label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={form.inquiryType}
                    onChange={(e) => handleInquiryType(e.target.value as InquiryType)}
                    aria-required="true"
                    aria-invalid={!!errors.inquiryType}
                    aria-describedby={errors.inquiryType ? "err-type" : undefined}
                    className="ml-field ml-select"
                    style={{ minWidth: "17ch" }}
                  >
                    <option value="">choose one</option>
                    <option value="speaking">a speaking engagement</option>
                    <option value="consulting">consulting work</option>
                    <option value="partner">a partnership</option>
                    <option value="community">Blooming in Pain</option>
                  </select>
                  <span>. Reach me at </span>
                  <label htmlFor="email" className="sr-only">Your email address (required)</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "err-email" : undefined}
                    className="ml-field"
                    style={{ width: "clamp(10ch, 22ch, 26ch)" }}
                  />
                  <span>.</span>
                </p>

                {/* Error summary */}
                {hasErrors && (
                  <div
                    role="alert"
                    aria-label="Please fix the following"
                    className="mt-5 space-y-1.5"
                  >
                    {errors.name && (
                      <p id="err-name" className="text-sm" style={{ color: "var(--destructive)" }}>
                        <a href="#name" className="underline underline-offset-2 hover:no-underline">Name</a>
                        : {errors.name}
                      </p>
                    )}
                    {errors.inquiryType && (
                      <p id="err-type" className="text-sm" style={{ color: "var(--destructive)" }}>
                        <a href="#inquiryType" className="underline underline-offset-2 hover:no-underline">Inquiry type</a>
                        : {errors.inquiryType}
                      </p>
                    )}
                    {errors.email && (
                      <p id="err-email" className="text-sm" style={{ color: "var(--destructive)" }}>
                        <a href="#email" className="underline underline-offset-2 hover:no-underline">Email</a>
                        : {errors.email}
                      </p>
                    )}
                    {errors.message && (
                      <p id="err-message" className="text-sm" style={{ color: "var(--destructive)" }}>
                        <a href="#message" className="underline underline-offset-2 hover:no-underline">Message</a>
                        : {errors.message}
                      </p>
                    )}
                  </div>
                )}
              </fieldset>

              {/* ── Message ──────────────────────────────────────────────── */}
              <div className="mb-10">
                <label
                  htmlFor="message"
                  className="block text-base font-semibold mb-3"
                  style={{ color: "var(--ink)" }}
                >
                  Anything else to share?{" "}
                  <span aria-hidden="true" style={{ color: "var(--destructive)" }}>*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  aria-required="true"
                  aria-describedby={errors.message ? "err-message" : undefined}
                  aria-invalid={!!errors.message}
                  className={`text-base resize-none ${errors.message ? "border-destructive" : ""}`}
                  placeholder="Context, timing, questions you already have — whatever feels useful."
                />
              </div>

              {/* ── Submit ───────────────────────────────────────────────── */}
              {submitError && (
                <p role="alert" className="text-sm mb-4" style={{ color: "var(--destructive)" }}>
                  {submitError}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 text-base font-semibold text-white disabled:opacity-60"
                  style={{ backgroundColor: "var(--plum)" }}
                  onClick={() =>
                    !isSubmitting &&
                    track("cta_clicked", { label: "Send message", location: "contact_form" })
                  }
                >
                  {isSubmitting ? "Sending…" : "Send message"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  <span aria-hidden="true">*</span> Required field
                </p>
              </div>

            </form>
          </div>

        </div>
      </section>
    </>
  );
}
