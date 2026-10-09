import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { track } from "@vercel/analytics";
import { trackEvent } from "@/lib/analytics";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGlobalSettings } from "@/hooks/use-global-settings";
import { useContactSettings } from "@/hooks/use-contact-settings";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  inquiryType: string;
  name: string;
  organisation: string;
  phone: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  inquiryType?: string;
  email?: string;
  phone?: string;
  message?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) errors.name = "Please tell me your name.";
  if (!form.inquiryType) errors.inquiryType = "Please choose what you're reaching out about.";
  
  const emailTrimmed = form.email.trim();
  const phoneTrimmed = form.phone.trim();
  const hasEmail = emailTrimmed.length > 0;
  const hasPhone = phoneTrimmed.length > 0;

  // Regex patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,14}$/;

  if (!hasEmail && !hasPhone) {
    errors.email = "Please enter either a valid email address or phone number so Pratik can reach you.";
  } else {
    if (hasEmail && !emailRegex.test(emailTrimmed)) {
      errors.email = "Please enter a valid email address (e.g. name@domain.com).";
    }

    if (hasPhone) {
      const digitsOnly = phoneTrimmed.replace(/[\s\-\(\)\.]/g, "");
      if (!phoneRegex.test(phoneTrimmed) || digitsOnly.length < 7 || digitsOnly.length > 15) {
        errors.phone = "Please enter a valid mobile number (e.g. +91 9876543210).";
      }
    }
  }

  if (!form.message.trim()) errors.message = "Please share a bit more about what you have in mind.";
  return errors;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Contact() {
  const { settings: globalSettings } = useGlobalSettings();
  const { settings: contactSettings } = useContactSettings();
  const [searchParams] = useSearchParams();

  const primaryEmail = contactSettings.recipient_email || globalSettings.contact_email || "Pratik@asthaindia.in";
  const bloomingEmail = contactSettings.blooming_email || "hello@bloominginpain.com";
  const webhookUrl = contactSettings.webhook_url || import.meta.env.VITE_CONTACT_FORM_ENDPOINT;

  const inquiryTypes = contactSettings.inquiry_types && contactSettings.inquiry_types.length > 0
    ? contactSettings.inquiry_types
    : [
        "Keynote Speaking & Panels",
        "Corporate Inclusion Workshop",
        "Institutional / DEI Advisory",
        "Blooming in Pain (Stories & Initiatives)",
        "Media & Press Inquiry",
        "General Inquiry",
      ];

  const [form, setForm] = useState<FormState>({
    inquiryType: "",
    name: "",
    organisation: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-select inquiry type from URL query params (e.g., /contact?type=speaking)
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) {
      const paramLower = typeParam.toLowerCase();
      const matched = inquiryTypes.find((t) => t.toLowerCase().includes(paramLower));
      if (matched) {
        setForm((prev) => ({ ...prev, inquiryType: matched }));
      }
    }
  }, [searchParams, inquiryTypes]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleInquiryType(value: string) {
    setForm((prev) => ({ ...prev, inquiryType: value }));
    if (errors.inquiryType) setErrors((prev) => ({ ...prev, inquiryType: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      const focusOrder: (keyof FormErrors)[] = ["name", "inquiryType", "email", "phone", "message"];
      const firstKey = focusOrder.find((k) => validation[k]);
      if (firstKey) document.getElementById(firstKey)?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const isBlooming = form.inquiryType.toLowerCase().includes("blooming") ||
                       form.inquiryType.toLowerCase().includes("pain") ||
                       form.inquiryType.toLowerCase().includes("story");

    try {
      if (!webhookUrl || webhookUrl.includes("YOUR_CONTACT_FORM_ID")) {
        throw new Error("Contact form endpoint not configured");
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          inquiry_type: form.inquiryType,
          name: form.name,
          organisation: form.organisation,
          phone: form.phone,
          email: form.email,
          message: form.message,
          recipient_email: primaryEmail,
          blooming_email: bloomingEmail,
          is_blooming_inquiry: isBlooming,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok && response.type !== "opaque") {
        throw new Error("Submission failed");
      }

      track("contact_form_submitted", { inquiry_type: form.inquiryType });
      trackEvent("contact_form_submitted", { inquiry_type: form.inquiryType, name: form.name });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      console.error("Form submit error:", err);
      setSubmitError(
        `Something went wrong sending your message. Please try again, or email ${primaryEmail} directly.`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────

  if (submitted) {
    const contactDetail = form.email || form.phone || "your contact info";
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
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            I've received your inquiry regarding <strong className="text-foreground">{form.inquiryType}</strong> and will get back to you at <strong className="text-foreground">{contactDetail}</strong> shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center h-12 px-6 rounded-md font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--plum)" }}
            >
              Back to Home
            </Link>
            <Link
              to="/work"
              className="inline-flex items-center justify-center h-12 px-6 rounded-md font-semibold border border-input bg-background hover:bg-accent transition-colors"
            >
              Explore Selected Work
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <PageMeta
        title={`${contactSettings.hero_title || "Contact"} — Work With Pratik Aggarwal`}
        description={contactSettings.hero_subtitle || "Contact page for Pratik Aggarwal — disability inclusion expert, speaker, and founder of Blooming in Pain."}
        path="/contact"
        keywords="hire disability speaker India, partner with Pratik Aggarwal, book disability inclusion training, contact Blooming in Pain"
      />

      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Pratik Aggarwal",
          "url": "https://pratik-aggarwal-website.vercel.app/contact",
          "description": "Contact page for Pratik Aggarwal — disability inclusion expert, speaker, and founder of Blooming in Pain.",
        }}
      />

      <section aria-labelledby="contact-heading" className="px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">

          {/* ── Page Header ──────────────────────────────────────────────── */}
          <header className="max-w-2xl mb-16 md:mb-20">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--bloom)" }}
            >
              Get in Touch
            </p>
            <h1
              id="contact-heading"
              className="text-4xl md:text-6xl text-foreground mb-6 leading-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {contactSettings.hero_title || "Start a Partnership"}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              {contactSettings.hero_subtitle || "Reach out to discuss training, institutional advisory, keynote invitations, or research collaborations."}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <aside aria-label="Contact details" className="lg:col-span-4">
              <div className="p-8 rounded-2xl bg-secondary/30 border border-border space-y-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Primary Contact
                  </p>
                  <a
                    href={`mailto:${primaryEmail}`}
                    className="text-lg font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors block break-all"
                  >
                    {primaryEmail}
                  </a>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {contactSettings.response_time_note || "Pratik typically responds within 2 business days."}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Follow & Connect
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
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Blooming in Pain
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Want to share your story of living with a chronic condition or invisible illness?
                  </p>
                  <a
                    href={`mailto:${bloomingEmail}`}
                    className="text-sm font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity block mb-2"
                    style={{ color: "var(--bloom)" }}
                  >
                    {bloomingEmail}
                  </a>
                  <Link
                    to="/blooming-in-pain"
                    className="text-sm font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity inline-block"
                    style={{ color: "var(--sage)" }}
                  >
                    Learn about Blooming in Pain →
                  </Link>
                </div>
              </div>
            </aside>

            {/* ── Form ─────────────────────────────────────────────────────── */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit} noValidate aria-label="Contact form">

                {/* ── Mad-Libs style form sentence ──────────────────────── */}
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
                      style={{ width: `${Math.max(form.name.length, 9)}ch` }}
                    />

                    {contactSettings.show_organisation_field !== false && (
                      <>
                        <span> from </span>
                        <label htmlFor="organisation" className="sr-only">Organisation (optional)</label>
                        <input
                          id="organisation"
                          name="organisation"
                          type="text"
                          autoComplete="organization"
                          placeholder={contactSettings.organisation_label || "your org"}
                          value={form.organisation}
                          onChange={handleChange}
                          className="ml-field"
                          style={{ width: `${Math.max(form.organisation.length, (contactSettings.organisation_label || "your org").length)}ch` }}
                        />
                      </>
                    )}

                    <span>, reaching out about </span>
                    <label htmlFor="inquiryType" className="sr-only">Type of inquiry (required)</label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={form.inquiryType}
                      onChange={(e) => handleInquiryType(e.target.value)}
                      aria-required="true"
                      aria-invalid={!!errors.inquiryType}
                      aria-describedby={errors.inquiryType ? "err-type" : undefined}
                      className="ml-field ml-select"
                      style={{ maxWidth: "100%", width: "auto" }}
                    >
                      <option value="">choose one</option>
                      {inquiryTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>

                    <span>. Reach me at </span>
                    <label htmlFor="email" className="sr-only">Your email address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "err-email" : undefined}
                      className="ml-field"
                      style={{ width: `${Math.max(form.email.length, 14)}ch` }}
                    />

                    {contactSettings.show_phone_field && (
                      <>
                        <span> or phone </span>
                        <label htmlFor="phone" className="sr-only">Phone number</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="phone number"
                          value={form.phone}
                          onChange={handleChange}
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? "err-phone" : undefined}
                          className="ml-field"
                          style={{ width: `${Math.max(form.phone.length, 12)}ch` }}
                        />
                      </>
                    )}

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
                      {errors.phone && (
                        <p id="err-phone" className="text-sm" style={{ color: "var(--destructive)" }}>
                          <a href="#phone" className="underline underline-offset-2 hover:no-underline">Phone</a>
                          : {errors.phone}
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
                    {contactSettings.message_label || "Anything else to share?"}{" "}
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
                    placeholder="Context, timing, scope, or specific questions — whatever feels useful."
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
                    {isSubmitting ? "Sending…" : contactSettings.button_label || "Send message"}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    <span aria-hidden="true">*</span> Required field
                  </p>
                </div>

              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
