import { Star } from "lucide-react";
import { Reveal } from "@/features/landing-page/components/Reveal";
import { getTestimonialsConfig } from "@/features/landing-page/services/TestimonialsConfig";
import { LANDING_SECTION_IDS } from "@/features/landing-page/services/SectionIds";

export const TestimonialsSection = () => {
  const testimonials = getTestimonialsConfig();
  return (
    <section
      id={LANDING_SECTION_IDS.testimonials}
      aria-labelledby="testimonials-title"
      className="scroll-mt-20 border-t border-border bg-surface-raised/40"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:py-20">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <p className="text-sm font-bold tracking-widest text-accent uppercase">
            Testimonials
          </p>
          <h2 id="testimonials-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Stories that train with us
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={Math.min(index * 100, 300)}>
              <figure className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-6">
                <div
                  role="img"
                  aria-label="Rating: 5 out of 5 stars"
                  className="flex gap-1 text-warning"
                >
                  {Array.from({ length: 5 }, (_, star) => (
                    <Star key={star} size={16} aria-hidden="true" fill="currentColor" />
                  ))}
                </div>
                <blockquote className="text-text-secondary">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-auto flex flex-col gap-0.5">
                  <span className="font-bold">{testimonial.name}</span>
                  <span className="text-sm text-text-tertiary">{testimonial.detail}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
