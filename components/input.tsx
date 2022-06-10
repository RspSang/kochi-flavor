import Image from "next/image";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label?: string;
  name: string;
  kind?: "text" | "comment";
  type: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
  required?: boolean;
  userAvatar?: string | null;
}

export default function Input({
  label,
  name,
  kind = "text",
  register,
  placeholder,
  type,
  required = false,
  userAvatar,
}: InputProps) {
  return (
    <div>
      {kind === "text" ? (
        <>
          <label
            className="mb-1 block text-sm font-medium text-gray-700"
            htmlFor={name}
          >
            {label}
          </label>
          <div className="relative flex items-center rounded-md shadow-sm">
            <input
              id={name}
              required={required}
              placeholder={placeholder}
              {...register}
              type={type}
              className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>
        </>
      ) : null}
      {kind === "comment" ? (
        <div className="flex relative items-center space-x-3">
          {userAvatar ? (
            <Image
              height={40}
              width={40}
              src={`https://imagedelivery.net/GSDuBVO5Xp3QfdrHmnLc2A/${userAvatar}/avatar`}
              className="rounded-full bg-slate-500"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-slate-500" />
          )}
          <div className="rounded-md shadow-sm w-full">
            <input
              id={name}
              required={required}
              placeholder={placeholder}
              {...register}
              type={type}
              className="w-full appearance-none rounded-full border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
