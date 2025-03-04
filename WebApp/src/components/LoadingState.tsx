import React, { createContext, useState, useContext, ReactNode } from "react";
import { Loader2 } from "lucide-react";

// Interface defining loading state context type
interface LoadingStateType {
  isLoading: boolean; // Current loading state
  setLoading: (loading: boolean) => void; // Setter function
}

// Create context for loading state management
const LoadingStateContext = createContext<LoadingStateType | undefined>(
  undefined
);

// Props interface for provider component
interface LoadingStateProviderProps {
  children: ReactNode; // Child components to wrap
}

// Loading spinner component with overlay
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Centered loading spinner container */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        {/* Animated loading icon */}
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-2 text-gray-700">Processing your image...</p>
      </div>
    </div>
  );
};

// Provider component managing loading state
export const LoadingStateProvider: React.FC<LoadingStateProviderProps> = ({
  children,
}) => {
  // State management for loading status
  const [isLoading, setIsLoading] = useState(false);

  // Setter function for loading state
  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <LoadingStateContext.Provider value={{ isLoading, setLoading }}>
      {/* Conditionally render spinner when loading */}
      {isLoading && <LoadingSpinner />}
      {children}
    </LoadingStateContext.Provider>
  );
};

// Custom hook for accessing loading state
export const useLoadingState = (): LoadingStateType => {
  const context = useContext(LoadingStateContext);

  // Error handling for missing provider
  if (!context) {
    throw new Error(
      "useLoadingState must be used within a LoadingStateProvider"
    );
  }
  return context;
};
