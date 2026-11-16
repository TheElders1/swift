'use client';

import { useEffect, useRef, useState } from 'react';

export function AnimatedNumber({ value, suffix = '', duration = 1100 }: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const element = numberRef.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(value);
      return;
    }
    if (!('IntersectionObserver' in window)) {
      setCurrent(value);
      return;
    }

    let started = false;
    let frame = 0;
    let startTime = 0;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      setCurrent(1);

      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.max(1, Math.round(1 + (value - 1) * eased)));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };

      frame = requestAnimationFrame(animate);
      observer.disconnect();
    }, { threshold: 0.15, rootMargin: '0px 0px 30px 0px' });

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [duration, value]);

  const formatted = new Intl.NumberFormat('en-US').format(current);
  return <span ref={numberRef} aria-label={`${value}${suffix}`}>{formatted}{suffix}</span>;
}
