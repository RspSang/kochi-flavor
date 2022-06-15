import type { NextPage } from "next";
import Layout from "@components/layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Like, Restaurant, Review, User } from "@prisma/client";
import Image from "next/image";
import { defaultMapOptions } from "@components/map";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextArea from "@components/textarea";
import Button from "@components/button";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { cls } from "@libs/client/utils";
import ReviewCard from "@components/review-card";

interface UserWithCount extends User {
  _count: { reviews: number };
}

export interface ReviewWithUser extends Review {
  user: UserWithCount;
  _count: {
    likes: number;
    comments: number;
  };
  likes: Like[];
}
interface ReviewResponse {
  ok: boolean;
  reviews: ReviewWithUser[];
}

interface RestaurantResponse {
  ok: boolean;
  restaurant: Restaurant;
  want: boolean;
  went: boolean;
}

interface ReviewForm {
  photo: FileList;
  review: string;
}

const containerStyle = {
  height: "100%",
  width: "100%",
  overflow: "hidden",
  borderRadius: "1rem",
};

const RestaurantDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    watch,
    formState: { errors },
  } = useForm<ReviewForm>();
  const { data, mutate } = useSWR<RestaurantResponse>(
    router.query.id ? `/api/restaurant/${router.query.id}` : null
  );
  const { data: reviewData, mutate: reviewMutate } = useSWR<ReviewResponse>(
    router.query.id ? `/api/restaurant/${router.query.id}/reviews` : null
  );
  const [writeReview, { data: writeReviewData, loading }] = useMutation(
    `/api/restaurant/${router.query.id}/reviews/write`
  );
  const [want, { data: wantData, loading: wantLoading }] = useMutation(
    `/api/restaurant/${router.query.id}/want`
  );
  const [went, { data: wentData, loading: wentLoading }] = useMutation(
    `/api/restaurant/${router.query.id}/went`
  );
  const [toggleRevie, setToggleRevie] = useState(false);
  const writeReviewClick = () => {
    setToggleRevie((prev) => !prev);
  };
  const wantClick = () => {
    if (wantLoading) return;
    want({});
    mutate(
      {
        ...data,
        want: !data?.want,
        went: data?.went,
      },
      false
    );
  };
  const wentClick = () => {
    if (wentLoading) return;
    went({});
    mutate(
      {
        ...data,
        want: data?.want,
        went: !data?.went,
      },
      false
    );
  };
  const onValid = async ({ photo, review }: ReviewForm) => {
    if (loading) return;
    if (photo && photo.length > 0) {
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      const form = new FormData();
      form.append("file", photo[0], review);
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      writeReview({ review, photoId: id });
    } else {
      writeReview({ review });
    }
  };
  const photo = watch("photo");
  const [photoPreview, setPhotoPreview] = useState("");
  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);
  useEffect(() => {
    if (writeReviewData && writeReviewData.ok) {
      reset();
      reviewMutate();
      setToggleRevie((prev) => !prev);
    }
  }, [writeReviewData, reset, reviewMutate]);
  useEffect(() => {
    if (toggleRevie) {
      setFocus("review");
    }
  }, [toggleRevie]);
  return (
    <Layout canGoBack>
      {data?.ok && data.restaurant ? (
        <div className="px-4 max-w-xl mt-6 space-y-1">
          <div className="pb-4">
            <div className="px-3 py-4 space-x-6">
              <span className="text-4xl font-medium">
                {data.restaurant.name}
              </span>
              <span className="text-orange-500 text-3xl">3.8</span>
            </div>
            <div className="flex overflow-x-scroll relative space-x-2">
              {[1, 2, 3, 4].map(() => (
                <div>
                  <Image
                    className="rounded-2xl"
                    width={200}
                    height={200}
                    src={data.restaurant.image}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="py-4 border-t-2">
            <div className="flex justify-around">
              <div
                onClick={wantClick}
                className={cls(
                  "flex items-center content-center flex-col cursor-pointer )",
                  data.want ? "text-orange-500" : "hover:text-orange-500"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <span className="text-sm">行きたい</span>
              </div>
              <div
                onClick={wentClick}
                className={cls(
                  "flex items-center content-center flex-col cursor-pointer )",
                  data.went ? "text-orange-500" : "hover:text-orange-500"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">行ってきた</span>
              </div>
              <div
                onClick={writeReviewClick}
                className={cls(
                  "flex items-center content-center flex-col cursor-pointer",
                  toggleRevie ? "text-orange-500" : "hover:text-orange-500"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span className="text-sm">レビューを書く</span>
              </div>
            </div>
          </div>
          <div className="py-4 border-t-2">
            <div className="space-y-2">
              <span className="font-medium text-lg">
                {data.restaurant.address}
              </span>
              <div className="bg-slate-500 rounded-2xl w-full h-60">
                <LoadScript
                  googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!}
                >
                  <GoogleMap
                    options={defaultMapOptions}
                    mapContainerStyle={containerStyle}
                    center={{
                      lat: +data.restaurant.latitude,
                      lng: +data.restaurant.longitude,
                    }}
                    zoom={17}
                  >
                    <Marker
                      position={{
                        lat: +data.restaurant.latitude,
                        lng: +data.restaurant.longitude,
                      }}
                    />
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
          </div>
          <div className="py-4 border-t-2">
            <div className="space-y-2">
              <span className="font-medium text-lg">お店の情報</span>
              <div className="space-y-[1px] text-slate-700">
                <div className="flex justify-between">
                  <span>営業時間</span>
                  <span>10:00 ~ 22:00</span>
                </div>
                <div className="flex justify-between">
                  <span>休日</span>
                  <span>なし</span>
                </div>
                <div className="flex justify-between">
                  <span>値段</span>
                  <span>500円 ~ 2000円/一人</span>
                </div>
                <div className="flex justify-between">
                  <span>種類</span>
                  <span>和食</span>
                </div>
                <div className="flex justify-between">
                  <span>駐車場</span>
                  <span>有り</span>
                </div>
              </div>
            </div>
          </div>
          {reviewData?.reviews
            ? reviewData.reviews.map((review) => (
                <div key={review.id}>
                  <ReviewCard review={review} type={"simple"} />
                </div>
              ))
            : null}
          {toggleRevie ? (
            <div className="py-4">
              <form onSubmit={handleSubmit(onValid)}>
                <div>
                  {photoPreview ? (
                    <div className="relative pb-80">
                      <Image
                        layout="fill"
                        src={photoPreview}
                        className="w-full rounded-lg object-cover text-gray-600"
                      />
                    </div>
                  ) : (
                    <label className="flex h-24 mb-1 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500">
                      <svg
                        className="h-12 w-12"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input
                        {...register("photo")}
                        accept="image/*"
                        className="hidden"
                        type="file"
                      />
                    </label>
                  )}
                </div>
                <TextArea
                  register={register("review", {
                    required: "レビューを入力してください",
                    minLength: {
                      value: 3,
                      message: "3文字以上入力してください",
                    },
                  })}
                  placeholder="ここはどんなお店ですか？"
                  required
                />
                {errors ? (
                  <span className="block text-sm text-red-500">
                    {errors?.review?.message}
                  </span>
                ) : null}
                <Button text={loading ? "ローディング中" : "送信"} />
              </form>
            </div>
          ) : null}
        </div>
      ) : null}
    </Layout>
  );
};

export default RestaurantDetail;
