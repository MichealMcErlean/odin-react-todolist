import {useState, useEffect} from 'react';

export default function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      return defaultValue
    }
  });

  useEffect(() => {
    if (typeof window !== undefined) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState];
}