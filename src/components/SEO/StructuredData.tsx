import { useEffect } from "react";

interface WebSiteSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  description: string;
  potentialAction: {
    "@type": string;
    target: string;
    "query-input": string;
  };
}

interface EventSchema {
  "@context": string;
  "@type": string;
  name: string;
  startDate: string;
  endDate: string;
  location: {
    "@type": string;
    name: string;
    address: {
      "@type": string;
      addressLocality: string;
      addressRegion: string;
      addressCountry: string;
    };
  };
  description: string;
  image: string[];
  organizer: {
    "@type": string;
    name: string;
  };
  attendee: {
    "@type": string;
    name: string;
  }[];
}

export function StructuredData() {
  const baseUrl = typeof window !== "undefined"
    ? window.location.origin
    : "https://casar-app.vercel.app";

  const websiteSchema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Matheus & Nicolly - Nosso Casamento",
    url: baseUrl,
    description:
      "Confirme sua presença e escolha presentes para o casamento de Matheus & Nicolly - 18 de Novembro de 2026",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const eventSchema: EventSchema = {
    "@context": "https://schema.org",
    "@type": "Wedding",
    name: "Casamento de Matheus & Nicolly",
    startDate: "2026-11-18T16:00:00-03:00",
    endDate: "2026-11-18T23:59:59-03:00",
    location: {
      "@type": "Place",
      name: "Local do Casamento",
      address: {
        "@type": "PostalAddress",
        addressLocality: "São Paulo",
        addressRegion: "SP",
        addressCountry: "BR",
      },
    },
    description:
      "Será um grande prazer contar com sua presença em nosso dia especial. 18 de Novembro de 2026, às 16h.",
    image: [
      `${baseUrl}/og-image.jpg`,
      `${baseUrl}/wedding-photo-1.jpg`,
      `${baseUrl}/wedding-photo-2.jpg`,
    ],
    organizer: {
      "@type": "Organization",
      name: "Matheus & Nicolly",
    },
    attendee: [
      { "@type": "Person", name: "Convidados" },
      { "@type": "Person", name: "Família" },
      { "@type": "Person", name: "Amigos" },
    ],
  };

  useEffect(() => {
    // WebSite Schema
    const websiteScript = document.createElement("script");
    websiteScript.type = "application/ld+json";
    websiteScript.id = "structured-data-website";
    websiteScript.text = JSON.stringify(websiteSchema);
    document.head.appendChild(websiteScript);

    // Event Schema
    const eventScript = document.createElement("script");
    eventScript.type = "application/ld+json";
    eventScript.id = "structured-data-event";
    eventScript.text = JSON.stringify(eventSchema);
    document.head.appendChild(eventScript);

    return () => {
      const existingWebsite = document.getElementById("structured-data-website");
      const existingEvent = document.getElementById("structured-data-event");
      if (existingWebsite) existingWebsite.remove();
      if (existingEvent) existingEvent.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Schemas are static and should not trigger re-effect
  }, []);

  return null;
}
