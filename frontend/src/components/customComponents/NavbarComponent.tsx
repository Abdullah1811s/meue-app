import { useState } from "react";
import Button from "../ui/button";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
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
        <nav className="bg-black sticky text-white flex items-center justify-between rounded-full w-[95%] md:w-[90%] lg:w-[85%] h-16 sm:h-18 md:h-20 mt-4 sm:mt-6 md:mt-8 px-4 sm:px-5 md:px-6 py-2 sm:py-3 mx-auto">
            <div className="flex items-center">
                <img
                    src="/Logo.png"
                    alt="Logo"
                    className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-4 lg:gap-8 xl:gap-10 items-center">
                <ul className="flex gap-4 lg:gap-8 xl:gap-10 text-base lg:text-lg">
                    <li>
                        <Link to="/" className="font-semibold text-[#DBC166] cursor-pointer transform transition duration-300 hover:scale-105">
                            Home
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
                    <li>
                        <Link
                            to="/about"
                            className="text-gray-400 cursor-not-allowed opacity-50 transition-colors duration-300 pointer-events-none"
                        >
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/contact"
                            className="text-gray-400 cursor-not-allowed opacity-50 transition-colors duration-300 pointer-events-none"
                        >
                            Contact
                        </Link>
                    </li>

                    <li>
                        <Link to="/affiliated/register" className="hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105">
                            Affiliate Register
                        </Link>
                    </li>
                </ul>
                <div className="flex items-center gap-2 lg:gap-3">
                    {!isAuthenticated ? (
                        <>
                            <Button
                                text="SIGN IN"
                                onClick={() => navigate('Login')}
                                className="bg-[#DBC166] text-black px-3 lg:px-4 text-sm lg:text-base h-8 rounded-full transform transition duration-300 hover:scale-110"
                            />
                            <Button
                                text="SIGN UP"
                                onClick={() => navigate('Signup')}
                                className="bg-[#DBC166] text-black px-3 lg:px-4 text-sm lg:text-base h-8 rounded-full transform transition duration-300 hover:scale-110"
                            />
                        </>
                    ) : (
                        <>
                            <Button
                                text="Pay Now"
                                onClick={() => navigate(`/users/payFast`)}
                                className="text-white px-3 lg:px-4 text-sm lg:text-base border border-[#DBC166] h-8 rounded-full transform transition duration-300 hover:scale-110"
                            />
                            <Button
                                text="LOGOUT"
                                onClick={handleLogout}
                                className="bg-[#DBC166] text-black px-3 lg:px-4 text-sm lg:text-base h-8 rounded-full transform transition duration-300 hover:scale-110"
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-white transition transform duration-300 hover:scale-110"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 w-[95%] mx-auto mt-2 bg-black rounded-2xl text-white flex flex-col items-center py-4 space-y-4 md:hidden">
                    <ul className="flex flex-col items-center gap-4 text-base w-full">
                        <li className="w-full text-center">
                            <Link to="/" className="font-semibold text-[#DBC166] block py-2 cursor-pointer transform transition duration-300 hover:scale-105">
                                Home
                            </Link>
                        </li>
                        <li className="w-full text-center">
                            <Link to={vendorToken ? "/vendor" : "/vendorOnBoarding"} className="block py-2 hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105">
                                Vendor
                            </Link>
                        </li>
                        <li className="w-full text-center">
                            <Link to="/about" className="block py-2 hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105">
                                About us
                            </Link>
                        </li>
                        <li className="w-full text-center">
                            <Link to="/contact" className="block py-2 hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105">
                                Contact
                            </Link>
                        </li>
                        <Link to="/affiliated/register" className="hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105">
                            Affiliate Register
                        </Link>
                    </ul>
                    <div className="flex flex-col gap-3 w-full px-4">
                        {!isAuthenticated ? (
                            <>
                                <Button
                                    text="SIGN IN"
                                    onClick={() => navigate('Login')}
                                    className="bg-[#DBC166] text-black w-full h-10 rounded-full transform transition duration-300 hover:scale-105"
                                />
                                <Button
                                    text="SIGN UP"
                                    onClick={() => navigate('Signup')}
                                    className="bg-[#DBC166] text-black w-full h-10 rounded-full transform transition duration-300 hover:scale-105"
                                />
                            </>
                        ) : (
                            <>
                                <Button
                                    text="Pay Now"
                                    onClick={() => navigate(`/users/payFast`)}
                                    className="bg-[#f8e5a1] text-black w-full h-10 rounded-full transform transition duration-300 hover:scale-105"
                                />
                                <Button
                                    text="LOGOUT"
                                    onClick={handleLogout}
                                    className="bg-[#DBC166] text-black w-full h-10 rounded-full transform transition duration-300 hover:scale-105"
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavbarComponent;