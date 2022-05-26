import Button from "@components/button";
import Input from "@components/input";
import Link from "next/link";

export default function Join() {
  return (
    <div className="mt-16 px-6 max-w-xl">
      <h3 className="text-center text-3xl font-bold">会員登録</h3>
      <div className="mt-8">
        <div>
          <h5 className="text-center font-medium text-gray-500">
            <span>既にアカウントをお持ちでしょうか？</span>
            <Link href="/login">
              <a className="text-blue-500">ログイン&rarr;</a>
            </Link>
          </h5>
        </div>
        <form className="mt-8 flex flex-col space-y-3">
          <Input name="name" label="ニックネーム" type="text" required />
          <Input name="name" label="メールアドレス" type="text" required />
          <Input name="name" label="パスワード" type="text" required />
          <Button text="会員登録" />
        </form>
      </div>
    </div>
  );
}
