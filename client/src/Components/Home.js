import React from "react";

const Home = ({ userDetails }) => {
  const user = userDetails.user;
  const logout = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
  };
  return (
    <div>
      <div className="flex justify-between w-3/4 items-center">
        <h1>Welcome Home</h1>
        <button
          onClick={logout}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
