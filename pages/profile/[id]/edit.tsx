import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";

const EditProfile: NextPage = () => {
  return (
    <Layout canGoBack title="プロフィールの更新">
      <form className="space-y-4 py-10 px-4 max-w-xl">
        <div className="flex items-center space-x-3">
          <div className="h-16 w-16 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            写真を選ぶ
            <input
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input required={false} label="名前" name="name" type="text" />
        <Input
          required={false}
          label="メールアドレス"
          name="email"
          type="email"
        />
        <Input required={false} label="携帯番号" name="phone" type="number" />
        <Button text={"更新"} />
      </form>
    </Layout>
  );
};

export default EditProfile;
