
import { useState, useCallback } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  isBlocked: boolean;
  blockUntil?: number;
}

export const useRateLimit = (key: string, config: RateLimitConfig) => {
  const [state, setState] = useState<RateLimitState>(() => {
    const stored = localStorage.getItem(`rateLimit_${key}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        
        // Check if window has expired
        if (now - parsed.lastAttempt > config.windowMs) {
          return { attempts: 0, lastAttempt: 0, isBlocked: false };
        }
        
        // Check if block has expired
        if (parsed.blockUntil && now > parsed.blockUntil) {
          return { attempts: 0, lastAttempt: 0, isBlocked: false };
        }
        
        return parsed;
      } catch {
        return { attempts: 0, lastAttempt: 0, isBlocked: false };
      }
    }
    return { attempts: 0, lastAttempt: 0, isBlocked: false };
  });

  const checkLimit = useCallback(() => {
    const now = Date.now();
    
    // If blocked, check if block period has expired
    if (state.isBlocked && state.blockUntil && now > state.blockUntil) {
      const newState = { attempts: 0, lastAttempt: 0, isBlocked: false };
      setState(newState);
      localStorage.setItem(`rateLimit_${key}`, JSON.stringify(newState));
      return { allowed: true, timeUntilReset: 0 };
    }
    
    if (state.isBlocked) {
      const timeUntilReset = state.blockUntil ? Math.max(0, state.blockUntil - now) : 0;
      return { allowed: false, timeUntilReset };
    }
    
    // Check if window has expired
    if (now - state.lastAttempt > config.windowMs) {
      const newState = { attempts: 0, lastAttempt: 0, isBlocked: false };
      setState(newState);
      localStorage.setItem(`rateLimit_${key}`, JSON.stringify(newState));
      return { allowed: true, timeUntilReset: 0 };
    }
    
    if (state.attempts >= config.maxAttempts) {
      const blockUntil = now + (config.blockDurationMs || config.windowMs);
      const newState = { 
        ...state, 
        isBlocked: true, 
        blockUntil 
      };
      setState(newState);
      localStorage.setItem(`rateLimit_${key}`, JSON.stringify(newState));
      return { allowed: false, timeUntilReset: config.blockDurationMs || config.windowMs };
    }
    
    return { allowed: true, timeUntilReset: 0 };
  }, [state, key, config]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    const newState = {
      attempts: state.attempts + 1,
      lastAttempt: now,
      isBlocked: false
    };
    setState(newState);
    localStorage.setItem(`rateLimit_${key}`, JSON.stringify(newState));
  }, [state, key]);

  const reset = useCallback(() => {
    const newState = { attempts: 0, lastAttempt: 0, isBlocked: false };
    setState(newState);
    localStorage.removeItem(`rateLimit_${key}`);
  }, [key]);

  return {
    checkLimit,
    recordAttempt,
    reset,
    isBlocked: state.isBlocked,
    attempts: state.attempts,
    maxAttempts: config.maxAttempts
  };
};
