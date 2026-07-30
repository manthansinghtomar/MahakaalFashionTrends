import React from 'react';
import { formatRupees } from '@/utils/currency.js';

/**
 * Placeholder component for rendering individual products in catalog grids.
 */
export const ProductCard = ({ product }) => {
  return (
    <div className="group relative border border-neutral-200 rounded-lg p-4 bg-white hover:shadow-md transition">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-neutral-100 group-hover:opacity-75">
        {/* Product image placeholder */}
        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs bg-neutral-50">
          Image Placeholder
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-700">
            {product?.name || 'Product Title'}
          </h3>
          <p className="mt-1 text-xs text-neutral-500">{product?.brand || 'Brand'}</p>
        </div>
        <p className="text-sm font-bold text-neutral-900">₹{formatRupees(product?.price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
