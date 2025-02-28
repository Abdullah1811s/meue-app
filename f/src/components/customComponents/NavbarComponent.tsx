import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { Link, useNavigate, useParams } from "react-router-dom";

const NavbarComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const vendorToken = localStorage.getItem("VendorToken");

    const handleLogout = () => {
        localStorage.removeItem("UserToken");
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="bg-black sticky text-white flex items-center justify-between rounded-full w-[95%] lg:w-[85%] h-16 md:h-18 lg:h-20 mt-4 sm:mt-6 md:mt-8 px-4 sm:px-6 py-2 mx-auto">
            <div className="flex items-center">
                <img
                    src="/Logo.png"
                    alt="Logo"
                    className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex gap-6 xl:gap-8 items-center">
                <ul className="flex gap-6 xl:gap-10 text-base xl:text-lg">
                    <li>
                        <Link to="/" className="font-semibold text-[#DBC166] cursor-pointer transform transition duration-300 hover:scale-105">
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link to="/about" className="text-gray-400 opacity-50 pointer-events-none">
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="text-gray-400 opacity-50 pointer-events-none">
                            Contact
                        </Link>
                    </li>
                    <li>
                        <Link to="/affiliated/register" className="hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105">
                            Affiliate Register
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={vendorToken ? `/vendor/dashboard/${id}` : "/vendorOnBoarding"}
                            className="hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105"
                        >
                            {vendorToken ? "Vendor dashboard" : "Vendor"}
                        </Link>
                    </li>
                </ul>
                <div className="flex items-center gap-4">
                    {!isAuthenticated ? (
                        <>
                            <Button
                                onClick={() => navigate("Login")}
                                className="bg-[#DBC166] text-black px-4 text-sm lg:text-base h-9 rounded-full transition hover:scale-105"
                            >
                                SIGN IN
                            </Button>
                            <Button
                                onClick={() => navigate("Signup")}
                                className="bg-[#DBC166] text-black px-4 text-sm lg:text-base h-9 rounded-full transition hover:scale-105"
                            >
                                SIGN UP
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={() => navigate(`/users/payFast`)}
                                className="text-white px-4 border border-[#DBC166] h-9 rounded-full transition hover:scale-105"
                            >
                                Pay Now
                            </Button>
                            <Button
                                onClick={handleLogout}
                                className="bg-[#DBC166] text-black px-4 text-sm lg:text-base h-9 rounded-full transition hover:scale-105"
                            >
                                LOGOUT
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden text-white transition transform duration-300 hover:scale-110"
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 max-w-[90%] sm:max-w-[80%] mx-auto mt-2 bg-black rounded-2xl text-white flex flex-col items-center py-4 space-y-4 lg:hidden">
                    <ul className="flex flex-col items-center gap-4 text-base w-full">
                        <li className="w-full text-center">
                            <Link to="/" className="font-semibold text-[#DBC166] block py-2 cursor-pointer transform transition duration-300 hover:scale-105">
                                Home
                            </Link>
                        </li>
                        <li className="w-full text-center">
                            <Link to={vendorToken ? `/vendor/dashboard/${id}` : "/vendorOnBoarding"} className="block py-2 hover:text-[#DBC166] transition duration-300 cursor-pointer transform hover:scale-105">
                                Vendor
                            </Link>
                        </li>
                        <li className="w-full text-center">
                            <Link to="/about" className="block py-2 text-gray-400 opacity-50 pointer-events-none">
                                About us
                            </Link>
                        </li>
                        <li className="w-full text-center">
                            <Link to="/contact" className="block py-2 text-gray-400 opacity-50 pointer-events-none">
                                Contact
                            </Link>
                        </li>
                        <li className="w-full text-center">
                            <Link to="/affiliated/register" className="block py-2 hover:text-[#DBC166] transition duration-300 cursor-pointer transform hover:scale-105">
                                Affiliate Register
                            </Link>
                        </li>
                    </ul>
                    <div className="flex flex-col gap-3 w-full px-4">
                        {!isAuthenticated ? (
                            <>
                                <Button
                                    onClick={() => navigate("Login")}
                                    className="bg-[#DBC166] text-black px-4 text-sm lg:text-base h-9 rounded-full transition hover:scale-105"
                                >
                                    SIGN IN
                                </Button>
                                <Button
                                    onClick={() => navigate("Signup")}
                                    className="bg-[#DBC166] text-black px-4 text-sm lg:text-base h-9 rounded-full transition hover:scale-105"
                                >
                                    SIGN UP
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => navigate(`/users/payFast`)}
                                    className="text-white px-4 border border-[#DBC166] h-9 rounded-full transition hover:scale-105"
                                >
                                    Pay Now
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    className="bg-[#DBC166] text-black px-4 text-sm lg:text-base h-9 rounded-full transition hover:scale-105"
                                >
                                    LOGOUT
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavbarComponent;
