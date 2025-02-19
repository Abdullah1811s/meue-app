import { useState } from "react";
import Button from "../ui/button";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { useNavigate, useParams } from "react-router-dom";

const NavbarComponent = () => {
    const { id } = useParams();

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

    const handleLogout = () => {
        localStorage.removeItem("UserToken");
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="bg-black sticky text-white flex items-center justify-between rounded-full w-full md:w-[85%] h-20 mt-8 px-6 py-3 mx-auto">
            <div className="flex items-center gap-2">
                <img
                    src="/Logo.png"
                    alt="Logo"
                    width={200}
                    height={200}
                    className="h-10 mr-3 md:h-8 md:w-auto"
                />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-6 md:gap-4 lg:gap-10 items-center">
                <ul className="flex gap-6 md:gap-4 lg:gap-10 text-xl md:text-lg">
                    <li className="font-semibold text-[#DBC166] cursor-pointer transform transition duration-300 hover:scale-105">Home</li>
                    <li className="hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105">Vendor</li>
                    <li className="hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105">About us</li>
                    <li className="hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105">Contact</li>
                </ul>
                <div className="flex items-center gap-3">
                    {!isAuthenticated ? (
                        <>
                            <Button text="SIGN IN" onClick={() => navigate('Login')} className="bg-[#DBC166] text-black px-4 h-8 rounded-full transform transition duration-300 hover:scale-110" />
                            <Button text="SIGN UP" onClick={() => navigate('Signup')} className="bg-[#DBC166] text-black px-4 h-8 rounded-full transform transition duration-300 hover:scale-110" />
                        </>
                    ) : (
                        <>
                            <Button text="Pay Now" onClick={() => navigate(`/users/payFast`)} className=" text-white px-4 border border-[#DBC166] h-8 rounded-full transform transition duration-300 hover:scale-110" />
                            <Button text="Dashboard" onClick={() => navigate(`/users/referral/${id}`)} className=" text-white px-4 border-2 border-[#DBC166] h-8 rounded-full transform transition duration-300 hover:scale-110" />

                            <Button text="LOGOUT" onClick={handleLogout} className="bg-[#DBC166] text-black px-4 h-8 rounded-full transform transition duration-300 hover:scale-110" />

                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white transition transform duration-300 hover:scale-110">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-black text-white flex flex-col items-center py-5 space-y-4 md:hidden">
                    <ul className="flex flex-col items-center gap-4 text-lg">
                        <li className="font-semibold text-[#DBC166] cursor-pointer transform transition duration-300 hover:scale-105">Home</li>
                        <li className="hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105">Vendor</li>
                        <li className="hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105">About us</li>
                        <li className="hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105">Contact</li>
                    </ul>
                    <div className="flex flex-col gap-3">
                        {!isAuthenticated ? (
                            <>
                                <Button text="SIGN IN" onClick={() => navigate('Login')} className="bg-[#DBC166] text-black px-4 h-8 rounded-full transform transition duration-300 hover:scale-110" />
                                <Button text="SIGN UP" onClick={() => navigate('Signup')} className="bg-[#DBC166] text-black px-4 h-8 rounded-full transform transition duration-300 hover:scale-110" />
                            </>
                        ) : (
                            <>
                                <Button text="Dashboard" onClick={() => navigate(`/users/referral/${id}`)} className="bg-[#f8e5a1] text-black px-4 h-8 rounded-full transform transition duration-300 hover:scale-110" />
                                <Button text="Pay Now" onClick={() => navigate(`/users/payFast`)} className="bg-[#f8e5a1] text-black px-4 h-8 rounded-full transform transition duration-300 hover:scale-110" />
                                <Button text="LOGOUT" onClick={handleLogout} className="bg-[#DBC166] text-black px-4 h-8 rounded-full transform transition duration-300 hover:scale-110" />

                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavbarComponent;
