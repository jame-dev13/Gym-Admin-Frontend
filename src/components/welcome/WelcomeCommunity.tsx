import { ArrowRight, MessageSquare, Star } from "lucide-react";
import { WELCOME_TESTIMONIALS } from "@/components/welcome/WelcomeContent";
import { WelcomeSectionHeader } from "@/components/welcome/WelcomeSectionHeader";
import { WELCOME_SECTION_IDS } from "@/components/welcome/WelcomeSectionIds";
import { useWelcomeMembershipDialog } from "@/components/welcome/useWelcomeMembershipDialog";

const STAR_COUNT = 5;

export const WelcomeCommunity = () => {
  const openMembershipDialog = useWelcomeMembershipDialog();

  return (
    <section
      id={WELCOME_SECTION_IDS.community}
      aria-labelledby="welcome-community-title"
      className="scroll-mt-24 border-t border-border"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-6 tab:flex-row tab:items-end tab:justify-between">
          <WelcomeSectionHeader
            id="welcome-community-title"
            eyebrow="Community"
            title="Train together, grow together."
            description="Your membership is more than a plan. Share your experience, rate your journey, and learn from the people training beside you."
          />
          <button
            type="button"
            onClick={openMembershipDialog}
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-border-emphasis px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors duration-200 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Add your voice
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>

        <ul className="grid gap-4 tab:grid-cols-3">
          {WELCOME_TESTIMONIALS.map((testimonial) => (
            <li key={testimonial.name}>
              <figure className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-6">
                <div
                  role="img"
                  aria-label={`Rated ${testimonial.rating} out of ${STAR_COUNT} stars`}
                  className="flex gap-1 text-warning"
                >
                  {Array.from({ length: STAR_COUNT }, (_, index) => (
                    <Star
                      key={index}
                      size={16}
                      fill="currentColor"
                      aria-hidden="true"
                      className={index < testimonial.rating ? "" : "opacity-25"}
                    />
                  ))}
                </div>
                <blockquote className="flex-1 leading-relaxed text-text-secondary">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="flex flex-col gap-0.5">
                  <span className="font-bold text-text-primary">
                    {testimonial.name}
                  </span>
                  <span className="text-sm text-text-tertiary">
                    {testimonial.detail}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4 rounded-2xl border border-accent/20 bg-accent/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
            <MessageSquare
              size={18}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-accent"
            />
            Once you join, you can rate your experience, leave a comment, and reply
            to other members from your dashboard.
          </p>
          <button
            type="button"
            onClick={openMembershipDialog}
            className="inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-surface transition-colors duration-200 hover:bg-accent-emphasis focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Join the conversation
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
