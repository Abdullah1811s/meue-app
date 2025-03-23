import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Lapboard = () => {
  
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<number>(5); // Number of users to display initially

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
    
      const sortedUsers = response.data.users.sort(
        (a: any, b: any) => b.TotalPoints - a.TotalPoints
      );
      setAllUsers(sortedUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Function to handle "View More" button click
  const handleViewMore = () => {
    setVisibleUsers((prev) => prev + 5); // Increase visible users by 5
  };
  return (
    <div className="bg-white mt-6 border shadow-sm rounded-lg overflow-hidden w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4">
        <h2 className="text-lg md:text-xl text-start font-bold">Leaderboard</h2>
        <p className="text-gray-600 text-start text-sm md:text-base">
          Discover which user has the highest number of points
        </p>
      </div>

      {/* Table for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#DBC166] text-black">
              <th className="p-2 md:p-3 text-left">Name</th>
              <th className="p-2 md:p-3 text-center">Total Points</th>
              <th className="p-2 md:p-3 text-center">Signup Points</th>
              <th className="p-2 md:p-3 text-center">Daily Login Points</th>
              <th className="p-2 md:p-3 text-center">Referral Points</th>
              <th className="p-2 md:p-3 text-center">Wheel Rotate Points</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.slice(0, visibleUsers).map((user, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 md:p-3 flex items-center gap-2">
                  <span className="text-sm md:text-base">{user?.name}</span>
                </td>
                <td className="p-2 md:p-3 font-bold text-center">
                  {user?.TotalPoints}
                </td>
                <td className="p-2 md:p-3 text-center">{user?.signupPoint}</td>
                <td className="p-2 md:p-3 text-center">{user?.DailyLoginPoint}</td>
                <td className="p-2 md:p-3 text-center">{user?.ReferralPoint}</td>
                <td className="p-2 md:p-3 text-center">
                  {user?.wheelRotatePoint}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="md:hidden">
        {allUsers.slice(0, visibleUsers).map((user, index) => (
          <div
            key={index}
            className="border-b p-4 hover:bg-gray-50 transition-colors"
          >
            {/* User Name */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-medium text-base">{user?.name}</span>
            </div>

            {/* Points Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-[#DBC166] p-2 rounded-lg text-center">
                <p className="text-gray-700 font-semibold">Total Points</p>
                <p className="font-bold text-black">{user?.TotalPoints}</p>
              </div>
              <div className="bg-[#DBC166] p-2 rounded-lg text-center">
                <p className="text-gray-700 font-semibold">Signup Points</p>
                <p className="text-black">{user?.signupPoint}</p>
              </div>
              <div className="bg-[#DBC166] p-2 rounded-lg text-center">
                <p className="text-gray-700 font-semibold">Daily Login Points</p>
                <p className="text-black">{user?.DailyLoginPoint}</p>
              </div>
              <div className="bg-[#DBC166] p-2 rounded-lg text-center">
                <p className="text-gray-700 font-semibold">Referral Points</p>
                <p className="text-black">{user?.ReferralPoint}</p>
              </div>
              <div className="bg-[#DBC166] p-2 rounded-lg text-center">
                <p className="text-gray-700 font-semibold">Wheel Rotate Points</p>
                <p className="text-black">{user?.wheelRotatePoint}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* "View More" Button */}
      {visibleUsers < allUsers.length && (
        <div
          className="bg-[#DBC166] text-black text-center p-2 md:p-3 cursor-pointer font-semibold text-sm md:text-base hover:bg-[#c9af59] transition-colors"
          onClick={handleViewMore}
        >
          View More
        </div>
      )}
    </div>
  );
};

export default Lapboard;