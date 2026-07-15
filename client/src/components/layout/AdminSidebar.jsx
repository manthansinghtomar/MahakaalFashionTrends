import { ADMIN_NAV_LINKS, ROUTES } from '../../constants/index.js';

/**
 * AdminSidebar layout template component.
 */
export const AdminSidebar = () => {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r border-neutral-200 bg-white">
      <div className="flex h-16 items-center px-6 border-b border-neutral-200">
        <a href={ROUTES.ADMIN_DASHBOARD} className="text-lg font-bold tracking-tight text-neutral-900">
          MAHAKAAL ADMIN
        </a>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4 text-sm font-medium text-neutral-600">
        {ADMIN_NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-center px-2 py-2 rounded-md hover:bg-neutral-50 hover:text-neutral-900 transition"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
