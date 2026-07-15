import React from 'react';
import NotFound from '@/components/common/NotFound.jsx';

export const metadata = {
  title: 'Page Not Found',
  description: 'The requested page could not be found.',
};

export default function RootNotFound() {
  return <NotFound />;
}
