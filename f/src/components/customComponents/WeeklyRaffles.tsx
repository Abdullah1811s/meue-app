
import { Ticket } from "lucide-react";

const WeeklyRaffles = () => {
    const prizes = [
        { id: 1, img: "/glasses.png", alt: "Luxury Dining Experience" },
        { id: 2, img: "/robot.png", alt: "Futuristic Tech Gadgets" },
        { id: 3, img: "/mobile.png", alt: "Wireless Charging Station" },
        { id: 4, img: "/books.png", alt: "Gourmet Gift Basket" },
    ];

    return (
        <section className="py-20">
            <div className="flex items-center gap-6">
                <h2 className="text-4xl font-bold flex items-center gap-2">
                    <Ticket className="w-8 h-8 text-yellow-500" />
                    Weekly Raffles
                </h2>
                <div className="h-2 w-8/12 bg-[#E8C8A8]"></div>
            </div>

            <p className="text-xl text-gray-700 mt-4">
                Users and vendors registered during pre-launch are automatically entered.
            </p>

            <h3 className="text-3xl font-semibold mt-10">PRIZES AND INCENTIVES</h3>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                {prizes.map((prize) => (
                    <div
                        key={prize.id}
                        className="border-4 border-purple-400 rounded-2xl overflow-hidden"
                    >
                        <img
                            src={prize.img}
                            alt={prize.alt}
                            width={200}
                            height={200}
                            className="w-full h-64 object-cover"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WeeklyRaffles;
