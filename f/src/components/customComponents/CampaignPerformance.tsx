'use client'
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CampaignPerformance = () => {
    const data = {
        labels: ["5k", "10k", "15k", "20k", "25k", "30k", "40k", "50k", "60k"],
        datasets: [
            {
                label: "Impressions",
                data: [20, 35, 40, 50, 64, 45, 55, 50, 48], 
                borderColor: "#4F46E5",
                backgroundColor: "rgba(79, 70, 229, 0.2)",
                pointBorderColor: "#4F46E5",
                tension: 0.3, 
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                min: 0,
                max: 100, 
            },
        },
    };

    return (
        <section className="p-6 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2">
                <img
                    src="/sale.webp" 
                    alt="New Year Sale"
                    width={200}
                    height={200}
                    className="w-full rounded-xl border-2 border-purple-400"
                />
            </div>

            <div className="w-full md:w-1/2">
                <p className=" text-xl text-gray-600">
                    Track the success of your campaigns with real-time performance insights. Admins and vendors
                    can easily monitor ad impressions and clicks to measure engagement and optimize results.
                </p>
                
                <div className="mt-6 p-4 border rounded-lg shadow-md w-full max-w-md h-fit">
                    <h3 className="font-semibold text-lg mb-3">Impressions</h3>
                    <div className="h-48">
                        <Line data={data} options={options} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CampaignPerformance;
