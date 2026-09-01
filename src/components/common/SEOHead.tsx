import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  jsonLd?: object;
  url?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'My India Lottery | Lottery Results & Information Portal',
  description = 'My India Lottery - Independent results portal, live draw announcements, state schemes, and cross-checked winning numbers for legal Indian state lotteries.',
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

    // Update Canonical URL if url is provided
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);

      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', url);
    }

    // Inject or update JSON-LD Structured Data in document head only
    if (jsonLd) {
      let scriptTag = document.getElementById('json-ld-structured-data') as HTMLScriptElement;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'json-ld-structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else {
      // If page doesn't have specific jsonLd, remove any stale draw-specific script tag
      const existingTag = document.getElementById('json-ld-structured-data');
      if (existingTag) {
        existingTag.remove();
      }
    }

    return () => {
      // Clean up dynamic script tag on unmount if needed
    };
  }, [title, description, jsonLd, url]);

  return null;
};
