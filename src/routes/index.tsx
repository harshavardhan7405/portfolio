import { createFileRoute } from "@tanstack/react-router";
import App from "../App";

const title = "Harshavardhan — Full Stack Developer";
const description =
  "Portfolio of Harshavardhan, a full stack developer building practical, reliable applications with clean, maintainable code.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Harshavardhan",
          jobTitle: "Full Stack Developer",
          alumniOf: "Jawaharlal Nehru Technological University Hyderabad",
        }),
      },
    ],
  }),
  component: App,
});
