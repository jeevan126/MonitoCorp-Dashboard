'use client';

import { useEffect } from 'react';

export function ClientMSWLoader() {
  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') {
      console.log('Starting MSW in browser...');
      import('../mocks/browser').then(({ worker }) => {
        worker.start({ onUnhandledRequest: 'bypass' });
      });
    // }
  }, []);

  return null;
}
