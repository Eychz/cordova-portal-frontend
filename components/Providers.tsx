'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { queryClient } from '@/lib/queryClient';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  // Defensive fallback: If key is not configured, load children without provider
  // to avoid blocking development, but log a warning.
  if (!recaptchaSiteKey) {
    console.warn("reCAPTCHA Site Key is missing. Caching is active but reCAPTCHA verification is disabled.");
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaSiteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
      useRecaptchaNet={true}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </GoogleReCaptchaProvider>
  );
}
