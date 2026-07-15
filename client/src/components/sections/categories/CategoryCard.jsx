import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button.jsx';

/**
 * Reusable Category Card component.
 * Wraps the entire card inside a link matching the category slug.
 * Images are formatted to a fixed 4:5 aspect ratio and animate on hover.
 */
export const CategoryCard = ({ category }) => {
  const { name, slug, image, description } = category;

  if (!slug) return null;

  // Support local relative paths and remote CDN/Cloudinary URLs dynamically
  const isRemote = image && (image.startsWith('http://') || image.startsWith('https://'));

  return (
    <Link
      href={`/categories/${slug}`}
      className="group block bg-white rounded-lg border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md hover:border-neutral-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
    >
      {/* Aspect Ratio 4:5 Image Wrapper */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-50 border-b border-neutral-100">
        {image ? (
          isRemote ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content details */}
      <div className="p-6 flex flex-col space-y-3.5">
        <h3 className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-secondary transition duration-300">
          {name}
        </h3>
        
        <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed min-h-[40px]">
          {description}
        </p>

        {/* Visual-only Button CTA */}
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full pointer-events-none rounded-md uppercase tracking-wider text-xs font-semibold py-2.5 transition-all duration-300 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-transparent"
          >
            Explore Category
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
