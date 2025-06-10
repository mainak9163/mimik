import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type GSAPButtonProps = {
  children?: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  borderColor?: string;
  textColor?: string;
  textHoverColor?: string;
  backgroundColor?: string;
  fillColor?: string;
  [key: string]: any;
};

const GSAPButton: React.FC<GSAPButtonProps> = ({ 
  children = "Get GSAP", 
  href = "#", 
  className = "",
  onClick = undefined,
  borderColor = "#ffffff",
  textColor = "#ffffff",
  textHoverColor = "#000000",
  backgroundColor = "transparent",
  fillColor = "#ffffff",
  ...props 
}) => {
  const buttonRef = useRef<HTMLAnchorElement | null>(null);
  const flairRef = useRef<HTMLSpanElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const xSetRef = useRef<((value: number) => void) | null>(null);
  const ySetRef = useRef<((value: number) => void) | null>(null);
  
  useEffect(() => {
    const button = buttonRef.current;
    const flair = flairRef.current;
    const label = labelRef.current;
    
    if (!button || !flair || !label) return;

    // Initialize GSAP quick setters
    xSetRef.current = gsap.quickSetter(flair, "xPercent") as (value: number) => void;
    ySetRef.current = gsap.quickSetter(flair, "yPercent") as (value: number) => void;

    // Set initial scale to 0
    gsap.set(flair, { scale: 0 });

    const getXY = (e: MouseEvent) => {
      if (!button) return { x: 0, y: 0 };
      const { left, top, width, height } = button.getBoundingClientRect();

      const xTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, width, 0, 100),
        gsap.utils.clamp(0, 100)
      );

      const yTransformer = gsap.utils.pipe(
        gsap.utils.mapRange(0, height, 0, 100),
        gsap.utils.clamp(0, 100)
      );

      return {
        x: xTransformer(e.clientX - left),
        y: yTransformer(e.clientY - top)
      };
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const { x, y } = getXY(e);

      if (xSetRef.current) xSetRef.current(x);
      if (ySetRef.current) ySetRef.current(y);

      // Animate flair scale and text color
      gsap.to(flair, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });

      // Change text color on hover
      gsap.to(label, {
        color: textHoverColor,
        duration: 0.15,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const { x, y } = getXY(e);

      gsap.killTweensOf(flair);
      gsap.killTweensOf(label);

      // Animate flair out
      gsap.to(flair, {
        xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
        yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
        scale: 0,
        duration: 0.3,
        ease: "power2.out"
      });

      // Reset text color
      gsap.to(label, {
        color: textColor,
        duration: 0.15,
        ease: "power2.out"
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { x, y } = getXY(e);

      gsap.to(flair, {
        xPercent: x,
        yPercent: y,
        duration: 0.4,
        ease: "power2"
      });
    };

    // Add event listeners
    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("mousemove", handleMouseMove);

    // Cleanup function
    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("mousemove", handleMouseMove);
      gsap.killTweensOf(flair);
      gsap.killTweensOf(label);
    };
  }, [textColor, textHoverColor]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <a
      ref={buttonRef}
      href={href}
      className={`gsap-button ${className}`}
      onClick={handleClick}
      style={{
        alignItems: 'center',
        background: backgroundColor,
        border: 'none',
        borderRadius: '6.25rem',
        color: textColor,
        cursor: 'pointer',
        display: 'inline-flex',
        fontSize: '1.2rem',
        fontWeight: 600,
        gap: '0.363636em',
        justifyContent: 'center',
        letterSpacing: '-0.01em',
        lineHeight: 1.04545,
        overflow: 'hidden',
        padding: '0.9375rem 1.5rem',
        position: 'relative',
        textDecoration: 'none',
        wordBreak: 'break-word',
        transition: `color 0.15s cubic-bezier(0.77, 0, 0.175, 1)`,
        '--border-color': borderColor,
        '--fill-color': fillColor
      } as React.CSSProperties}
      {...props}
    >
      <span 
        ref={flairRef} 
        className="button__flair"
        style={{
          bottom: 0,
          left: 0,
          pointerEvents: 'none',
          position: 'absolute',
          right: 0,
          top: 0,
          transform: 'scale(0)',
          transformOrigin: '0 0',
          willChange: 'transform'
        }}
      >
        <span 
          style={{
            aspectRatio: '1/1',
            backgroundColor: fillColor,
            borderRadius: '50%',
            content: '""',
            display: 'block',
            left: 0,
            pointerEvents: 'none',
            position: 'absolute',
            top: 0,
            transform: 'translate(-50%, -50%)',
            width: '170%'
          }}
        />
      </span>
      <span 
        ref={labelRef}
        className="button__label"
        style={{
          position: 'relative',
          textAlign: 'center',
          zIndex: 1
        }}
      > 
        {children}
      </span>
      <style jsx>{`
        .gsap-button::after {
          border: 0.125rem solid var(--border-color);
          border-radius: 6.25rem;
          content: "";
          pointer-events: none;
          bottom: 0;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }
      `}</style>
    </a>
  );
};
export default GSAPButton;