import { useEffect } from "react";
import { WELCOME_FAQS } from "@/components/welcome/WelcomeContent";

const PAGE_TITLE = "Become a member | Gym Admin";
const PAGE_DESCRIPTION =
  "Explore your Gym Admin member dashboard: subscription status, payments, activity logs, notifications, and member feedback. Activate your membership whenever you are ready.";

type MetaAttribute = "name" | "property";

const setMeta = (
  attribute: MetaAttribute,
  key: string,
  content: string,
  originalContent: Map<HTMLMetaElement, string | null>,
) => {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  if (!originalContent.has(element)) {
    originalContent.set(element, element.getAttribute("content"));
  }

  element.setAttribute("content", content);
};

/**
 * Keeps the document head in sync with the welcome page. SPA navigation never
 * reloads the document, so title and social metadata have to be managed here.
 */
export const useWelcomeSeo = () => {
  useEffect(() => {
    const previousTitle = document.title;
    const originalContent = new Map<HTMLMetaElement, string | null>();

    document.title = PAGE_TITLE;

    setMeta("name", "description", PAGE_DESCRIPTION, originalContent);
    setMeta("property", "og:type", "website", originalContent);
    setMeta("property", "og:site_name", "Gym Admin", originalContent);
    setMeta("property", "og:title", PAGE_TITLE, originalContent);
    setMeta("property", "og:description", PAGE_DESCRIPTION, originalContent);
    setMeta("property", "og:url", window.location.href, originalContent);
    setMeta("name", "twitter:card", "summary_large_image", originalContent);
    setMeta("name", "twitter:title", PAGE_TITLE, originalContent);
    setMeta("name", "twitter:description", PAGE_DESCRIPTION, originalContent);

    const structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.dataset.welcomeSeo = "true";
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: window.location.href,
          inLanguage: "en",
          isPartOf: {
            "@type": "WebSite",
            name: "Gym Admin",
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: WELCOME_FAQS.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        },
      ],
    });
    document.head.appendChild(structuredData);

    return () => {
      document.title = previousTitle;
      originalContent.forEach((content, element) => {
        if (content === null) {
          element.remove();
          return;
        }
        element.setAttribute("content", content);
      });
      structuredData.remove();
    };
  }, []);
};
