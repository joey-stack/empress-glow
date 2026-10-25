import React from 'react';

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': 'https://empressglowemporium.com/#localbusiness',
    name: 'Empress Glow Emporium',
    description:
      'Handcrafted Nigerian botanical skincare and organic fruit-enzyme formulations celebrating melanin skin radiance.',
    url: 'https://empressglowemporium.com',
    logo: 'https://empressglowemporium.com/logo.png',
    image: 'https://empressglowemporium.com/images/fruity-soap-hero.jpg',
    telephone: '+2348035650299',
    priceRange: '₦3,000 - ₦16,000',
    currenciesAccepted: 'NGN',
    paymentAccepted: 'Debit Card, Bank Transfer, Paystack',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Wuse 2',
      addressLocality: 'Abuja',
      addressRegion: 'Federal Capital Territory',
      postalCode: '900288',
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 6.4474,
      longitude: 3.4735,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      'https://wa.me/2348035650299',
      'https://wa.me/c/2348035650299',
      'https://instagram.com/empressglowemporium',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
