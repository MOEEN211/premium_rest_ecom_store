import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  ogImage, 
  product,
  breadcrumbs = [],
  type = 'website'
}) => {
  const siteTitle = 'PremiumRest';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  
  // Default UK-focused values
  const defaultDescription = 'Shop luxury beds, mattresses & bedroom furniture in the UK. Premium quality beds at affordable prices. Free delivery across England, Scotland, Wales & Northern Ireland.';
  const defaultKeywords = 'beds UK, mattresses UK, bedroom furniture, luxury beds, cheap beds, double beds, king size beds, single beds, orthopedic mattresses, memory foam mattresses, UK bed store, online beds UK';
  
  // Structured data for breadcrumbs
  const breadcrumbStructuredData = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  } : null;

  // Structured data for products
  const productStructuredData = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || defaultDescription,
    "image": product.gallery || [product.img],
    "brand": {
      "@type": "Brand",
      "name": "PremiumRest"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "PremiumRest",
        "url": "https://premiumrestfurniture.co.uk"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "GBP"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "businessDays": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "https://schema.org/Monday",
              "https://schema.org/Tuesday",
              "https://schema.org/Wednesday",
              "https://schema.org/Thursday",
              "https://schema.org/Friday"
            ]
          }
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "100+"
    }
  } : null;

  // FAQ structured data for common bed/mattress questions
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do you offer free delivery across the UK?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer free delivery across England, Scotland, Wales, and Northern Ireland on all orders over £100. Delivery typically takes 3-7 working days."
        }
      },
      {
        "@type": "Question",
        "name": "What is your returns policy for beds and mattresses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a 100-night comfort guarantee on all mattresses. If you're not satisfied, you can return or exchange within 100 days. Beds have a 14-day return policy."
        }
      },
      {
        "@type": "Question",
        "name": "What types of mattresses do you sell?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We stock a wide range including memory foam, pocket sprung, hybrid, latex, orthopedic, and cool gel mattresses. All come with free delivery and our comfort guarantee."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer bed assembly service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer professional bed assembly service across the UK for just £50. Our experienced team will assemble your bed and remove all packaging."
        }
      }
    ]
  };

  // Enhanced Local Business structured data
  const localBusinessStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "PremiumRest - Luxury Beds & Mattresses",
    "description": "Premium UK bed and mattress retailer offering luxury bedroom furniture with free delivery across the United Kingdom and 100-night comfort guarantee.",
    "url": "https://premiumrestfurniture.co.uk",
    "logo": "https://premiumrestfurniture.co.uk/logo.png",
    "image": "https://premiumrestfurniture.co.uk/storefront.jpg",
    "telephone": "+44-7783-699250",
    "email": "premiumrestfurniture@gmail.com",
    "priceRange": "££-£££",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB",
      "addressRegion": "Multiple Locations",
      "addressLocality": "United Kingdom",
      "postalCode": "Coverage Nationwide",
      "streetAddress": "Online Store - Serving All UK"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "United Kingdom"
      },
      {
        "@type": "Place",
        "name": "England"
      },
      {
        "@type": "Place", 
        "name": "Scotland"
      },
      {
        "@type": "Place",
        "name": "Wales"
      },
      {
        "@type": "Place",
        "name": "Northern Ireland"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Beds and Mattresses",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Luxury Bed Frames"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Product",
            "name": "Premium Mattresses"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product", 
            "name": "Bedroom Furniture Sets"
          }
        }
      ]
    },
    "paymentAccepted": ["Credit Card", "Debit Card", "PayPal", "Klarna", "Clearpay"],
    "currenciesAccepted": "GBP",
    "openingHours": "Mo-Fr 09:00-21:00 Sa-Su 10:00-18:00",
    "serviceType": "Online Retail",
    "makesOffer": [
      {
        "@type": "Offer",
        "name": "Free UK Delivery",
        "description": "Free delivery on all orders over £100",
        "availabilityStarts": "2024-01-01"
      },
      {
        "@type": "Offer",
        "name": "100-Night Comfort Guarantee",
        "description": "Risk-free mattress trial period",
        "availabilityStarts": "2024-01-01"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2500+",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah Johnson"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Excellent service and quality products. Delivery was on time and the bed is perfect!",
        "datePublished": "2024-03-15"
      },
      {
        "@type": "Review", 
        "author": {
          "@type": "Person",
          "name": "Michael Smith"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Great prices and fantastic customer service. The finance option made it easy to afford my dream bed.",
        "datePublished": "2024-03-10"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/premiumrest4"
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="author" content="PremiumRest.co.uk" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="GB" />
      <meta name="geo.placename" content="United Kingdom" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <link rel="alternate" hreflang="en-gb" href={canonicalUrl || 'https://premiumrestfurniture.co.uk/'} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl || 'https://premiumrestfurniture.co.uk/'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage || 'https://premiumrestfurniture.co.uk/og-image.jpg'} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="PremiumRest" />
      <meta property="og:locale" content="en_GB" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl || 'https://premiumrestfurniture.co.uk/'} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description || defaultDescription} />
      <meta property="twitter:image" content={ogImage || 'https://premiumrestfurniture.co.uk/og-image.jpg'} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#4a9d9c" />
      <meta name="msapplication-TileColor" content="#4a9d9c" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessStructuredData)}
      </script>
      
      <script type="application/ld+json">
        {JSON.stringify(faqStructuredData)}
      </script>
      
      {productStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(productStructuredData)}
        </script>
      )}
      
      {breadcrumbStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
