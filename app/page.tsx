import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Overview from "@/components/Overview";
import CountyRankings from "@/components/CountyRankings";
import ModelPerformance from "@/components/ModelPerformance";
import FeatureImportance from "@/components/FeatureImportance";
import Calculator from "@/components/Calculator";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Overview />
        <CountyRankings />
        <ModelPerformance />
        <FeatureImportance />
        <Calculator />
      </main>
      <Footer />
    </>
  );
}
