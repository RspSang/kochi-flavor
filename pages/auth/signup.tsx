import Button from "@components/button";
import Input from "@components/input";
import Link from "next/link";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { User } from "@prisma/client";
import { useEffect } from "react";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  formErrors?: string;
}

interface SignUpResponse {
  ok: boolean;
  error: string;
}

interface TokenForm {
  token: string;
}

interface TokenResponse {
  ok: boolean;
  error?: string;
}

const SignUp: NextPage = () => {
  const router = useRouter();

  const [signUp, { data, loading }] =
    useMutation<SignUpResponse>("/api/users/signup");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({ mode: "onChange" });
  const onVaild = (inputData: SignUpForm) => {
    if (loading) return;
    signUp(inputData);
  };

  const [confirmToken, { loading: tokenLoading, data: tokenData }] =
    useMutation<TokenResponse>("/api/users/confirm");
  const { register: tokenRegister, handleSubmit: tokenHandleSubmit } =
    useForm<TokenForm>();
  const onTokenValid = (validForm: TokenForm) => {
    if (tokenLoading) return;
    confirmToken(validForm);
  };
  useEffect(() => {
    if (tokenData?.ok) {
      router.push("/");
    }
  }, [tokenData, router]);

  return (
    <div className="mt-16 px-6 max-w-xl">
      <h3 className="text-center text-3xl font-bold">会員登録</h3>
      <div className="mt-8">
        <div>
          <h5 className="text-center font-medium text-gray-500">
            <span>既にアカウントをお持ちでしょうか？</span>
            <Link href="/auth/signin">
              <a className="text-blue-500">ログイン&rarr;</a>
            </Link>
          </h5>
        </div>
        {data?.ok ? (
          <form
            onSubmit={tokenHandleSubmit(onTokenValid)}
            className="mt-8 flex flex-col space-y-4"
          >
            <Input
              register={tokenRegister("token")}
              name="token"
              label="認証コードを入力"
              type="number"
              required
            />
            {tokenData?.error ? (
              <span className="text-red-500 text-sm">{tokenData.error}</span>
            ) : null}
            <span className="text-slate-500 text-sm">
              *登録したメールアドレスに認証コードを送りました
            </span>
            <Button text={tokenLoading ? "ローディング中" : "送信"} />
          </form>
        ) : (
          <form
            onSubmit={handleSubmit(onVaild)}
            className="mt-8 flex flex-col space-y-3"
          >
            <Input
              register={register("name", {
                required: true,
                minLength: {
                  value: 3,
                  message: "ニックネームは3文字以上必要です",
                },
              })}
              name="name"
              label="ニックネーム"
              type="text"
              required
            />
            {errors.name ? (
              <span className="block text-sm text-red-500">
                {errors.name.message}
              </span>
            ) : null}

            <Input
              register={register("email", {
                required: "メールアドレスは必須です",
                pattern: {
                  value:
                    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/,
                  message: "メール形式のみ有効です",
                },
              })}
              name="email"
              label="メールアドレス"
              type="text"
              required
            />
            {errors.email ? (
              <span className="block text-sm text-red-500">
                {errors.email.message}
              </span>
            ) : null}
            {data?.error ? (
              <span className="block text-sm text-red-500">{data.error}</span>
            ) : null}
            <Input
              register={register("password", {
                required: true,
                minLength: {
                  value: 6,
                  message: "パスワードは6文字以上必要です",
                },
              })}
              name="password"
              label="パスワード"
              type="password"
              required
            />
            {errors.password ? (
              <span className="block text-sm text-red-500">
                {errors.password.message}
              </span>
            ) : null}
            <Button text={loading ? "読み込み中" : "会員登録"} />
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
