import React from 'react';
import ContactStatusBadge from './ContactStatusBadge.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';

/**
 * Contacts Table rendering list of customer message inquiries.
 * Visually distinguishes unread inquiries with amber highlight panels.
 * Card-contained horizontal scroll for mobile viewports.
 */
export const ContactsTable = ({
  messages = [],
  onViewDetails,
  onArchive,
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

  if (messages.length === 0) {
    return (
      <div className="py-16">
        <EmptyState 
          title="No Inquiries Found"
          description="Try adjusting your filters, searching for another term, or refresh the query parameters."
        />
      </div>
    );
  }

  // Check if at least one message returned a phone number to render column conditionally
  const showPhoneColumn = messages.some((msg) => msg.phone && msg.phone.trim() !== '');

  return (
    <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-xs w-full min-w-0">
      <div className="overflow-x-auto w-full max-w-full scrollbar-thin">
        <table className="w-full min-w-[700px] text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
              <th className="p-4 pl-6">Sender Details</th>
              <th className="p-4">Email</th>
              {showPhoneColumn && <th className="p-4">Phone</th>}
              <th className="p-4">Subject</th>
              <th className="p-4">Message Preview</th>
              <th className="p-4">Status</th>
              <th className="p-4">Received Date</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {messages.map((msg) => {
              const isUnread = msg.status === 'unread';
              const truncatedMsg = msg.message && msg.message.length > 50 
                ? `${msg.message.substring(0, 50)}...` 
                : msg.message;

              return (
                <tr 
                  key={msg._id || msg.id} 
                  className={`transition-colors ${
                    isUnread 
                      ? 'bg-amber-50/15 font-black text-neutral-900 border-l-2 border-l-amber-500 hover:bg-amber-50/20' 
                      : 'hover:bg-neutral-50/50 text-neutral-600'
                  }`}
                >
                  {/* Sender Name */}
                  <td className="p-4 pl-6 font-extrabold text-neutral-900">
                    {msg.name}
                  </td>

                  {/* Email */}
                  <td className="p-4 font-semibold text-neutral-500 lowercase">{msg.email}</td>

                  {/* Phone (rendered conditionally) */}
                  {showPhoneColumn && (
                    <td className="p-4 font-semibold text-neutral-500">
                      {msg.phone && msg.phone.trim() !== '' ? msg.phone : null}
                    </td>
                  )}

                  {/* Subject */}
                  <td className="p-4 font-extrabold text-neutral-800">{msg.subject}</td>

                  {/* Message Preview */}
                  <td className="p-4 font-semibold text-neutral-400 max-w-[200px] truncate">
                    {truncatedMsg}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <ContactStatusBadge status={msg.status} />
                  </td>

                  {/* Received Date */}
                  <td className="p-4 font-semibold text-neutral-400">{formatDate(msg.createdAt)}</td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right space-x-2.5 whitespace-nowrap">
                    {/* View Details Button */}
                    <button
                      type="button"
                      onClick={() => onViewDetails(msg)}
                      className="inline-flex items-center text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
                      title="View complete inquiry details"
                    >
                      View
                    </button>

                    {/* Archive Action (Only if not already archived) */}
                    {msg.status !== 'archived' && (
                      <button
                        type="button"
                        onClick={() => onArchive(msg)}
                        className="inline-flex items-center text-xs font-bold text-secondary hover:underline transition-colors"
                        title="Archive inquiry message"
                      >
                        Archive
                      </button>
                    )}

                    {/* Delete Action */}
                    <button
                      type="button"
                      onClick={() => onDelete(msg)}
                      className="inline-flex items-center text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
                      title="Delete inquiry"
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

export default ContactsTable;
