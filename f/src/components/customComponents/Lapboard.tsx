const agents = [
  {
    name: "Saymi",
    img: "/", 
    dayReferral: 5,
    weeklyReferral: 2,
    monthlyReferral: 6,
  },
  {
    name: "Saymi",
    img: "/",
    dayReferral: 5,
    weeklyReferral: 2,
    monthlyReferral: 6,
  },
  {
    name: "Saymi",
    img: "/",
    dayReferral: 5,
    weeklyReferral: 2,
    monthlyReferral: 6,
  },
  {
    name: "Saymi",
    img: "/",
    dayReferral: 5,
    weeklyReferral: 2,
    monthlyReferral: 6,
  },
];

const Lapboard = () => {
  return (
    <div className="bg-white mt-6 border shadow-sm rounded-lg overflow-hidden w-full max-w-4xl ">
    
      <div className="p-4">
        <h2 className="text-lg text-start font-bold">Statistics</h2>
        <p className="text-gray-600 text-start" >
          Discover which user has the highest number of referrals
        </p>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#DBC166] text-black">
            <th className="p-3 text-left">Agent</th>
            <th className="p-3">Day Referral</th>
            <th className="p-3">Weekly Referral</th>
            <th className="p-3">Monthly Referral</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent, index) => (
            <tr key={index} className="border-b">
              <td className="p-3 flex items-center gap-2">
                <img
                  src={agent.img}
                  alt="alt"
                  width={200}
                  height={200}
                  className="w-8 h-8 rounded-full"
                />
                <span>{agent.name}</span>
              </td>
              <td className="p-3 font-bold text-center">{agent.dayReferral}</td>
              <td className="p-3 text-center">{agent.weeklyReferral}</td>
              <td className="p-3 text-center">{agent.monthlyReferral}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-[#DBC166] text-black text-center p-3 cursor-pointer font-semibold">
        View More
      </div>
    </div>
  );
};

export default Lapboard;
