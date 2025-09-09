// src/hooks/useCountUp.js
import { useState, useEffect } from 'react';

/**
 * Animates a number counting up from 0 to the target end value.
 * @param {number} endValue - The final number to count up to.
 * @param {number} duration - The total duration of the animation in milliseconds.
 * @returns {number} The current value to display at each frame.
 */
const useCountUp = (endValue, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Apply ease-out function for a smoother acceleration/deceleration effect
      const easeOutValue = 1 - Math.pow(1 - percentage, 3);
      
      setCount(Math.floor(easeOutValue * endValue));

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue); // Ensure it ends exactly on the end value
      }
    };

    requestAnimationFrame(animate);
    
    // Reset count to 0 when endValue changes significantly (optional)
    return () => setCount(0); 
  }, [endValue, duration]);

  return count;
};

export default useCountUp;