"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { ComponentPropsWithoutRef, useEffect, useRef, useMemo, useCallback } from "react";

import { cn } from "@/lib/utils";

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
}

const DEFAULT_SPRING_CONFIG = {
  damping: 60,
  stiffness: 100,
};

// const DEFAULT_INTL_OPTIONS = {
//   minimumFractionDigits: 0,
//   maximumFractionDigits: 0,
// };

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  
  // Memoize initial and target values
  const initialValue = useMemo(() => 
    direction === "down" ? value : startValue, 
    [direction, value, startValue]
  );
  
  const targetValue = useMemo(() => 
    direction === "down" ? startValue : value, 
    [direction, value, startValue]
  );

  const motionValue = useMotionValue(initialValue);
  const springValue = useSpring(motionValue, DEFAULT_SPRING_CONFIG);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  // Memoize number formatter
  const numberFormatter = useMemo(() => 
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }), 
    [decimalPlaces]
  );

  // Memoize display value for initial render
  const displayValue = useMemo(() => 
    numberFormatter.format(initialValue), 
    [numberFormatter, initialValue]
  );

  // Memoize className
  const combinedClassName = useMemo(() => 
    cn(
      "inline-block tabular-nums tracking-wider text-black dark:text-white",
      className,
    ), 
    [className]
  );

  // Optimize the format function
  const formatNumber = useCallback((num: number) => {
    return numberFormatter.format(Number(num.toFixed(decimalPlaces)));
  }, [numberFormatter, decimalPlaces]);

  // Handle animation trigger
  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      motionValue.set(targetValue);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [motionValue, isInView, delay, targetValue]);

  // Handle value updates
  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatNumber(latest);
      }
    });

    return unsubscribe;
  }, [springValue, formatNumber]);

  // Update motion value when target changes (for dynamic updates)
  useEffect(() => {
    if (isInView) {
      motionValue.set(targetValue);
    }
  }, [motionValue, targetValue, isInView]);

  return (
    <span
      ref={ref}
      className={combinedClassName}
      {...props}
    >
      {displayValue}
    </span>
  );
}