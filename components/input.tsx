import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  kind?: "text";
  type: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
  required: boolean;
}

export default function Input({
  label,
  name,
  kind = "text",
  register,
  placeholder,
  type,
  required,
}: InputProps) {
  return (
    <div>
      <label
        className="mb-1 block text-sm font-medium text-gray-700"
        htmlFor={name}
      >
        {label}
      </label>
      {kind === "text" ? (
        <div className="relative flex items-center  rounded-md shadow-sm">
          <input
            id={name}
            required={required}
            placeholder={placeholder}
            {...register}
            type={type}
            className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          />
        </div>
      ) : null}
    </div>
  );
}
