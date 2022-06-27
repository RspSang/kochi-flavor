import Button from "@components/button";
import Input from "@components/input";
import { NextPage } from "next";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import Layout from "@components/layout";

interface SignInForm {
  email: string;
  password: string;
}

interface SignInResponse {
  ok: boolean;
  error: string;
}

const SignIn: NextPage = () => {
  const router = useRouter();
  const [signIn, { data, loading }] =
    useMutation<SignInResponse>("/api/users/signin");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>();
  const onValid = async (data: SignInForm) => {
    if (loading) return;
    signIn(data);
  };
  useEffect(() => {
    if (data?.ok) {
      router.push("/");
    }
  }, [data, router]);
  return (
    <Layout hasTabBar>
      <div className="mt-16 px-4 max-w-xl">
        <h3 className="text-center text-3xl font-bold">
          🍽️ 高知プレートへようこそ
        </h3>
        <div className="mt-12">
          <div>
            <h5 className="text-center font-medium text-gray-500">
              ログインする方法を選んでください
            </h5>
            <div className="mt-8 grid w-full grid-cols-2 border-b"></div>
          </div>
          {errors.email || errors.password || data?.error ? (
            <div className="bg-red-200 rounded-lg px-4 py-4 top-4 relative">
              <span className="block text-sm text-red-500">
                {errors.email?.message}
              </span>
              <span className="block text-sm text-red-500">
                {errors.password?.message}
              </span>
              <span className="block text-sm text-red-500">{data?.error}</span>
            </div>
          ) : null}
          <form
            onSubmit={handleSubmit(onValid)}
            className="mt-8 flex flex-col space-y-4"
          >
            <Input
              register={register("email", {
                required: "メールアドレスを入力してください",
              })}
              name="email"
              label="メールアドレス"
              type="email"
            />

            <Input
              register={register("password", {
                required: "パスワードを入力してください",
              })}
              name="password"
              label="パスワード"
              type="password"
            />
            <Button text={loading ? "読み込み中" : "ログイン"} />
          </form>
          <div className="mt-8">
            {/* <div className="relative">
              <div className="absolute w-full border-t border-gray-300" />
              <div className="relative -top-3 text-center">
                <span className="bg-white px-2 text-sm text-gray-500">
                  または
                </span>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                onClick={() => {}}
                className="flex items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-100 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  viewBox="0 0 48 48"
                >
                  <path
                    className="group-hover:fill-[#FFC107]"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    className="group-hover:fill-[#FF3D00]"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    className="group-hover:fill-[#4CAF50]"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    className="group-hover:fill-[#1976D2]"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
              </button>
              <button
                onClick={() => {}}
                className="flex items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-100 hover:text-green-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="h-7 w-7"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path d="M272.1 204.2v71.1c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.1 0-2.1-.6-2.6-1.3l-32.6-44v42.2c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.8 0-3.2-1.4-3.2-3.2v-71.1c0-1.8 1.4-3.2 3.2-3.2H219c1 0 2.1.5 2.6 1.4l32.6 44v-42.2c0-1.8 1.4-3.2 3.2-3.2h11.4c1.8-.1 3.3 1.4 3.3 3.1zm-82-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 1.8 1.4 3.2 3.2 3.2h11.4c1.8 0 3.2-1.4 3.2-3.2v-71.1c0-1.7-1.4-3.2-3.2-3.2zm-27.5 59.6h-31.1v-56.4c0-1.8-1.4-3.2-3.2-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 .9.3 1.6.9 2.2.6.5 1.3.9 2.2.9h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.7-1.4-3.2-3.1-3.2zM332.1 201h-45.7c-1.7 0-3.2 1.4-3.2 3.2v71.1c0 1.7 1.4 3.2 3.2 3.2h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2V234c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2v-11.4c-.1-1.7-1.5-3.2-3.2-3.2zM448 113.7V399c-.1 44.8-36.8 81.1-81.7 81H81c-44.8-.1-81.1-36.9-81-81.7V113c.1-44.8 36.9-81.1 81.7-81H367c44.8.1 81.1 36.8 81 81.7zm-61.6 122.6c0-73-73.2-132.4-163.1-132.4-89.9 0-163.1 59.4-163.1 132.4 0 65.4 58 120.2 136.4 130.6 19.1 4.1 16.9 11.1 12.6 36.8-.7 4.1-3.3 16.1 14.1 8.8 17.4-7.3 93.9-55.3 128.2-94.7 23.6-26 34.9-52.3 34.9-81.5z" />
                </svg>
              </button>
            </div> */}
            <h5 className="text-center mt-7 font-medium text-gray-500">
              <span>アカウントをお持ちでないしょうか？</span>
              <Link href="/auth/signup">
                <a className="text-blue-500">会員登録&rarr;</a>
              </Link>
            </h5>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
