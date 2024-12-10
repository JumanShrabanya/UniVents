import React from "react";
import NavBar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import FooterSection from "../components/FooterSection";
import CallToActionSection from "../components/CallToActionSection";
import LatestEventsSections from "../components/LatestEventsSections";
import PleaseVerifyMessage from "../components/PleaseVerifyMessage";

const HomePage = () => {
  return (
    <div>
      <NavBar></NavBar>
      <PleaseVerifyMessage></PleaseVerifyMessage>
      <HeroSection></HeroSection>
      <LatestEventsSections></LatestEventsSections>
      <CallToActionSection></CallToActionSection>
      <FooterSection></FooterSection>
    </div>
  );
};

export default HomePage;
