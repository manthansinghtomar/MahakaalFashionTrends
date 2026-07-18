import React from 'react';

/**
 * Renders lists of recent products and contact messages.
 * Falls back to clean empty state panels if no database rows are returned.
 */
export const RecentActivity = ({ overview = {} }) => {
  const { products = {}, messages = {} } = overview;
  
  const recentProducts = products.latest || [];
  const recentMessages = messages.latest || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderEmptyState = (label) => (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
        NO DATA RECORDED
      </span>
      <p className="text-xs text-neutral-400">
        No recent {label.toLowerCase()} found in database.
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      
      {/* 1. Recent Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">
              LATEST ADDITIONS
            </span>
            <h4 className="text-lg font-bold tracking-tight text-neutral-900">
              Recent Products
            </h4>
          </div>
        </div>

        {recentProducts.length === 0 ? (
          renderEmptyState('Products')
        ) : (
          <div className="border border-neutral-100 bg-white rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Product details</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentProducts.map((prod) => (
                    <tr key={prod._id || prod.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 font-bold text-neutral-800">
                        {prod.name}
                        <span className="block text-[10px] text-neutral-400 font-medium">
                          {prod.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-neutral-500">{prod.sku}</td>
                      <td className="p-4 font-bold text-neutral-800">${prod.price?.toFixed(2)}</td>
                      <td className="p-4 font-semibold text-neutral-600">{prod.stock}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                          prod.isActive 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {prod.isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 2. Recent Contacts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">
              CUSTOMER COMMUNICATIONS
            </span>
            <h4 className="text-lg font-bold tracking-tight text-neutral-900">
              Recent Inquiries
            </h4>
          </div>
        </div>

        {recentMessages.length === 0 ? (
          renderEmptyState('Messages')
        ) : (
          <div className="border border-neutral-100 bg-white rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Sender</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Received At</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentMessages.map((msg) => (
                    <tr key={msg._id || msg.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 font-bold text-neutral-800">
                        {msg.name}
                        <span className="block text-[10px] text-neutral-400 font-medium">
                          {msg.email}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-600 font-medium max-w-[150px] truncate">{msg.subject}</td>
                      <td className="p-4 text-neutral-400 font-semibold">{formatDate(msg.createdAt)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                          msg.status === 'unread' 
                            ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                            : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {msg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default RecentActivity;
