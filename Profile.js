import React from "react";

function Profile() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">Your Profile</h2>
        <div className="mb-4">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="rounded-full mx-auto"
          />
        </div>
        <p className="text-purple-700 font-semibold mb-2">Username: OpnlyUser</p>
        <p className="text-purple-500 mb-2">Posts: 0</p>
        <p className="text-purple-500">Bio: Welcome to Opnly!</p>
      </div>
    </div>
  );
}

export default Profile;
