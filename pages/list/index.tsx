import Layout from "@components/layout";
import Card from "@components/card";
import useSWR from "swr";
import useCoords from "@libs/client/useCoords";

export default function List() {
  const { latitude, longitude } = useCoords();
  const { data } = useSWR(
    latitude && longitude
      ? `/api/list?latitude=${latitude}&longitude=${longitude}`
      : null
  );
  console.log(data);
  return (
    <Layout searchBar hasTabBar>
      {[1, 2, 3, 4].map((i, _) => (
        <Card title={"title"} description={"desc"} key={i} />
      ))}
    </Layout>
  );
}

// https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=transit&origins=37.541,126.986&destinations=35.1595454,126.8526012&region=KR&key=[api-key]
