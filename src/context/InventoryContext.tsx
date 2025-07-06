import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface InventoryContextType {
  inventoryVersion: number;
  refreshInventory: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [inventoryVersion, setInventoryVersion] = useState(0);

  const refreshInventory = useCallback(() => {
    setInventoryVersion(prev => prev + 1);
  }, []);

  return (
    <InventoryContext.Provider value={{ inventoryVersion, refreshInventory }}>
      {children}
    </InventoryContext.Provider>
  );
};
