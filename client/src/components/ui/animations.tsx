import { useEffect, useState, useRef, ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Fade in animation component
interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  threshold?: number;
  once?: boolean;
  as?: React.ElementType;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 20,
  threshold = 0.1,
  once = true,
  as: Component = motion.div,
}: FadeInProps) {
  // Determine transform based on direction
  let transform = {};
  
  switch (direction) {
    case "up":
      transform = { y: distance };
      break;
    case "down":
      transform = { y: -distance };
      break;
    case "left":
      transform = { x: distance };
      break;
    case "right":
      transform = { x: -distance };
      break;
    default:
      transform = {};
  }

  return (
    <Component
      initial={{ opacity: 0, ...transform }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </Component>
  );
}

// Staggered children animation component
interface StaggerProps {
  children: ReactNode[];
  className?: string;
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  threshold?: number;
  once?: boolean;
  as?: React.ElementType;
  childClassName?: string;
}

export function Stagger({
  children,
  className,
  delay = 0,
  staggerDelay = 0.1,
  duration = 0.5,
  direction = "up",
  distance = 20,
  threshold = 0.1,
  once = true,
  as: Component = motion.div,
  childClassName,
}: StaggerProps) {
  // Determine transform based on direction
  let transform = {};
  
  switch (direction) {
    case "up":
      transform = { y: distance };
      break;
    case "down":
      transform = { y: -distance };
      break;
    case "left":
      transform = { x: distance };
      break;
    case "right":
      transform = { x: -distance };
      break;
    default:
      transform = {};
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, ...transform },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        ease: "easeOut",
      },
    },
  };

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      className={className}
    >
      {Array.isArray(children) && children.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className={childClassName}
        >
          {child}
        </motion.div>
      ))}
    </Component>
  );
}

// Reveal on scroll component
interface RevealOnScrollProps {
  children: ReactNode;
  threshold?: number;
  className?: string;
}

export function RevealOnScroll({
  children,
  threshold = 0.1,
  className,
}: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-in-out",
        isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-10",
        className
      )}
    >
      {children}
    </div>
  );
}

// Text animation variants
export const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Heading with animation
interface AnimatedHeadingProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function AnimatedHeading({
  children,
  className,
  delay = 0,
  as: Tag = "h2",
}: AnimatedHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut" 
      }}
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  );
}

// Loading spinner with animations
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <motion.div
        className={cn(
          "border-t-2 border-primary rounded-full",
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </div>
  );
}

// Slide-in animation
interface SlideInProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
}

export function SlideIn({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 50,
  threshold = 0.1,
}: SlideInProps) {
  let initial = {};
  
  switch (direction) {
    case "up":
      initial = { y: distance };
      break;
    case "down":
      initial = { y: -distance };
      break;
    case "left":
      initial = { x: distance };
      break;
    case "right":
      initial = { x: -distance };
      break;
  }

  return (
    <motion.div
      initial={{ ...initial, opacity: 0 }}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, amount: threshold }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Pulsing animation for highlights or attention-grabbing elements
interface PulseProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
  delay?: number;
}

export function Pulse({
  children,
  className,
  scale = 1.03,
  duration = 2,
  delay = 0,
}: PulseProps) {
  return (
    <motion.div
      animate={{ 
        scale: [1, scale, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}