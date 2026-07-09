// ============================================================
// Animated Counter Component
// ============================================================
// Smoothly animates a number from 0 to the target value.
// Used for scores, percentages, and other numeric displays.
// ============================================================

import { useEffect, useState, useRef } from 'react';

export default function AnimatedCounter({ target, duration = 2000, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Use IntersectionObserver to start animation when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateValue(0, target, duration);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  function animateValue(start, end, dur) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / dur, 1);

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}
