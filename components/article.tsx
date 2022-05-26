import Link from "next/link";
import type { UseFormRegisterReturn } from "react-hook-form";

interface ArticleProps {
  title: string;
  description: string;
}

export default function Article({ title, description }: ArticleProps) {
  return (
    <div className="mb-5 max-w-xl px-4">
      <Link href={"/"}>
        <a className="cursor-pointer">
          <div className="bg-slate-500 rounded-3xl py-28">
            <div className="flex justify-center flex-col items-center">
              <p className="border-b-4 text-2xl font-semibold text-slate-200">
                {title}
              </p>
              <p className="text-lg font-medium text-slate-200">
                {description}
              </p>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}
