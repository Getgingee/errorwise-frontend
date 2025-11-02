interface InputComponentProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

export default function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  disabled = false, 
  required = false,
  className = '',
  label,
  error
}: InputComponentProps) {
  const baseClasses = 'appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm';
  
  const errorClasses = error ? 'border-red-300' : 'border-gray-300';
  const classes = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={classes}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}