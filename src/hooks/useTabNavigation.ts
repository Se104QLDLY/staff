import { useState, useCallback } from 'react';

export const useTabNavigation = <T extends string>(defaultTab: T) => {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);
  
  const changeTab = useCallback((tab: T) => {
    setActiveTab(tab);
  }, []);
  
  const isActive = useCallback((tab: T) => {
    return activeTab === tab;
  }, [activeTab]);
  
  return {
    activeTab,
    setActiveTab,
    changeTab,
    isActive
  };
}; 