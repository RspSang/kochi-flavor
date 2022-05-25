import Link from "next/link";

function cls(...classnames: string[]) {
  return classnames.join(" ");
}

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
          <div>
            <label className="text-sm font-medium text-gray-700">
              ニックネーム
            </label>
            <div className="mt-1">
              <input
                className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                type="text"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">メール</label>
            <div className="mt-1">
              <input
                className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                type="email"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              パスワード
            </label>
            <div className="mt-1">
              <input
                className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                type="password"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              パスワード再確認
            </label>
            <div className="mt-1">
              <input
                className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                type="password"
                required
              />
            </div>
          </div>
          <button className="rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
            会員登録
          </button>
        </form>
      </div>
    </div>
  );
}
