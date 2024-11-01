import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import RegistrationHeroSec from "../components/RegistrationHeroSec";
import FooterSection from "../components/FooterSection";
import SignUpForm from "../components/SignUpForm";
import { useUserType } from "../contexts/UserTypeContext";

const RegistrationPage = () => {
  const { userType, selectUserType } = useUserType();

  // to make the page stop scrolling
  // useEffect(() => {
  //   if (userType) {
  //     const handleClickOutside = () => {
  //       selectUserType("");
  //     };
  //     document.body.addEventListener("click", handleClickOutside);
  //     return () => {
  //       document.body.removeEventListener("click", handleClickOutside);
  //     };
  //   }
  // }, [userType, selectUserType]);
  return (
    <div className="relative">
      <NavBar></NavBar>
      <RegistrationHeroSec></RegistrationHeroSec>
      {userType === "" ? null : <SignUpForm></SignUpForm>}

      <FooterSection></FooterSection>
    </div>
  );
};

export default RegistrationPage;
