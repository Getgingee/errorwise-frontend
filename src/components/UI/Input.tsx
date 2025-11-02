import React, { forwardRef } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string; // Added helperText support
  icon?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, // Added helperText parameter
    icon, 
    variant = 'outlined', 
    size = 'md', 
    className = '', 
    ...props 
  }, ref) => {
    const baseClasses = 'w-full border rounded-md transition-all duration-200 focus:outline-none focus:ring-2';
    
    const variantClasses = {
      default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20',
      outlined: 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20',
      filled: 'border-transparent bg-white/5 backdrop-blur-sm focus:bg-white focus:border-blue-500 focus:ring-blue-500/20'
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg'
    };

    const errorClasses = error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
      : '';

    const inputClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${errorClasses}
      ${icon ? 'pl-10' : ''}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">
                {icon}
              </div>
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;