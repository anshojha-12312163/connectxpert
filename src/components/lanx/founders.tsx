import { Avatar, SectionBadge } from "./bits";

const words =
  "We gather your site data. We know your target audience & how your brand can standout from crowd. Best part is we also help you with Solutions".split(
    " ",
  );

export function Founders() {
  return (
    <section className="relative py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
        <SectionBadge>Founders note</SectionBadge>

        <p className="mt-8 font-display text-2xl leading-snug sm:text-4xl">
          <span className="text-foreground/70">“ </span>
          {words.map((w, i) => (
            <span
              key={`${w}-${i}`}
              style={{ color: i < 6 ? "var(--foreground)" : "var(--accent)" }}
            >
              {w}{" "}
            </span>
          ))}
          <span className="text-foreground/70">„</span>
        </p>

        <div className="mt-9 flex items-center gap-3">
          <Avatar name="Founder Lan" size={34} />
          <span className="text-sm text-muted-foreground">Co-founder &amp; ex google designer</span>
        </div>
      </div>
    </section>
  );
}
