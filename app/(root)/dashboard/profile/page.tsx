import { UserProfile } from "@clerk/nextjs";

const Profile = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <UserProfile />
    </div>
  );
};

export default Profile;
