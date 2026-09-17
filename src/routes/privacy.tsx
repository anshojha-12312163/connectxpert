import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Ansh Consultancy" },
      { name: "description", content: "How Ansh Consultancy collects, uses, and protects your personal information." },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "1. Information We Collect",
    body: `We collect information you provide directly to us when you fill out a contact form, book a demo, or subscribe to our newsletter. This includes your name, email address, company name, and any messages you send us. We also collect basic analytics data such as page views and button clicks to improve our service — this data is anonymised and contains no personally identifiable information.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use the information we collect to respond to your enquiries, schedule and manage demo bookings, send newsletters you've explicitly opted into, and improve our website and services. We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    title: "3. Data Storage",
    body: `Your data is stored securely using Supabase, which is hosted on infrastructure compliant with industry security standards. All data is encrypted in transit (TLS) and at rest. We retain contact and booking data for up to 3 years unless you request earlier deletion.`,
  },
  {
    title: "4. Cookies",
    body: `This website uses minimal cookies required for basic functionality. We do not use advertising cookies or third-party tracking cookies. You can disable cookies in your browser settings, though some site features may not work correctly as a result.`,
  },
  {
    title: "5. Your Rights",
    body: `You have the right to access, correct, or delete the personal data we hold about you at any time. To make a request, email us at anshconsultancy@mail.com with the subject "Data Request". We will respond within 14 days. You also have the right to unsubscribe from our newsletter at any time by clicking the unsubscribe link in any email we send.`,
  },
  {
    title: "6. Third-Party Services",
    body: `We use Supabase for data storage and authentication. Their privacy policy is available at supabase.com/privacy. We may use other third-party tools for analytics or communication in the future — we will update this policy accordingly and notify users where required.`,
  },
  {
    title: "7. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on this page with a revised "Last Updated" date. We encourage you to review this page periodically.`,
  },
  {
    title: "8. Contact",
    body: `If you have any questions about this Privacy Policy or our data practices, please contact us at anshconsultancy@mail.com or through the contact form on our website.`,
  },
];

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <div className="mb-10">
            <span className="inline-flex items-center rounded-full border border-primary/60 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent">
              Legal
            </span>
            <h1 className="mt-5 text-4xl font-semibold text-gradient sm:text-5xl">Privacy Policy</h1>
            <p className="mt-3 text-sm text-muted-foreground">Last updated: September 15, 2026</p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              At Ansh Consultancy, we respect your privacy and are committed to protecting your personal information.
              This policy explains what data we collect, how we use it, and what rights you have.
            </p>
          </div>

          <div className="space-y-8">
            {sections.map(({ title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-surface-2/40 p-7">
                <h2 className="text-base font-semibold mb-3">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-border bg-surface-2/40 p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">Have a question about your data?</p>
            <Link
              to="/contact"
              className="inline-flex rounded-xl px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              style={{ background: "var(--gradient-primary)" }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
