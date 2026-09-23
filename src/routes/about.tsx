import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Mail, ArrowUpRight, ShieldCheck, Sparkles, Building, Rocket, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Nav } from "@/components/lanx/nav";
import { Footer } from "@/components/lanx/footer";
import { SectionHeading, Avatar } from "@/components/lanx/bits";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us & Founding Team — ConnectXpert" },
      { name: "description", content: "Learn about ConnectXpert & Ansh Consultancy leadership. Founded by Ansh Ojha, Mayank Pandey, and Dhiraj Gupta." },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { value: "6", label: "Core Advisory Verticals", source: "Strategy, Tech, Marketing, Legal, Design, Finance" },
  { value: "100%", label: "Direct Specialist Sessions", source: "Zero middleman reps or junior handoffs" },
  { value: "70%", label: "Faster Resolution vs Agencies", source: "Operator Advisory Model" },
  { value: "<24h", label: "Average Booking Response", source: "Live platform scheduling window" },
];

const team = [
  {
    name: "Ansh Ojha",
    role: "Founder & Managing Principal",
    track: "Strategic Advisory & Product Architecture",
    bio: "Pioneering operator-led business advisory. Leads executive consulting, digital roadmap execution, and high-impact scaling sessions.",
    avatarBg: "from-blue-600 to-indigo-600",
    initials: "AO",
    linkedin: "https://linkedin.com",
    email: "anshojha420@gmail.com",
    founder: true,
  },
  {
    name: "Mayank Pandey",
    role: "Co-Founder & Head of Technology",
    track: "Cloud Infrastructure & Scalable Systems",
    bio: "Engineering leader overseeing distributed cloud systems, modern enterprise migration, technical audits, and engineering roadmaps.",
    avatarBg: "from-emerald-600 to-teal-600",
    initials: "MP",
    linkedin: "https://linkedin.com",
    email: "mayank@connectxpert.com",
    founder: true,
  },
  {
    name: "Dhiraj Gupta",
    role: "Co-Founder & Head of Growth & Operations",
    track: "Revenue Operations & Market Expansion",
    bio: "Growth strategist specializing in customer acquisition systems, sales pipeline architecture, and high-velocity business scaling.",
    avatarBg: "from-purple-600 to-pink-600",
    initials: "DG",
    linkedin: "https://linkedin.com",
    email: "dhiraj@connectxpert.com",
    founder: true,
  },
  {
    name: "Sarah Chen",
    role: "Partner · Strategy & Market Entry",
    track: "GTM Strategy & Enterprise OKRs",
    bio: "10+ years guiding scaling businesses through GTM resets, unit economics optimization, and multi-market entry initiatives.",
    avatarBg: "from-amber-600 to-orange-600",
    initials: "SC",
    linkedin: "https://linkedin.com",
    email: "sarah@connectxpert.com",
    founder: false,
  },
];

const values = [
  { icon: ShieldCheck, title: "Radical Transparency", description: "Clear hourly pricing, straightforward advice, and measurable objectives. No hidden fees or inflated scope." },
  { icon: Award,       title: "Operator-Led Guidance", description: "Every advisor has proven real operational experience in their discipline, not theoretical slide decks." },
  { icon: Rocket,      title: "Client First & Zero Lock-In", description: "Book when you need guidance, pause when you don't. Your operational freedom is paramount." },
  { icon: Building,    title: "Data-Backed Rigor", description: "All strategic recommendations are rooted in real telemetry, unit economics, and proven frameworks." },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-white">
      <Nav />
      <main className="pt-24 pb-16">

        {/* Hero */}
        <section className="relative overflow-hidden py-24">
          <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto max-w-3xl px-5 text-center"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
              <Sparkles className="size-3.5" /> Our Mission & Vision
            </span>
            <h1 className="mt-6 text-4xl font-bold text-gradient leading-tight sm:text-6xl">
              High-impact advisory for ambitious teams.
            </h1>
            <p className="mt-6 text-base text-white/60 leading-relaxed sm:text-lg">
              ConnectXpert and Ansh Consultancy were established to eliminate the friction, bloat, and retainers of traditional consulting — connecting you directly with vetted domain experts for actionable execution.
            </p>
          </motion.div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-white/10 bg-white/[0.02] py-14">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
              {stats.map(({ value, label, source }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex flex-col items-center gap-1.5 text-center px-3"
                >
                  <span className="text-4xl font-bold text-gradient sm:text-5xl">{value}</span>
                  <span className="text-sm font-semibold text-white/90">{label}</span>
                  <span className="text-[11px] text-white/40">{source}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Leadership */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHeading
              badge="Leadership Team"
              title="The people behind the execution"
              subtitle="Experienced founders, engineers, and strategists who build, scale, and guide transformative businesses."
            />
            
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0d121f]/90 p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:bg-[#111827] hover:shadow-xl hover:shadow-emerald-950/20"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`size-14 rounded-2xl bg-gradient-to-tr ${member.avatarBg} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                        {member.initials}
                      </div>
                      {member.founder && (
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          Founder
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-400 mb-1">{member.role}</p>
                    <p className="text-[11px] text-white/40 mb-3">{member.track}</p>
                    <p className="text-xs text-white/60 leading-relaxed">{member.bio}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
                    >
                      <Mail className="size-3.5 text-emerald-400" />
                      <span>Contact</span>
                    </a>

                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Linkedin className="size-3.5" />
                      <span>Connect</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20 border-t border-white/10 bg-white/[0.01]">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
                  Core Values
                </span>
                <h2 className="mt-5 text-3xl font-bold text-white sm:text-5xl">
                  Our mission is your growth.
                </h2>
                <p className="mt-5 text-sm sm:text-base text-white/60 leading-relaxed">
                  We exist to make world-class business and technical consulting accessible to companies of every size. Too many great ideas fail not because they lack potential, but because they lack the right guidance at the right time.
                </p>
                <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed">
                  We bridge that gap — bringing the kind of strategic thinking, execution support, and operator talent that used to be reserved for Fortune 500 enterprises, and making it available to the builders, founders, and teams who need it most.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map(({ icon: Icon, title, description }, idx) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-[#0d121f]/60 p-6 backdrop-blur-sm hover:border-emerald-500/30 transition-colors"
                  >
                    <div className="size-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                      <Icon className="size-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed">{description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
