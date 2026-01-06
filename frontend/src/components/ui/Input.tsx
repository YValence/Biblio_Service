import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-black">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
            w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-lg
            text-black placeholder-neutral-400
            focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
            transition-all duration-150
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-black">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`
            w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-lg
            text-black
            focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
            transition-all duration-150
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";
