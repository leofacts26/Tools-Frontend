// useCurrentDate.js
import { useEffect, useState } from 'react';

const useCurrentDate = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    setCurrentDate(today);
  }, []);

  return currentDate;
};

export default useCurrentDate;
