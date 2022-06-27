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
import Link from "next/link";
import Rating from "react-rating";

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
export interface ReviewResponse {
  ok: boolean;
  reviews: ReviewWithUser[];
}

interface RestaurantWithCount extends Restaurant {
  _count: { reviews: number };
}

interface RestaurantResponse {
  ok: boolean;
  restaurant: RestaurantWithCount;
  want: boolean;
  went: boolean;
}

interface ReviewForm {
  photo: FileList;
  review: string;
  rate: number;
}

const containerStyle = {
  height: "100%",
  width: "100%",
  overflow: "hidden",
  borderRadius: "1rem",
};

const toHHMM = (time: string) => {
  let myNum = parseInt(time, 10) * 60;
  let hours = Math.floor(myNum / 3600) as string | number;
  let minutes = Math.floor((myNum - (hours as number) * 3600) / 60) as
    | string
    | number;

  if (hours < 10) {
    hours = ("0" + hours) as string;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return hours + ":" + minutes;
};

const RestaurantDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setValue,
    getValues,
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
  const [toggleReview, setToggleReview] = useState(false);
  const [position, setPosition] = useState({});
  const [address, setAddress] = useState("");
  const [time, setTime] = useState("");
  const [rate, setRate] = useState(0);
  const writeReviewClick = () => {
    setToggleReview((prev) => !prev);
  };
  const [cleanCuisine, setCleanCuisine] = useState([] as string[]);
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
  const onValid = async ({ photo, review, rate }: ReviewForm) => {
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
      writeReview({ review, photoId: id, rate });
    } else {
      writeReview({ review, rate });
    }
  };
  const photo = watch("photo");
  const [photoPreview, setPhotoPreview] = useState("");
  const onImageClick = () => {
    setPhotoPreview("");
  };
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
      mutate();
      setToggleReview((prev) => !prev);
    }
  }, [writeReviewData, reset, reviewMutate]);
  useEffect(() => {
    if (toggleReview) {
      setFocus("review");
    }
  }, [toggleReview]);
  useEffect(() => {
    if (data?.ok) {
      setAddress(
        (data.restaurant.postalcode === "null"
          ? ""
          : data.restaurant.postalcode) +
          data.restaurant.state +
          data.restaurant.city +
          data.restaurant.street1
      );
      setPosition({
        lat: data.restaurant.latitude,
        lng: data.restaurant.longitude,
      });
      setCleanCuisine(data.restaurant.cuisine.split(","));
      if (data.restaurant.open_time) {
        setTime(
          toHHMM(data.restaurant.open_time) +
            " ~ " +
            toHHMM(data.restaurant.close_time)
        );
      } else {
        setTime("?");
      }
    }
  }, [data]);
  useEffect(() => {
    if (reviewData?.ok && reviewData.reviews) {
      const rates = reviewData.reviews.map((review) => review.rate);
      if (rates.length > 0) {
        setRate(rates.reduce((accumulator, curr) => accumulator + curr));
      }
    }
  }, [reviewData]);
  return (
    <Layout canGoBack>
      {data?.ok && data.restaurant ? (
        <div className="px-4 max-w-xl mt-6 space-y-1">
          <div className="pb-4">
            <div className="px-3 py-4 space-x-6 flex items-end">
              <span className="text-4xl font-medium">
                {data.restaurant.name}
              </span>
              {data.restaurant._count.reviews ? (
                <div className="flex space-x-2 items-center">
                  <span className="text-orange-500 text-3xl">
                    {(rate / data.restaurant._count.reviews).toFixed(2)}
                  </span>
                  <span className="text-slate-400">
                    {data.restaurant._count.reviews}名
                  </span>
                </div>
              ) : null}
            </div>
            <div
              className={cls(
                "flex relative space-x-2",
                data.restaurant.image ? "overflow-x-scroll" : ""
              )}
            >
              {data.restaurant.image ? (
                <div>
                  <Image
                    className="rounded-2xl"
                    width={200}
                    height={200}
                    src={data.restaurant.image}
                  />
                </div>
              ) : null}
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
                  toggleReview ? "text-orange-500" : "hover:text-orange-500"
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
              <div>
                <Link href={`https://google.com/maps/search/${address}`}>
                  <a className="hover:text-orange-500 hover:cursor-pointer">
                    <span className="font-medium text-lg">{address}</span>
                    <br />
                    <span>{data.restaurant.street2}</span>
                  </a>
                </Link>
              </div>
              <div className="bg-slate-500 rounded-2xl w-full h-60">
                <LoadScript
                  googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!}
                >
                  <GoogleMap
                    options={defaultMapOptions}
                    mapContainerStyle={containerStyle}
                    center={position as google.maps.LatLng}
                    zoom={17}
                  >
                    <Marker position={position as google.maps.LatLng} />
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
                  <span>{time}</span>
                </div>
                {data.restaurant.cuisine ? (
                  <div className="flex items-center justify-between">
                    <span>種類</span>
                    <div className="flex space-x-2">
                      {cleanCuisine.map((cuisine, i) => (
                        <div className="rounded-full bg-slate-200 px-2" key={i}>
                          <span>{cuisine}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {reviewData && reviewData.reviews
            ? reviewData.reviews.map((review) => (
                <div key={review.id}>
                  <ReviewCard
                    review={review}
                    type={"simple"}
                    reviewMutate={reviewMutate}
                    mutate={mutate}
                  />
                </div>
              ))
            : null}
          {toggleReview ? (
            <div className="py-4">
              <form onSubmit={handleSubmit(onValid)}>
                <div className="flex justify-center">
                  <div className="bg-slate-200 pt-1 rounded-full flex space-x-2 mb-2 px-2 shadow-md">
                    <span className="text-sm text-gray-500">評価</span>
                    <Rating
                      onClick={(value) => setValue("rate", value)}
                      placeholderRating={getValues("rate")}
                      placeholderSymbol={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="rgb(249 115 22)"
                          viewBox="0 0 24 24"
                          stroke="rgb(249 115 22)"
                          strokeWidth="1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      }
                      fractions={2}
                      emptySymbol={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="rgb(249 115 22)"
                          strokeWidth="1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      }
                      fullSymbol={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="rgb(249 115 22)"
                          viewBox="0 0 24 24"
                          stroke="rgb(249 115 22)"
                          strokeWidth="1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      }
                    />
                  </div>
                </div>
                <div>
                  {photoPreview ? (
                    <div className="relative pb-80">
                      <Image
                        layout="fill"
                        src={photoPreview}
                        onClick={onImageClick}
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
