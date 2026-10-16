import React, { useEffect } from "react";
import Banner from "../components/Landing page/Banner";
import MarqueeSlider from "../components/Landing page/MarqueeSlider";
import Features from "../components/Landing page/Features";
import InspiringBook from "../components/Landing page/InspiringBook";
import CategoriesShowCase from "../components/Landing page/CategoriesShowCase";
import ReviewsFeatureShowcase from "../components/Landing page/ReviewsFeatureShowcase";
import HorizontalScroll from "../components/Landing page/HorizontalScroll/HorizontalScroll";
import Footer from "../components/Landing page/Footer";
import ScrollToTop from "react-scroll-to-top";

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1">
        <Banner />
        <MarqueeSlider />
        <Features />
        <InspiringBook />
        <CategoriesShowCase />
        <HorizontalScroll />
        <ReviewsFeatureShowcase />
      </main>

      <ScrollToTop
        smooth
        className="!fixed !bottom-6 !right-6 !w-11 !h-11 !rounded-2xl !bg-slate-900 !text-white !shadow-lg !flex !items-center !justify-center hover:!bg-emerald-600 transition-colors z-40"
      />

      <Footer />
    </div>
  );
};

export default Home;
