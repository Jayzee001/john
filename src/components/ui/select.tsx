import * as React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';


interface SelectProps extends React.ComponentPropsWithoutRef<typeof RadixSelect.Root> {
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, options, placeholder, className, disabled }) => (
  <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
    <RadixSelect.Trigger
      className={`inline-flex items-center justify-between rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className || ''}`}
      aria-label={placeholder}
    >
      <RadixSelect.Value placeholder={placeholder || 'Select...'} />
      <RadixSelect.Icon className="ml-1">
        <ChevronDown className="h-3 w-3 text-gray-400" />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
    <RadixSelect.Portal>
      <RadixSelect.Content className="z-50 bg-white border border-gray-200 rounded shadow-lg mt-1">
        <RadixSelect.Viewport className="p-1">
          {options.map((option) => (
            <RadixSelect.Item
              key={option.value}
              value={option.value}
              className="px-2 py-1 rounded text-sm text-gray-900 cursor-pointer select-none focus:bg-blue-100 focus:text-blue-700 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700"
            >
              <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
            </RadixSelect.Item>
          ))}
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  </RadixSelect.Root>
); 