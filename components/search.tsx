import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

interface SearchProps {
  setSearchText: Dispatch<SetStateAction<string>>;
}

export default function Search({ setSearchText }: SearchProps) {
  const { register, handleSubmit, watch } = useForm({ mode: "onChange" });
  const search = watch("search");
  const onValid = ({ search }: any) => {
    setSearchText(search);
  };

  useEffect(() => {
    if (search === "") {
      setSearchText("");
    }
  }, [search]);
  return (
    <div className="fixed w-full max-w-xl px-4 z-20">
      <div className="flex item-center relative  mt-7 ">
        <div className="pointer-events-none absolute left-0 flex items-center justify-center pl-5 pt-[0.6rem]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <form onSubmit={handleSubmit(onValid)} className="w-full">
          <input
            {...register("search", { required: true })}
            type="text"
            className="border-solid border-2 pl-[3.5rem] border-orange-500 focus:border-orange-400 focus:outline-none focus:ring-orange-400 appearance-none rounded-full w-full py-2 shadow-sm"
          />
        </form>
      </div>
    </div>
  );
}
