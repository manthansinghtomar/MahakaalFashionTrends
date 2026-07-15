/**
 * Centralized SEO metadata builder.
 * Generates structured metadata including OpenGraph and Twitter cards,
 * allowing simple per-page overrides.
 */
export const generatePageMetadata = ({
  title,
  description,
  keywords = [],
  openGraph = {},
  twitter = {},
  ...rest
} = {}) => {
  const baseTitle = 'Mahakaal Fashion Trends';
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const baseDescription =
    description ||
    'Discover premium traditional Indian wear, ethnic designer Kurtas, and custom outfits at Mahakaal Fashion Trends.';
  const defaultKeywords = [
    'Mahakaal Fashion',
    'ethnic wear',
    'designer kurtas',
    'traditional clothing',
    'Indian fashion',
    ...keywords,
  ];

  return {
    title: fullTitle,
    description: baseDescription,
    keywords: defaultKeywords,
    openGraph: {
      title: fullTitle,
      description: baseDescription,
      type: 'website',
      siteName: baseTitle,
      ...openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: baseDescription,
      ...twitter,
    },
    ...rest,
  };
};

export default generatePageMetadata;
