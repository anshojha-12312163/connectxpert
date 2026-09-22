import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ConnectXpert" },
      { name: "description", content: "How ConnectXpert collects, uses, and protects your personal information." },
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
    body: `We use your information solely to respond to your enquiries, provide consulting services you request, process bookings, and send updates if you have opted in. We do not sell, rent, or trade your personal information to third parties.`,
  },
  {
    title: "3. Data Storage & Security",
    body: `Your data is stored securely using Supabase (hosted on AWS) with encryption in transit (HTTPS) and at rest. We implement industry-standard security measures to prevent unauthorised access, disclosure, or modification of your data.`,
  },
  {
    title: "4. Third-Party Services",
    body: `We use trusted third-party services including Supabase (database), Resend (transactional email), and Daily.co / Jitsi (video calls). Each provider complies with applicable data protection regulations including GDPR.`,
  },
  {
    title: "5. Your Rights",
    body: `Under applicable data protection laws, you have the right to access, correct, or request deletion of your personal data at any time. To exercise these rights, please contact us at privacy@connectxpert.com.`,
  },
  {
    title: "6. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated revision date.`,
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
              At ConnectXpert, we respect your privacy and are committed to protecting your personal information.
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
