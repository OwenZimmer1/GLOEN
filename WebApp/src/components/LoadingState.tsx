import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingStateContext = createContext<LoadingStateType | undefined>(undefined);

interface LoadingStateProviderProps {
  children: ReactNode;
}

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-2 text-gray-700">Processing your image...</p>
      </div>
    </div>
  );
};

export const LoadingStateProvider: React.FC<LoadingStateProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <LoadingStateContext.Provider value={{ isLoading, setLoading }}>
      {isLoading && <LoadingSpinner />}
      {children}
    </LoadingStateContext.Provider>
  );
};

export const useLoadingState = (): LoadingStateType => {
  const context = useContext(LoadingStateContext);
  if (!context) {
    throw new Error('useLoadingState must be used within a LoadingStateProvider');
  }
  return context;
};