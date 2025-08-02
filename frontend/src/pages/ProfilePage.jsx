import React from "react";
import { useParams } from "react-router-dom";
import ProfileComponent from "../components/ProfileComponent";

const ProfilePage = () => {
  const { userId } = useParams();

  return (
    <div>
      <ProfileComponent></ProfileComponent>
    </div>
  );
};

export default ProfilePage;
