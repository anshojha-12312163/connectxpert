import { Avatar, SectionBadge } from "./bits";

const noteText =
  "We built ConnectXpert to replace opaque agency retainers with direct, transparent access to elite operators. Real specialists, zero lock-in, and measurable milestones from day one.";

export function Founders() {
  return (
    <section className="relative py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
        <SectionBadge>Platform Mission</SectionBadge>

        <p className="mt-8 font-display text-2xl leading-snug sm:text-3xl text-foreground/90 max-w-2xl">
          <span className="text-foreground/40">“</span>
          {noteText}
          <span className="text-foreground/40">”</span>
        </p>

        <div className="mt-9 flex items-center gap-3">
          <Avatar name="ConnectXpert Team" size={36} />
          <div className="text-left">
            <p className="text-xs font-semibold text-foreground">ConnectXpert Advisory Team</p>
            <p className="text-[11px] text-muted-foreground">Operator-Led Growth Network</p>
          </div>
        </div>
      </div>
    </section>
  );
}
