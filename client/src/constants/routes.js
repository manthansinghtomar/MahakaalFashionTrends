export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug) => `/products/${slug}`,
  CATEGORIES: '/categories',
  OFFERS: '/offers',
  CONTACT: '/contact',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  WISHLIST: '/wishlist',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  PAYMENTS: '/payments',
  NOTIFICATIONS: '/notifications',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_OFFERS: '/admin/offers',
  ADMIN_CONTACTS: '/admin/contacts',
  ADMIN_SETTINGS: '/admin/settings',
};

// Route groupings for route guards, navigation, and middleware checks
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.PRODUCTS,
  ROUTES.CATEGORIES,
  ROUTES.OFFERS,
  ROUTES.CONTACT,
  ROUTES.ABOUT,
  ROUTES.CART,
];

export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
];

export const PROTECTED_ROUTES = [
  ROUTES.PROFILE,
  ROUTES.WISHLIST,
  ROUTES.CHECKOUT,
  ROUTES.ORDERS,
  ROUTES.PAYMENTS,
  ROUTES.NOTIFICATIONS,
];

export const ADMIN_ROUTES = [
  ROUTES.ADMIN_DASHBOARD,
  ROUTES.ADMIN_PRODUCTS,
  ROUTES.ADMIN_CATEGORIES,
  ROUTES.ADMIN_OFFERS,
  ROUTES.ADMIN_CONTACTS,
  ROUTES.ADMIN_SETTINGS,
];


export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ADMIN_LOGIN: '/auth/admin/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  PRODUCTS: {
    BASE: '/products',
    BY_SLUG: (slug) => `/products/${slug}`,
    RESTORE: (id) => `/products/${id}/restore`,
  },
  CATEGORIES: {
    BASE: '/categories',
    BY_SLUG: (slug) => `/categories/${slug}`,
    RESTORE: (id) => `/categories/${id}/restore`,
  },
  OFFERS: {
    BASE: '/offers',
    BY_ID: (id) => `/offers/${id}`,
    RESTORE: (id) => `/offers/${id}/restore`,
  },
  CONTACT: {
    BASE: '/contact',
    BY_ID: (id) => `/contact/${id}`,
    READ: (id) => `/contact/${id}/read`,
    ARCHIVE: (id) => `/contact/${id}/archive`,
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    ANALYTICS: '/admin/analytics',
    ACTIVITY: '/admin/activity',
    SEARCH: '/admin/search',
    SYSTEM: '/admin/system',
  },
  UPLOAD: '/upload',
};
