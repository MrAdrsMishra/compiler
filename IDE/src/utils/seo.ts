export interface SeoParams {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string;
  languageName?: string;
  isCompilerPage?: boolean;
}

const DEFAULT_KEYWORDS =
  "online compiler, c compiler, cpp compiler, c++ compiler, java online compiler, python compiler, javascript compiler, rust compiler, go compiler, online code runner, compiler api, online ide, code execution engine";
const DEFAULT_IMAGE = "https://onlinecompiler.me/favicon.svg";

function setMetaTag(selector: string, attrName: string, attrVal: string, content: string) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrName, attrVal);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setCanonicalLink(href: string) {
  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function setJsonLd(params: SeoParams) {
  let scriptEl = document.getElementById("dynamic-route-jsonld") as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement("script");
    scriptEl.id = "dynamic-route-jsonld";
    scriptEl.type = "application/ld+json";
    document.head.appendChild(scriptEl);
  }

  const breadcrumbItems: any[] = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://onlinecompiler.me/"
    }
  ];

  if (params.isCompilerPage && params.languageName) {
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 2,
      "name": `Online ${params.languageName} Compiler`,
      "item": params.canonicalUrl
    });
  }

  const schemas: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": params.title,
      "description": params.description,
      "url": params.canonicalUrl
    }
  ];

  if (params.isCompilerPage && params.languageName) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": `RunMe Online ${params.languageName} Compiler`,
      "url": params.canonicalUrl,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web",
      "description": params.description,
      "author": {
        "@type": "Person",
        "name": "Adarsh Mishra"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    });
  }

  scriptEl.textContent = JSON.stringify(schemas);
}

export function updateSeoMetadata(params: SeoParams) {
  // 1. Page Title & Meta Title
  document.title = params.title;
  setMetaTag('meta[name="title"]', 'name', 'title', params.title);

  // 2. Description
  setMetaTag('meta[name="description"]', 'name', 'description', params.description);

  // 3. Keywords
  const keywords = params.keywords ? `${params.keywords}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS;
  setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);

  // 4. Canonical URL
  setCanonicalLink(params.canonicalUrl);

  // 5. Open Graph Meta Tags
  const ogType = params.ogType || 'website';
  const ogImage = params.ogImage || DEFAULT_IMAGE;

  setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', params.canonicalUrl);
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', params.title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', params.description);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);

  // 6. Twitter Card Tags
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', params.title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', params.description);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

  // 7. Structured Data (JSON-LD)
  setJsonLd(params);
}
