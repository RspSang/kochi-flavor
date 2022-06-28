import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import Image from "next/image";

interface EditProfileForm {
  avatar?: FileList;
  name?: string;
  userDescription?: string;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);
  const onValid = async ({
    avatar,
    name,
    userDescription,
  }: EditProfileForm) => {
    if (loading) return;
    if (name === "") {
      return setError("formErrors", {
        message: "ニックネームは必ず入力してください",
      });
    }
    if (avatar && avatar.length > 0 && user) {
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      const form = new FormData();
      form.append("file", avatar[0], user?.id + "");
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      editProfile({ name, userDescription, avatarId: id });
    } else {
      editProfile({ name, userDescription });
    }
  };
  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.userDescription)
      setValue("userDescription", user.userDescription);
    if (user?.avatar)
      setAvatarPreview(
        `https://imagedelivery.net/GSDuBVO5Xp3QfdrHmnLc2A/${user?.avatar}/avatar`
      );
  }, [user, setValue]);
  const [avatarPreview, setAvatarPreview] = useState("");
  const name = watch("name");
  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);
  useEffect(() => {
    if (data?.ok === true) {
      router.push(`/profile/${user?.id}`);
    }
    if (data && !data.ok && data.error) {
      setError("formErrors", { message: data.error });
    }
  }, [data, setError]);
  useEffect(() => {
    clearErrors();
  }, [name]);
  return (
    <Layout canGoBack title="プロフィールの編集">
      <form
        onSubmit={handleSubmit(onValid)}
        className="space-y-4 py-5 px-4 max-w-xl"
      >
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <Image
              height={64}
              width={64}
              src={avatarPreview}
              className="rounded-full bg-slate-500"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-slate-500" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            写真を選ぶ
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        {errors?.formErrors?.message ? (
          <div className="bg-red-200 rounded-lg px-4 py-4">
            <span className="block text-sm text-red-500">
              {errors.formErrors.message}
            </span>
          </div>
        ) : null}
        <Input
          register={register("name")}
          required={false}
          label="ニックネーム"
          name="name"
          type="text"
        />
        <Input
          register={register("userDescription")}
          required={false}
          label="自己紹介"
          name="userDescription"
          type="text"
        />
        <Button text={"更新"} />
      </form>
    </Layout>
  );
};

export default EditProfile;
