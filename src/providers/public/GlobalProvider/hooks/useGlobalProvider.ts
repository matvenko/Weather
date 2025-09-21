// src/providers/public/GlobalProvider/hooks/useGlobalProvider.ts
import React from 'react';
import { GlobalContext } from '../GlobalContext';


export function useGlobalProvider() {
  const ctx = React.useContext(GlobalContext);
  if (!ctx) {
    // შეცდომის სიგნალი თუ Provider-ის გარეთ გამოიძახეს
    throw new Error('useGlobalProvider() must be used within <GlobalProvider>');
  }
  return ctx;
}
