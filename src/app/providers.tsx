'use client';

import { Provider } from 'react-redux';
import { store, loadFromStorage } from '@/store';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(loadFromStorage());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        {children}
        <Toaster position="top-center" richColors />
      </ThemeProvider>
    </Provider>
  );
}
