/**
 * Generates breadcrumbs array from a pathname, supporting dynamic label mapping.
 * E.g., "/products/designer-kurta" -> Home > Products > Designer Kurta (or customized lookup names)
 */
export const generateBreadcrumbs = (pathname, dynamicLabels = {}) => {
  if (!pathname) return [];
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs = [
    { label: 'Home', href: '/' }
  ];

  let currentHref = '';
  segments.forEach((segment) => {
    currentHref += `/${segment}`;

    // Priority 1: segment mapping, Priority 2: absolute path mapping, Priority 3: Title Case formatting
    let label = dynamicLabels[segment] || dynamicLabels[currentHref];

    if (!label) {
      label = segment
        .replace(/-+/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .trim();
      label = label.charAt(0).toUpperCase() + label.slice(1);
    }

    breadcrumbs.push({
      label,
      href: currentHref,
    });
  });

  return breadcrumbs;
};

export default generateBreadcrumbs;
