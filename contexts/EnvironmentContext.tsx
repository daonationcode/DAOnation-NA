import React, { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

// Create the context
export const EnvironmentContext = createContext({} as { setCurrency: Dispatch<SetStateAction<string>>; getCurrency: () => string; isServer: () => boolean });

// Provider component
export const EnvironmentProvider = ({ children }) => {
  const [currency, setCurrency] = useState('');

  const getCurrency = () => {
    return currency;
  };

  const isServer = () => typeof window === 'undefined';

  return <EnvironmentContext.Provider value={{ setCurrency, getCurrency, isServer }}>{children}</EnvironmentContext.Provider>;
};
