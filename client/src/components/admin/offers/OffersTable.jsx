import React from 'react';
import OfferStatusBadge from './OfferStatusBadge.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';

/**
 * Offers Table listing registered discounts and marketing campaigns.
 * Utilizes standard date formatting helpers consistently.
 */
export const OffersTable = ({
  offers = [],
  onEdit,
  onDelete,
}) => {
  // Consistent date formatting helper matching public reviews & profile components
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (offers.length === 0) {
    return (
      <div className="py-16">
        <EmptyState 
          title="No Campaign Offers Registered"
          description="Try adjusting filters, searching for another term, or register a new discount offer campaign."
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
              <th className="p-4 pl-6">Campaign details</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Start Date</th>
              <th className="p-4">End Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created Date</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {offers.map((off) => {
              const displayImage = off.bannerImage?.url || '';

              return (
                <tr key={off._id || off.id} className="hover:bg-neutral-50/50 transition-colors">
                  {/* Banner Image & Title */}
                  <td className="p-4 pl-6 flex items-center gap-3">
                    {displayImage ? (
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200/50 flex-shrink-0">
                        <img 
                          src={displayImage} 
                          alt={off.title} 
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/160x100?text=No+Img';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-10 rounded-lg bg-neutral-50 border border-neutral-200/40 flex items-center justify-center flex-shrink-0 text-neutral-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <span className="font-extrabold text-neutral-900 block leading-tight">
                        {off.title}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-semibold block max-w-[200px] truncate mt-0.5">
                        {off.description}
                      </span>
                    </div>
                  </td>

                  {/* Discount percentage */}
                  <td className="p-4">
                    <span className="font-extrabold text-secondary block">
                      {off.discountPercentage}% OFF
                    </span>
                  </td>

                  {/* Start Date */}
                  <td className="p-4 font-semibold text-neutral-600">{formatDate(off.startDate)}</td>

                  {/* End Date */}
                  <td className="p-4 font-semibold text-neutral-600">{formatDate(off.endDate)}</td>

                  {/* Status */}
                  <td className="p-4">
                    <OfferStatusBadge status={off.status} />
                  </td>

                  {/* Created Date */}
                  <td className="p-4 font-semibold text-neutral-400">{formatDate(off.createdAt)}</td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right space-x-2.5 whitespace-nowrap">
                    {/* Preview Button -> links to public offers view */}
                    <a
                      href="/offers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
                      title="Preview campaign details on public offers page"
                    >
                      Preview
                    </a>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => onEdit(off)}
                      className="inline-flex items-center text-xs font-bold text-secondary hover:underline transition-colors"
                      title="Edit offer details"
                    >
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => onDelete(off)}
                      className="inline-flex items-center text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
                      title="Delete offer"
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

export default OffersTable;
