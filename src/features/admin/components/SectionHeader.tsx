interface SectionHeaderProps {
  title: string;
  sub?: string;
}

export const SectionHeader = ({ title, sub }: SectionHeaderProps) => (
  <div className="mb-5">
    <h2 className="text-xl md:text-2xl font-display font-black text-[var(--text-main)]">{title}</h2>
    {sub && <p className="text-sm text-[var(--text-muted)] mt-0.5">{sub}</p>}
  </div>
);
