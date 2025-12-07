import {useState, useEffect} from 'react';

export default function useLocalStorageState(key, defaultValue, reviver = (data) => data) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        const rawData = JSON.parse(storedValue);
        console.log(rawData);
        return reviver(rawData);
      }
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window !== undefined) {
      console.log("Saving state to localStorage for key:", key, state);
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState];
}