import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { Navi } from "@prisma/client";
import useCoords from "@libs/client/useCoords";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@components/header";

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  navi: Navi;
}

const Write: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [write, { data, loading }] = useMutation<WriteResponse>("/api/navi");
  const { latitude, longitude } = useCoords();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WriteForm>();
  const onValid = (data: WriteForm) => {
    if (loading) return;
    write({ ...data, latitude, longitude });
  };
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/navi/${data.navi.id}`);
    }
  }, [data, router]);

  return (
    <>
      <Header title="質問する" />
      <Layout canGoBack backURL="/navi" title="質問する">
        <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
          <TextArea
            register={register("question", {
              required: "質問内容を入力してください",
              minLength: { value: 5, message: "5文字以上入力してください" },
            })}
            placeholder="地域の皆さんに質問しよう!"
            required
          />
          {errors ? (
            <span className="block text-sm text-red-500">
              {errors?.question?.message}
            </span>
          ) : null}
          <Button text={loading ? "ローディング中" : "送信"} />
        </form>
      </Layout>
    </>
  );
};

export default Write;
