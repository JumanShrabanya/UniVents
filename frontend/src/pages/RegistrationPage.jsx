import React from "react";
import NavBar from "../components/NavBar";
import RegistrationHeroSec from "../components/RegistrationHeroSec";
import FooterSection from "../components/FooterSection";

const RegistrationPage = () => {
  return (
    <div className="relative">
      <NavBar></NavBar>
      <RegistrationHeroSec></RegistrationHeroSec>
      <FooterSection></FooterSection>
    </div>
  );
};

export default RegistrationPage;
