import type { WelcomeSectionHeaderProps } from "@/components/welcome/WelcomeTypes";

export const WelcomeSectionHeader = ({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: WelcomeSectionHeaderProps) => {
  const alignment =
    align === "center"
      ? "mx-auto items-center text-center"
      : "items-start text-left";

  return (
    <header className={`flex max-w-2xl flex-col gap-3 ${alignment} ${className}`}>
      <p className="text-xs font-bold tracking-[0.2em] text-accent uppercase">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="text-3xl font-extrabold tracking-tight text-balance text-text-primary sm:text-4xl"
      >
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-text-secondary sm:text-lg">
          {description}
        </p>
      )}
    </header>
  );
};
