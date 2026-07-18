import React from 'react';
import CategoryStatusBadge from './CategoryStatusBadge.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';

/**
 * Categories Table rendering list of registered collections.
 * Handles empty list state using the standard EmptyState UI component.
 */
export const CategoriesTable = ({
  categories = [],
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

  if (categories.length === 0) {
    return (
      <div className="py-16">
        <EmptyState 
          title="No Categories Found"
          description="Try adjusting your filters, searching for another term, or add a new category division."
        />
      </div>
    );
  }

  // Check if at least one category contains productCount to render the column dynamically
  const showProductCount = categories.some((cat) => cat.productCount !== undefined);

  return (
    <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
              <th className="p-4 pl-6">Category details</th>
              <th className="p-4">Slug path</th>
              <th className="p-4">Description</th>
              {showProductCount && <th className="p-4">Products</th>}
              <th className="p-4">Status</th>
              <th className="p-4">Created Date</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {categories.map((cat) => {
              const displayImage = cat.image?.url || '';

              return (
                <tr key={cat._id || cat.id} className="hover:bg-neutral-50/50 transition-colors">
                  {/* Image & Title */}
                  <td className="p-4 pl-6 flex items-center gap-3">
                    {displayImage ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200/50 flex-shrink-0">
                        <img 
                          src={displayImage} 
                          alt={cat.name} 
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/80x80?text=No+Img';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-200/40 flex items-center justify-center flex-shrink-0 text-neutral-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <span className="font-extrabold text-neutral-900 block leading-tight">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-400 block mt-0.5">
                        Order: {cat.displayOrder ?? 0}
                      </span>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="p-4 font-semibold text-neutral-500 lowercase">{cat.slug}</td>

                  {/* Description */}
                  <td className="p-4 font-semibold text-neutral-600 max-w-[200px] truncate">
                    {cat.description || 'No description provided'}
                  </td>

                  {/* Product Count */}
                  {showProductCount && (
                    <td className="p-4 font-semibold text-neutral-600">
                      {cat.productCount ?? 0}
                    </td>
                  )}

                  {/* Status */}
                  <td className="p-4">
                    <CategoryStatusBadge status={cat.status} />
                  </td>

                  {/* Created Date */}
                  <td className="p-4 font-semibold text-neutral-400">{formatDate(cat.createdAt)}</td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right space-x-2.5 whitespace-nowrap">
                    {/* View Button -> links to public category products */}
                    <a
                      href={`/products?category=${cat.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
                      title="View category page in new tab"
                    >
                      View
                    </a>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => onEdit(cat)}
                      className="inline-flex items-center text-xs font-bold text-secondary hover:underline transition-colors"
                      title="Edit category"
                    >
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => onDelete(cat)}
                      className="inline-flex items-center text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
                      title="Delete category"
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

export default CategoriesTable;
