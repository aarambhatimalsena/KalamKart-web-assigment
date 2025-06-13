import React from "react";
import Header from "../layouts/Header";
import HeroSlider from "../components/heroslider";
import FeaturedCategories from "../components/FeaturedCategories";
// import PromoSection from "../components/PromoSection";

const Home = () => {
  return (
    <div>
      <Header />
      <HeroSlider />
      <FeaturedCategories />
      {/* <PromoSection />  */}
    </div>
  );
};

export default Home;
