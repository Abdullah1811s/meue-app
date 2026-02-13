/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUserPaid } from "@/store/authSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const NavbarComponent = () => {
    const id = localStorage.getItem("id");
    const [mobileDrop, setMobileDrop] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const [openDrop, setOpenDrop] = useState(false);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const isAuthenticated = useSelector((state: any) => state.auth.isUserAuthenticated);
    const isVendorAuthenticated = useSelector((state: any) => state.auth.isVendorAuthenticated);

    // Refs for click outside detection
    const navRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    // Handle clicks outside the mobile menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen &&
                navRef.current &&
                menuButtonRef.current &&
                !navRef.current.contains(event.target as Node) &&
                !menuButtonRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleHomeClick = () => {
        if (isAuthenticated) {
            const id = localStorage.getItem("id");
            navigate(`/users/${id}`);
        } else if (isVendorAuthenticated) {
            const id = localStorage.getItem("id");
            navigate(`/vendor/${id}`);
        } else {
            navigate('/');
        }
    };

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Payment handlers
    const handleClickPayNowR10 = async () => {
        try {
            const UserToken = localStorage.getItem('UserToken');
            const response = await axios.post(
                `${API_BASE_URL}/payment/checkout`,
                {
                    amount: 1000,
                    currency: "ZAR",
                    id
                },
                {
                    headers: {
                        Authorization: `Bearer ${UserToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            window.location.href = response.data.redirectUrl;
        } catch (error: any) {
            console.log("Payment error", error);
        }
    };

    const handleClickPayNowR50 = async () => {
        try {
            const UserToken = localStorage.getItem('UserToken');
            const response = await axios.post(
                `${API_BASE_URL}/payment/checkout`,
                {
                    amount: 5000,
                    currency: "ZAR",
                    id
                },
                {
                    headers: {
                        Authorization: `Bearer ${UserToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            window.location.href = response.data.redirectUrl;
        } catch (error: any) {
            console.log("Payment error", error);
        }
    };

    const handlePeachPayR10 = async () => {
        try {
            const UserToken = localStorage.getItem('UserToken');
            const response = await axios.post(
                `${API_BASE_URL}/payment/checkout/peach`,
                {
                    amount: 10,
                    id
                },
                {
                    headers: {
                        Authorization: `Bearer ${UserToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            window.location.href = response.data.redirectUrl;
        } catch (error: any) {
            console.log("Payment error", error);
        }
    }

    const handlePeachPayR50 = async () => {
        try {
            const UserToken = localStorage.getItem('UserToken');
            const response = await axios.post(
                `${API_BASE_URL}/payment/checkout/peach`,
                {
                    amount: 50,
                    id
                },
                {
                    headers: {
                        Authorization: `Bearer ${UserToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            window.location.href = response.data.redirectUrl;
        } catch (error: any) {
            console.log("Payment error", error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("UserToken");
        localStorage.removeItem("id");
        dispatch(logout());
        navigate('/');
    };

    const handleClick = (route: string) => {
        navigate(route);
        setIsOpen(false);
    };

    useEffect(() => {
        const fetchUserPaymentStatus = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/users/${id}`);
                if (response.data.success) {
                    const isPaidStatus = response.data.user.isPaid;
                    setIsPaid(isPaidStatus);
                    dispatch(setUserPaid(isPaidStatus));
                }
            } catch (error: any) {
                console.error("Error fetching user:", error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUserPaymentStatus();
    }, [id, API_BASE_URL, dispatch]);

    return (
        <div ref={navRef} className="relative">
            <nav className="bg-black sticky text-white flex items-center justify-between rounded-full w-[95%] lg:w-[90%] h-16 md:h-18 lg:h-20 mt-4 sm:mt-6 md:mt-8 px-4 sm:px-6 py-3 mx-auto mb-6 z-50">
                <div className="flex items-center">
                    <img
                        onClick={handleHomeClick}
                        src="/Logo.avif"
                        alt="Logo"
                        className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 cursor-pointer"
                    />
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center">
                    <ul className="flex items-center space-x-6 xl:space-x-8 text-base xl:text-lg mr-6">
                        <li>
                            <Button onClick={handleHomeClick} className={`${(location.pathname === "/" || window.location.pathname.startsWith('/users/')) ? "text-[#DBC166] font-bold" : "text-white"} cursor-pointer transition duration-300 border-0 bg-transparent hover:text-[#DBC166] hover:bg-transparent text-md`}>
                                Home
                            </Button>
                        </li>

                        <li>
                            <Link
                                to="/aboutUs"
                                className={`hover:text-[#DBC166] ${location.pathname === "/aboutUs" ? "text-[#DBC166] font-bold" : "text-white"} transition-colors duration-300`}
                            >
                                About Us
                            </Link>
                        </li>

                        <li>
                            <Link to="/affiliated/register" className={`hover:text-[#DBC166] ${location.pathname === "/affiliated/register" ? "text-[#DBC166] font-bold" : "text-white"} transition-colors duration-300`}>
                                Affiliate Registration
                            </Link>
                        </li>

                        <li className="relative">
                            <DropdownMenu open={openDrop} onOpenChange={setOpenDrop}>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className={`hover:text-[#DBC166] ${location.pathname.includes("/partner") ? "text-[#DBC166] font-bold" : "text-white"} transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-0`}
                                        onMouseEnter={() => setOpenDrop(true)}
                                        onMouseLeave={() => setOpenDrop(false)}
                                    >
                                        Partner
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-48 mt-2 bg-[#DBC166]"
                                    onMouseEnter={() => setOpenDrop(true)}
                                    onMouseLeave={() => setOpenDrop(false)}
                                >
                                    <DropdownMenuItem>
                                        <Link to='/allPartners' className="w-full block">All Partners</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        {isVendorAuthenticated ? (
                                            <Link to={`/vendor/${id}/dashboard`} className="w-full block">
                                                My Dashboard
                                            </Link>
                                        ) : (
                                            <Link to="/vendorOnBoarding" className="w-full block">
                                                Partner Registration
                                            </Link>
                                        )}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                        <Button
                            onClick={() => navigate(`/promotions`)}
                            className="
    text-white px-5 py-2 border border-[#DBC166] rounded-full 
    transition-all duration-300 ease-in-out 
    hover:bg-[#DBC166] hover:text-black 
    hover:shadow-md hover:scale-105
    active:scale-95
  "
                        >
                            Promotions
                        </Button>
                    </ul>

                    <div className="flex items-center space-x-3">
                        {!isAuthenticated ? (
                            <>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => handleClick("Login")}
                                        className="w-full sm:w-auto bg-[#DBC166] text-black px-5 py-2 text-sm lg:text-base rounded-full font-bold transition transform hover:scale-105 active:scale-95 hover:bg-[#C8A13A]"
                                    >
                                        LOGIN
                                    </button>
                                    <button
                                        onClick={() => handleClick("Signup")}
                                        className="w-full sm:w-auto bg-[#DBC166] text-black px-5 py-2 text-sm lg:text-base rounded-full font-bold transition transform hover:scale-105 active:scale-95 hover:bg-[#C8A13A]"
                                    >
                                        SIGN UP
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => navigate(`/users/${id}/dashboard`)}
                                    className="
    text-white px-5 py-2 border border-[#DBC166] rounded-full 
    transition-all duration-300 ease-in-out 
    hover:bg-[#DBC166] hover:text-black 
    hover:shadow-md hover:scale-105
    active:scale-95
  "
                                >
                                    Dashboard
                                </Button>

                                {!isPaid && !loading && (
                                    <Button
                                        onClick={() => setPaymentDialogOpen(true)}
                                        className="text-white px-5 py-2 border border-[#DBC166] rounded-full transition hover:bg-[#DBC166] hover:text-black"
                                    >
                                        Pay Now
                                    </Button>
                                )}
                                <Button
                                    onClick={() => navigate(`/users/${id}/promotions`)}
                                    className="
    text-white px-5 py-2 border border-[#DBC166] rounded-full 
    transition-all duration-300 ease-in-out 
    hover:bg-[#DBC166] hover:text-black 
    hover:shadow-md hover:scale-105
    active:scale-95
  "
                                >
                                    Promotions
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    className="
    bg-[#DBC166] text-black px-5 py-2 text-sm lg:text-base rounded-full 
    font-medium transition-all duration-300 ease-in-out 
    hover:bg-[#C8A13A] hover:shadow-md hover:scale-105 
    active:scale-95 
    focus:ring-2 focus:ring-[#DBC166] focus:ring-opacity-50
  "
                                >
                                    LOGOUT
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    ref={menuButtonRef}
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden text-white transition transform duration-300 hover:scale-110"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="lg:hidden absolute top-full left-1/2 transform -translate-x-1/2 w-[70%] sm:w-[50%] mx-auto mt-2 bg-black rounded-lg text-white flex flex-col items-center py-3 space-y-2 shadow-lg overflow-hidden z-50">
                    <ul className="flex flex-col items-center gap-3 text-sm w-full max-h-[60vh] overflow-y-auto px-4">
                        <li className="w-full text-center">
                            <Link
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className={`font-semibold ${/^\/users\/[a-zA-Z0-9]+$/.test(location.pathname) || location.pathname === "/" ? "text-[#DBC166]" : "text-white"} block py-2 transition duration-300 hover:text-[#DBC166]`}
                            >
                                Home
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/aboutUs"
                                className={`hover:text-[#DBC166] ${location.pathname === "/aboutUs" ? "text-[#DBC166] font-bold" : "text-white"} transition-colors duration-300`}
                            >
                                About Us
                            </Link>
                        </li>
                        <li className="w-full text-center relative">
                            <button
                                onClick={() => setMobileDrop(!mobileDrop)}
                                className="w-full py-2 text-white transition duration-300 hover:text-[#DBC166] flex items-center justify-center"
                            >
                                Partner {mobileDrop ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                            </button>
                            {mobileDrop && (
                                <div className="w-full bg-[#DBC166] rounded-md shadow-md mt-1">
                                    <Link
                                        to="/allPartners"
                                        className="block px-4 py-2 text-black hover:bg-[#C8A13A] text-center"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        All Partners
                                    </Link>
                                    {isVendorAuthenticated ? (
                                        <Link
                                            to={`/vendor/${id}/dashboard`}
                                            onClick={() => setIsOpen(false)}
                                            className="w-full block px-4 py-2 text-black hover:bg-[#C8A13A] text-center"
                                        >
                                            My Dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/vendorOnBoarding"
                                            onClick={() => setIsOpen(false)}
                                            className="w-full block px-4 py-2 text-black hover:bg-[#C8A13A] text-center"
                                        >
                                            Partner Registration
                                        </Link>
                                    )}
                                </div>
                            )}
                        </li>
                        <li className="w-full text-center">
                            <Link
                                to="/affiliated/register"
                                onClick={() => setIsOpen(false)}
                                className={`block py-2 ${location.pathname === "/affiliated/register" ? "text-[#DBC166]" : "text-white"} transition duration-300 hover:text-[#DBC166]`}
                            >
                                Affiliate Registration
                            </Link>
                        </li>
                        <Button
                            onClick={() => {
                                navigate(`/promotions`);
                                setIsOpen(false);
                            }}
                            className="
    text-white px-5 py-2 border border-[#DBC166] rounded-full 
    transition-all duration-300 ease-in-out 
    hover:bg-[#DBC166] hover:text-black 
    hover:shadow-md hover:scale-105
    active:scale-95
  "
                        >
                            Promotions
                        </Button>
                    </ul>

                    <div className="flex flex-col gap-2 w-full px-4">
                        {!isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => { navigate("Login"); setIsOpen(false); }}
                                    className="bg-[#DBC166] text-black py-2 text-sm font-bold rounded-md transition hover:bg-[#C8A13A]"
                                >
                                    LOGIN
                                </button>
                                <button
                                    onClick={() => { navigate("Signup"); setIsOpen(false); }}
                                    className="bg-[#DBC166] text-black py-2 text-sm font-bold rounded-md transition hover:bg-[#C8A13A]"
                                >
                                    SIGN UP
                                </button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => navigate(`/users/${id}/dashboard`)}
                                    className="
    text-white px-5 py-2 border border-[#DBC166] rounded-full 
    transition-all duration-300 ease-in-out 
    hover:bg-[#DBC166] hover:text-black 
    hover:shadow-md hover:scale-105
    active:scale-95
  "
                                >
                                    Dashboard
                                </Button>
                                {!isPaid && !loading && (
                                    <Button
                                        onClick={() => setPaymentDialogOpen(true)}
                                        className="text-white px-5 py-2 border border-[#DBC166] rounded-full transition hover:bg-[#DBC166] hover:text-black"
                                    >
                                        Pay Now
                                    </Button>
                                )}
                                <Button
                                    onClick={() => {
                                        navigate(`/users/${id}/promotions`);
                                        setIsOpen(false);
                                    }}
                                    className="
    text-white px-5 py-2 border border-[#DBC166] rounded-full 
    transition-all duration-300 ease-in-out 
    hover:bg-[#DBC166] hover:text-black 
    hover:shadow-md hover:scale-105
    active:scale-95
  "
                                >
                                    Promotions
                                </Button>
                                <Button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="
    bg-[#DBC166] text-black px-5 py-2 text-sm lg:text-base rounded-full 
    font-medium transition-all duration-300 ease-in-out 
    hover:bg-[#C8A13A] hover:shadow-md hover:scale-105 
    active:scale-95 
    focus:ring-2 focus:ring-[#DBC166] focus:ring-opacity-50"
                                >
                                    LOGOUT
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Payment Dialog */}
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-black text-white border border-[#DBC166]">
                    <DialogHeader>
                        <DialogTitle className="text-[#DBC166] text-2xl">Choose Payment Method</DialogTitle>
                        <DialogDescription className="text-white">
                            Select your preferred payment option
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="border border-[#DBC166] rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-[#DBC166] mb-2">Pay with Yoco</h3>
                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={handleClickPayNowR10}
                                    className="bg-[#DBC166] text-black hover:bg-[#C8A13A]"
                                >
                                    Pay R10 with Yoco
                                </Button>
                                <Button
                                    onClick={handleClickPayNowR50}
                                    className="bg-[#DBC166] text-black hover:bg-[#C8A13A]"
                                >
                                    Pay R50 with Yoco
                                </Button>
                            </div>
                        </div>

                        <div className="border border-[#DBC166] rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-[#DBC166] mb-2">Pay with Peach Payments</h3>
                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={handlePeachPayR10}
                                    className="bg-[#DBC166] text-black hover:bg-[#C8A13A]"
                                >
                                    Pay R10 with Peach
                                </Button>
                                <Button
                                    onClick={handlePeachPayR50}
                                    className="bg-[#DBC166] text-black hover:bg-[#C8A13A]"
                                >
                                    Pay R50 with Peach
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NavbarComponent;