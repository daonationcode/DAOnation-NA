import { useContext } from 'react';
import { EnvironmentContext } from '../contexts/EnvironmentContext';

const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
};

export default useEnvironment;
