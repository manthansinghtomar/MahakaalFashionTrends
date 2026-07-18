import React from 'react';
import Link from 'next/link';
import ProductStatusBadge from './ProductStatusBadge.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';

/**
 * Products Table rendering list of registered products.
 * Handles empty list state using the standard EmptyState UI component.
 */
export const ProductsTable = ({
  products = [],
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (products.length === 0) {
    return (
      <div className="py-16">
        <EmptyState 
          title="No Products Registered"
          description="Try adjusting your filters, searching for another term, or add a new ethnic wear catalog item."
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
              <th className="p-4 pl-6">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created Date</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((prod) => {
              const displayImage = prod.images?.[0]?.url || '';

              return (
                <tr key={prod._id || prod.id} className="hover:bg-neutral-50/50 transition-colors">
                  {/* Image & Title */}
                  <td className="p-4 pl-6 flex items-center gap-3">
                    {displayImage ? (
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200/50 flex-shrink-0">
                        <img 
                          src={displayImage} 
                          alt={prod.name} 
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/80x100?text=No+Img';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-12 rounded-lg bg-neutral-50 border border-neutral-200/40 flex items-center justify-center flex-shrink-0 text-neutral-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <span className="font-extrabold text-neutral-900 block leading-tight">
                        {prod.name}
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-400 block mt-0.5">
                        {prod.brand || 'No Brand'}
                      </span>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="p-4 font-semibold text-neutral-500 uppercase">{prod.sku}</td>

                  {/* Category */}
                  <td className="p-4 font-semibold text-neutral-600">
                    {prod.category?.name || 'Uncategorized'}
                  </td>

                  {/* Price */}
                  <td className="p-4">
                    <span className="font-extrabold text-neutral-900 block">${prod.price?.toFixed(2)}</span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-[10px] text-neutral-400 line-through font-semibold block">
                        ${prod.originalPrice?.toFixed(2)}
                      </span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="p-4 font-semibold text-neutral-600">{prod.stock}</td>

                  {/* Status */}
                  <td className="p-4">
                    <ProductStatusBadge status={prod.status} />
                  </td>

                  {/* Created Date */}
                  <td className="p-4 font-semibold text-neutral-400">{formatDate(prod.createdAt)}</td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right space-x-2.5 whitespace-nowrap">
                    {/* View Button -> links to public details */}
                    <a
                      href={`/products/${prod.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
                      title="View product page in new tab"
                    >
                      View
                    </a>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => onEdit(prod)}
                      className="inline-flex items-center text-xs font-bold text-secondary hover:underline transition-colors"
                      title="Edit product"
                    >
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => onDelete(prod)}
                      className="inline-flex items-center text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
                      title="Delete product"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
