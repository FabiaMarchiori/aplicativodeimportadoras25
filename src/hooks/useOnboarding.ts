import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ONBOARDING_KEY_PREFIX = 'onboarding_completed_';

export const useOnboarding = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      setShowOnboarding(false);
      return;
    }

    const storageKey = `${ONBOARDING_KEY_PREFIX}${user.id}`;
    const hasCompleted = localStorage.getItem(storageKey) === 'true';
    
    setShowOnboarding(!hasCompleted);
    setIsLoading(false);
  }, [user]);

  const completeOnboarding = () => {
    if (!user) return;
    
    const storageKey = `${ONBOARDING_KEY_PREFIX}${user.id}`;
    localStorage.setItem(storageKey, 'true');
    setShowOnboarding(false);
  };

  return {
    showOnboarding,
    completeOnboarding,
    isLoading
  };
};
