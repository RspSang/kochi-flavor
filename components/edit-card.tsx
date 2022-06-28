import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { RestaurantWithCount } from "pages/restaurants/[id]";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./button";
import Input from "./input";
import TextArea from "./textarea";

interface ConatactCardProps {
  restaurant: RestaurantWithCount;
  openTime: string;
  closeTime: string;
}

interface ContactForm {
  address: string;
  openTime: string;
  closeTime: string;
  closed: string;
  parking: string;
  cuisine: string;
  ect: string;
}

export default function ConatactCard({
  restaurant,
  openTime,
  closeTime,
}: ConatactCardProps) {
  const router = useRouter();
  const [toggleClick, setToggleClick] = useState(false);
  const [sended, setSended] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactForm>();
  const [contact, { data, loading }] = useMutation(
    `/api/restaurant/${router.query.id}/contact`
  );
  const onValid = ({
    address,
    openTime,
    closeTime,
    closed,
    parking,
    cuisine,
    ect,
  }: ContactForm) => {
    contact({
      name: restaurant.name,
      address,
      openTime,
      closeTime,
      closed,
      parking,
      cuisine,
      ect,
    });
  };
  const onClick = () => {
    setToggleClick((prev) => !prev);
  };

  useEffect(() => {
    setValue(
      "address",
      restaurant.state +
        restaurant.city +
        restaurant.street1 +
        restaurant.street2
    );
    setValue("openTime", openTime);
    setValue("closeTime", closeTime);
    setValue("cuisine", restaurant.cuisine);
  }, [restaurant]);

  useEffect(() => {
    if (data?.ok) {
      setSended(true);
    }
  }, [data]);

  return (
    <>
      <div
        onClick={onClick}
        className="rounded-full border-gray-500 border-[1px] justify-center space-x-1 py-1 inline-flex px-2 shadow-md text-gray-500 group hover:cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-orange-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        <span className="text-sm group-hover:text-orange-400">
          お店の情報を提供する
        </span>
      </div>
      {toggleClick ? (
        <>
          <div
            onClick={onClick}
            className="fixed top-0 left-0 bg-black w-full h-full z-40 opacity-70"
          />
          <div className="bg-slate-50 fixed px-4 py-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-fit z-50">
            {sended ? (
              <div className="flex justify-center flex-col space-y-4">
                <div className="flex justify-center text-green-500 py-4">
                  <div className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="opacity-50 animate-[ping_3s_ease-in-out_infinite]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-medium">
                    情報のご提供ありがとうございます
                  </span>
                  <span className="text-gray-600">
                    確認後、メールを送りいたします
                  </span>
                </div>
                <Button onClick={onClick} text="確認" />
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-2xl font-medium">{restaurant.name}</span>
                <div className="border-b-2" />
                <form className="space-y-1" onSubmit={handleSubmit(onValid)}>
                  <Input
                    register={register("address", {
                      required: "住所は必ず入力してください",
                    })}
                    name="address"
                    type="text"
                    label="住所"
                  />
                  <label
                    className="mb-1 block text-sm font-medium text-gray-700"
                    htmlFor="openTime"
                  >
                    営業時間
                  </label>
                  <div className="flex space-x-2 items-center">
                    <Input
                      register={register("openTime")}
                      name="openTime"
                      type="time"
                    />
                    <span>~</span>
                    <Input
                      register={register("closeTime")}
                      name="closeTime"
                      type="time"
                    />
                  </div>
                  <Input
                    register={register("closed")}
                    name="closed"
                    label="定休日"
                    type="text"
                    placeholder="月曜日"
                  />
                  <Input
                    register={register("parking")}
                    name="parking"
                    type="text"
                    label="駐車場"
                    placeholder="有り,2台"
                  />
                  <Input
                    register={register("cuisine")}
                    name="cuisine"
                    label="種類"
                    type="text"
                    placeholder="和食,カフェ"
                  />
                  <TextArea
                    register={register("ect")}
                    label="その他"
                    type="textarea"
                    placeholder={"喫煙場有り"}
                  />
                  {errors ? (
                    <span className="block text-sm text-red-500">
                      {errors?.address?.message}
                    </span>
                  ) : null}
                  <Button text="送信" />
                </form>
              </div>
            )}
          </div>
        </>
      ) : null}
    </>
  );
}
