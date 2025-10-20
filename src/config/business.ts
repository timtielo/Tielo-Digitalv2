export const BUSINESS_INFO = {
  name: 'Tielo Digital',
  legalName: 'Tielo Digital B.V.',
  description: 'AI-gestuurde automatisering en digitale oplossingen voor bedrijven in Nederland. Gespecialiseerd in workflow automation, AI assistenten, website ontwikkeling en procesoptimalisatie.',
  email: 'info@tielo-digital.nl',
  phone: '+31 6 12345678',
  address: {
    streetAddress: 'Voorstraat 123',
    addressLocality: 'Utrecht',
    addressRegion: 'Utrecht',
    postalCode: '3512 AK',
    addressCountry: 'NL'
  },
  coordinates: {
    latitude: '52.0907',
    longitude: '5.1214'
  },
  url: 'https://www.tielo-digital.nl',
  logo: 'https://www.tielo-digital.nl/logo/og-image.jpg',
  image: 'https://www.tielo-digital.nl/logo/og-image.jpg',
  founder: 'Tim Tielkemeijer',
  foundingDate: '2023',
  priceRange: '€€',
  areaServed: ['Utrecht', 'Amsterdam', 'Rotterdam', 'Den Haag', 'Nederland'],
  serviceArea: {
    type: 'Country',
    name: 'Nederland'
  },
  openingHours: 'Mo-Fr 09:00-18:00',
  sameAs: [
    'https://www.linkedin.com/company/tielo-digital',
    'https://www.facebook.com/tielodigital',
    'https://twitter.com/tielodigital'
  ]
} as const;

export const SERVICES = [
  {
    name: 'AI Automatisering',
    description: 'Slimme automatisering van bedrijfsprocessen met AI-technologie',
    url: 'https://www.tielo-digital.nl/oplossingen/ai-automatisering'
  },
  {
    name: 'Workflow Automation',
    description: 'Optimaliseer uw workflows en bespaar tijd met automatisering',
    url: 'https://www.tielo-digital.nl/oplossingen/workflow-automatisering'
  },
  {
    name: 'Website Ontwikkeling',
    description: 'Professionele websites die converteren en presteren',
    url: 'https://www.tielo-digital.nl/diensten/websites'
  },
  {
    name: 'AI Klantenservice',
    description: '24/7 geautomatiseerde klantenservice met AI chatbots',
    url: 'https://www.tielo-digital.nl/oplossingen/ai-klantenservice'
  }
] as const;
