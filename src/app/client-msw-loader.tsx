'use client';

import { useEffect } from 'react';

export function ClientMSWLoader() {
  useEffect(() => {
      console.log('Starting MSW in browser...');
      import('../mocks/browser').then(({ worker }) => {
        worker.start({ onUnhandledRequest: 'bypass' });
      });
    // }
  }, []);

  return null;
}
