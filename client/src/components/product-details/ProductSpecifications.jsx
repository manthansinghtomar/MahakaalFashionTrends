import React from 'react';

/**
 * ProductSpecifications component.
 * Displays a grid of available specifications (material, fit, fabric, care, sizes, colors).
 * Render only fields that are non-empty and exist in the database record.
 */
export const ProductSpecifications = ({ product }) => {
  if (!product) return null;

  const { material, fit, fabric, careInstructions, sizes, colors } = product;

  // Safe checks for data presence
  const hasValue = (val) => typeof val === 'string' && val.trim().length > 0;
  const hasArray = (arr) => arr && Array.isArray(arr) && arr.length > 0;

  // Determine if we should render anything at all
  const hasAnySpec =
    hasValue(material) ||
    hasValue(fit) ||
    hasValue(fabric) ||
    hasValue(careInstructions) ||
    hasArray(sizes) ||
    hasArray(colors);

  if (!hasAnySpec) return null;

  return (
    <div className="mt-8 pt-8 border-t border-neutral-100 space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
        Specifications
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
        {hasValue(material) && (
          <div className="flex justify-between py-2 border-b border-neutral-50 text-sm">
            <span className="text-neutral-500 font-medium">Material</span>
            <span className="text-neutral-900 font-semibold">{material}</span>
          </div>
        )}

        {hasValue(fabric) && (
          <div className="flex justify-between py-2 border-b border-neutral-50 text-sm">
            <span className="text-neutral-500 font-medium">Fabric Type</span>
            <span className="text-neutral-900 font-semibold">{fabric}</span>
          </div>
        )}

        {hasValue(fit) && (
          <div className="flex justify-between py-2 border-b border-neutral-50 text-sm">
            <span className="text-neutral-500 font-medium">Fit Silhouette</span>
            <span className="text-neutral-900 font-semibold">{fit}</span>
          </div>
        )}

        {hasArray(sizes) && (
          <div className="flex justify-between py-2 border-b border-neutral-50 text-sm">
            <span className="text-neutral-500 font-medium">Available Sizes</span>
            <span className="text-neutral-900 font-semibold">{sizes.join(', ')}</span>
          </div>
        )}

        {hasArray(colors) && (
          <div className="flex justify-between py-2 border-b border-neutral-50 text-sm">
            <span className="text-neutral-500 font-medium">Colors</span>
            <span className="text-neutral-900 font-semibold">{colors.join(', ')}</span>
          </div>
        )}

        {hasValue(careInstructions) && (
          <div className="flex flex-col gap-1 py-2 border-b border-neutral-50 text-sm sm:col-span-2">
            <span className="text-neutral-500 font-medium">Care Instructions</span>
            <span className="text-neutral-700 leading-relaxed font-semibold">{careInstructions}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSpecifications;
