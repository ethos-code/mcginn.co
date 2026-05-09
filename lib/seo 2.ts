export const siteUrl = 'https://mcginn.co';
export const siteName = 'John McGinn';
export const fullName = 'John McGinn';

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'John McGinn',
  givenName: 'John',
  familyName: 'McGinn',
  jobTitle: 'Head of Design (Senior Director)',
  worksFor: {
    '@type': 'Organization',
    name: 'Salesforce',
    url: 'https://salesforce.com',
  },
  url: 'https://mcginn.co',
  sameAs: [
    'https://linkedin.com/in/johnsmcginn',
    'https://behance.net/mcginnco',
    'https://thefountain.ai',
  ],
  description:
    'Designer and founder leading AI experience design at Salesforce. Founder of Fountain, an ambient AI hardware concept. Co-founded and exited Elevar (2024). Twenty years of design across 400+ projects.',
  knowsAbout: [
    'AI experience design',
    'Agentic AI',
    'Generative UI',
    'Design leadership',
    'Ambient computing',
    'Conversational interfaces',
    'Product design',
    'Design systems',
  ],
  alumniOf: [
    { '@type': 'Organization', name: 'Elevar (exited 2024)' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Seattle',
    addressRegion: 'WA',
    addressCountry: 'US',
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'John McGinn',
  url: 'https://mcginn.co',
  inLanguage: 'en-US',
  author: {
    '@type': 'Person',
    name: 'John McGinn',
    url: 'https://mcginn.co',
  },
  description:
    'Personal site of John McGinn, designer and founder leading AI experience design at Salesforce.',
};
