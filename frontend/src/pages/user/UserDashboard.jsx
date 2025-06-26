import React from "react";
import HeroSlider from "../../components/common/HeroSlider";
import PromoSection from "../../components/common/PromoSection";
import BannerSection from "../../components/common/BannerSection";
import FeaturedCategories from "../../components/common/FeaturedCategories"; // ✅ Use this instead of CategoryCard

const UserDashboard = () => {
  return (
    <div className="pb-28">
      <HeroSlider />
      <PromoSection />
      <BannerSection />
      <FeaturedCategories /> {/* ✅ Your scrollable categories */}
    </div>
  );
};

export default UserDashboard;
