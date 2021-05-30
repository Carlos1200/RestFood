import Layout from "../components/Layout";
import dynamic from "next/dynamic";

const MapSearch = dynamic(import("../components/Mapa"), {
  ssr: false,
});

const Index = () => {
  return (
    <Layout>
      <MapSearch />
    </Layout>
  );
};

export default Index;
