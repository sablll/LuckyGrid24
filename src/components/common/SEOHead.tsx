import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  jsonLd?: object;
  url?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'India Lottery Results | Verified State Government Draws & Archives',
  description = 'Official results archive, live draw announcements, state schemes, and verified winning numbers for authorized Indian state lotteries.',
  jsonLd,
  url
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    // Update OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // Inject or update JSON-LD Structured Data
    if (jsonLd) {
      let scriptTag = document.getElementById('json-ld-structured-data') as HTMLScriptElement;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'json-ld-structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      // Clean up dynamic script tag on unmount if needed
    };
  }, [title, description, jsonLd, url]);

  return null;
};
