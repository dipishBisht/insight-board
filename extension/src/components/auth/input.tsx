import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  status?: 'error' | 'success';
  statusIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  icon,
  endIcon,
  status,
  statusIcon,
  className,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [_, setHasValue] = useState(!!props.value);

  // Status based border color
  const borderColor = status === 'error'
    ? 'border-red-500 dark:border-red-600'
    : status === 'success'
    ? 'border-green-500 dark:border-green-600'
    : focused
    ? 'border-indigo-500 dark:border-indigo-400'
    : 'border-gray-300 dark:border-gray-600';

  // Handle value change to track if input has a value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className="relative">
      <div
        className={`
          flex items-center rounded-lg border bg-white dark:bg-gray-800 shadow-sm
          transition-all duration-200 overflow-hidden
          ${borderColor}
          ${focused ? 'ring-2 ring-indigo-100 dark:ring-indigo-900' : ''}
          ${props.disabled ? 'bg-gray-100 dark:bg-gray-900 opacity-75' : ''}
        `}
      >
        {icon && (
          <div className={`
            flex items-center justify-center w-10 text-gray-400
            ${focused ? 'text-indigo-500 dark:text-indigo-400' : ''}
            transition-colors
          `}>
            {icon}
          </div>
        )}
        
        <input
          {...props}
          onChange={handleChange}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full py-3 px-3 text-gray-700 dark:text-gray-200 bg-transparent
            placeholder-gray-400 focus:outline-none
            ${icon ? 'pl-0' : 'pl-3'}
            ${endIcon || statusIcon ? 'pr-0' : 'pr-3'}
          `}
        />
        
        {statusIcon && (
          <div className="flex items-center justify-center w-10 transition-opacity">
            {statusIcon}
          </div>
        )}
        
        {endIcon && (
          <div className="flex items-center justify-center w-10 px-2">
            {endIcon}
          </div>
        )}
      </div>
      
      {/* Animated label will be added in a future enhancement if needed */}
    </div>
  );
};

export default Input;