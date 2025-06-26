import React from "react";
import HeroSlider from "../components/common/HeroSlider";
import PromoSection from "../components/common/PromoSection";
import BannerSection from "../components/common/BannerSection"; 
import FeaturedCategories from "../components/common/FeaturedCategories";

const Home = () => (
  <div>
    <HeroSlider />
    <PromoSection />
    <BannerSection />  
    <FeaturedCategories />
  </div>
);

export default Home;
