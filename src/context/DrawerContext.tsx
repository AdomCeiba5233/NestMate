import React, { createContext, useContext } from 'react';

interface DrawerContextValue {
  openDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export function DrawerProvider({
  openDrawer,
  children,
}: DrawerContextValue & { children: React.ReactNode }) {
  return <DrawerContext.Provider value={{ openDrawer }}>{children}</DrawerContext.Provider>;
}

export function useDrawer(): DrawerContextValue {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
}
