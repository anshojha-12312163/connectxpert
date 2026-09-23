import { motion } from "framer-motion";
import { Linkedin, Mail, Sparkles, Award, ShieldCheck, ArrowUpRight } from "lucide-react";
import { SectionBadge, Avatar } from "./bits";

const FOUNDERS = [
  {
    name: "Ansh Ojha",
    role: "Founder & Managing Principal",
    track: "Strategic Advisory, Enterprise Cloud & Product Systems",
    bio: "Pioneering operator-led business advisory. Leads executive consulting, digital roadmap execution, and high-impact advisory for high-growth enterprises.",
    avatarBg: "from-blue-600 to-indigo-600",
    initials: "AO",
    linkedin: "https://linkedin.com",
    email: "anshojha420@gmail.com",
    specialties: ["Executive Strategy", "Cloud Architecture", "Product Scaling", "GTM Strategy"],
  },
  {
    name: "Mayank Pandey",
    role: "Co-Founder & Head of Technology",
    track: "Full-Stack Engineering & Scalable Systems",
    bio: "Enterprise engineering leader orchestrating modern cloud infrastructure, distributed microservices, technical audits, and high-performance developer teams.",
    avatarBg: "from-emerald-600 to-teal-600",
    initials: "MP",
    linkedin: "https://linkedin.com",
    email: "mayank@connectxpert.com",
    specialties: ["Cloud Migration", "Distributed Systems", "Technical Due Diligence", "DevOps & SRE"],
  },
  {
    name: "Dhiraj Gupta",
    role: "Co-Founder & Head of Growth & Operations",
    track: "Revenue Operations & Market Expansion",
    bio: "Growth architect specializing in inbound pipeline generation, customer acquisition models, enterprise sales operations, and international expansion.",
    avatarBg: "from-purple-600 to-pink-600",
    initials: "DG",
    linkedin: "https://linkedin.com",
    email: "dhiraj@connectxpert.com",
    specialties: ["Growth Marketing", "Demand Generation", "Sales Ops", "Scale-Up Operations"],
  },
];

export function Founders() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-blue-600/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 right-10 size-[500px] rounded-full bg-emerald-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <SectionBadge>Leadership & Founders</SectionBadge>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Built by operators. <span className="text-gradient">Led by specialists.</span>
          </h2>

          <p className="mt-4 text-base text-white/60 leading-relaxed max-w-2xl">
            Meet the founding team behind ConnectXpert & Ansh Consultancy — dedicated to replacing slow agency retainers with direct, high-impact specialist execution.
          </p>
        </div>

        {/* Founders Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FOUNDERS.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.12 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0d121f]/80 p-7 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:bg-[#111827]/90 hover:shadow-2xl hover:shadow-emerald-950/30"
            >
              {/* Card top badge */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="relative">
                    <div className={`size-14 rounded-2xl bg-gradient-to-tr ${member.avatarBg} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {member.initials}
                    </div>
                    <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[#0d121f]">
                      <ShieldCheck className="size-3 text-white" />
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70">
                    <Sparkles className="size-3 text-amber-400" /> Co-Founder
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-400 mt-0.5 mb-1">{member.role}</p>
                <p className="text-[11px] text-white/40 mb-4">{member.track}</p>

                <p className="text-xs text-white/70 leading-relaxed mb-6">{member.bio}</p>

                {/* Specialties Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {member.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-lg border border-white/5 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-white/60"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action links */}
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
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
                  <span>LinkedIn</span>
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mission quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950/30 via-[#101726]/60 to-emerald-950/30 p-8 text-center backdrop-blur-md"
        >
          <p className="text-base sm:text-lg italic text-white/80 font-display max-w-3xl mx-auto leading-relaxed">
            “We created ConnectXpert to replace expensive, opaque retainers with direct, 1-on-1 access to seasoned operators who solve problems on day one.”
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold">
            <Award className="size-4" /> Ansh Ojha, Mayank Pandey & Dhiraj Gupta · Founding Partners
          </div>
        </motion.div>
      </div>
    </section>
  );
}
