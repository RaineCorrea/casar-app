/**
 * Structured Data (JSON-LD) para SEO
 * Ajoca mecanismos de busca a entender melhor o conteúdo
 */

interface WeddingEventProps {
  name: string;
  startDate: string;
  location: string;
  description: string;
  url: string;
}

export function WeddingEventStructuredData({
  name,
  startDate,
  location,
  description,
  url,
}: WeddingEventProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    startDate,
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
      },
    },
    description,
    url,
    organizer: {
      '@type': 'Person',
      name: 'Matheus & Nicolly',
    },
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

interface WebSiteProps {
  name: string;
  url: string;
  description: string;
}

export function WebSiteStructuredData({ name, url, description }: WebSiteProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

interface OrganizationProps {
  name: string;
  url: string;
  logo?: string;
}

export function OrganizationStructuredData({ name, url, logo }: OrganizationProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
