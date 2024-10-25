import React from "react";
import NavBar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import FooterSection from "../components/FooterSection";
import CallToActionSection from "../components/CallToActionSection";

const HomePage = () => {
  return (
    <div>
      <NavBar></NavBar>
      <HeroSection></HeroSection>
      <CallToActionSection></CallToActionSection>
      <FooterSection></FooterSection>
    </div>
  );
};

export default HomePage;
