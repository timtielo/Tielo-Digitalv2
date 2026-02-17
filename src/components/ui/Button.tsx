import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'default',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-td font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tielo-orange focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    default: 'bg-tielo-orange text-white hover:bg-tielo-orange/90 shadow-md hover:shadow-lg',
    outline: 'border-2 border-tielo-steel/30 bg-white text-tielo-navy hover:bg-tielo-offwhite hover:border-tielo-steel/50',
    ghost: 'text-tielo-navy hover:bg-tielo-orange/10',
    destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg',
  };

  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-11 px-8',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
