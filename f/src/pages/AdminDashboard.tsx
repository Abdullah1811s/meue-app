import { useState } from 'react';
import { motion } from 'framer-motion';
import { io } from "socket.io-client";
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Users,
  Menu,
  X,
  LogOut,
  PackageCheck,
  UserPlus,
  Calendar,
  Plus,
  Trophy, Trash2,
  Box,
  User,
  Tag,
  ShipWheelIcon,
  Check,
  Award,
  Loader

} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CustomDatePicker from '@/components/customComponents/Datepicker';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Clipboard } from 'lucide-react';


export interface IVendor {
  wheelOffer: any;
  raffleOffer: any;
  _id: string;
  businessName: string;
  businessType: string;
  companyRegNumber: string;
  vatNumber?: string;
  tradingAddress: string;
  province?: string;
  city?: string;
  status: "pending" | "approved" | "rejected";
  businessContactNumber: string;
  businessEmail: string;
  websiteUrl?: string;
  socialMediaHandles?: Record<string, string>;
  representativeName: string;
  representativePosition: string;
  representativeEmail: string;
  representativePhone: string;
  businessDescription?: string;
  offerings?: string[];
  exclusiveOffer: {
    offerings: {
      name: string;
      quantity?: number;
      endDate?: string;
      showQuantity?: boolean;
    }[];
    type: string;
    terms: string;
  };
  password: string;
  vendorTier: "bronze" | "silver" | "gold";
  agreedToTerms: boolean;
  companyRegistrationCertificateURl: {
    public_id: string;
    secure_url: string;
  };
  vendorIdURl?: {
    public_id: string;
    secure_url: string;
  };
  addressProofURl?: {
    public_id: string;
    secure_url: string;
  };
  confirmationLetterURl?: {
    public_id: string;
    secure_url: string;
  };
  businessPromotionalMaterialURl?: {
    public_id?: string;
    secure_url?: string;
  };
}

interface Affiliated {
  _id: string;
  fullName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  type: "individual" | "business";
  businessName?: string | null;
  companyRegistrationNumber?: string | null;
  vatNumber?: string | null;
  tradingAddress?: string | null;
  provinceCity?: string | null;
  businessContactNumber?: string | null;
  businessEmailAddress?: string | null;
  password: string;
  status: "pending" | "approved" | "rejected";
  promotionChannels?: ("Social Media" | "Email Marketing" | "Influencer Partnerships" | "Offline Events" | "Other")[];
  socialMediaPlatforms?: string[];
  otherPromotionMethod?: string | null;
  targetAudience?: string | null;
}

interface NewAdmin {
  username: string;
  email: string;
  password: string;
}

interface RaffleItem {
  endDate: any;
  quantity: any;
  isVisible: any;
  name: string;
  _id: string;
  prizes: any;
  participants: {
    entries: number;
    user: any;
    email: string;
    phone: string;
    city: string;
    province: string;
    street: string;
    town: string;
    postalCode: string;
  }[];
  winner: Array<{
    user: any;
    city: string;
    postalCode: string;
    province: string;
    town: string;
    street: string;
    name: string;
    email: string;
    phone: string;
  }> | null; // If no winners are selected yet

  scheduledAt: string;
  status: "completed" | "scheduled";
}

interface Prize {
  name: string;
  quantity: string;
  endDate: Date | null;
}

interface RaffFormData {
  name: string;
  scheduledAt: string;
  prizes: Prize[];
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone: string;

  role?: "user" | "admin";
  TotalPoints?: number;
  DailyLoginPoint?: number;
  wheelRotatePoint?: number;
  signupPoint?: number;
  ReferralPoint?: number;
  dailyLoginDate?: string;
  city: string;
  province: string;
  street: string;
  signupDate?: string;
  town: string;
  userType?: "R50" | "R10";
  R10UserPaidDate?: string;
  postalCode: string;
  isPaid?: boolean;
  prizeWon?: string;
  referralCodeShare?: string;
  numberOfTimesWheelRotate?: number;
}


const socket = io(import.meta.env.VITE_BACKEND_URL_SOCKET);

const AdminDashboard = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const adminToken = localStorage.getItem("AdminToken");
  const [affiliates, setAffiliates] = useState<Affiliated[]>([]);
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [raff, setRaff] = useState<RaffleItem[]>([])
  const [users, setUsers] = useState<IUser[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [isManageAffiliate, setManageAffiliate] = useState(false);
  const [isManageWheel, setManageWheel] = useState(false);
  const [isManagePartner, setManagePartner] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isManageWeeklyReferral, setManageWeeklyReferral] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isManageUser, setManageUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  // const [onRaff, setOnRaff] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isCreateAdminModalOpen, setCreateAdminModalOpen] = useState(false);
  const [hasSelectedOption, setHasSelectedOption] = useState(false)
  const [selectedTier, setSelectedTier] = useState();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<any>("");
  const [maxOfferDate, setMaxOfferDate] = useState<any>(null);
  const [vendorOnWheel, setVendorOnWheel] = useState<any[]>([]);
  const [isDeletingUser, setDeleteing] = useState(false);
  const [isRaffLoading, setIsRaffLoading] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [offer, setOffer] = useState({
    name: "",
    quantity: "",
    endDate: "",
  });
  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    username: '',
    email: '',
    password: ''
  });

  const [formData, setFormData] = useState<RaffFormData>({
    name: "",
    scheduledAt: "",
    prizes: [{
      name: "",
      quantity: "",
      endDate: null
    }]
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePrizeChange = (index: number, field: keyof Prize, value: any): void => {
    const updatedPrizes = [...formData.prizes];
    updatedPrizes[index] = {
      ...updatedPrizes[index],
      [field]: value
    };
    setFormData({
      ...formData,
      prizes: updatedPrizes
    });
  };
  const addPrizeField = (): void => {
    setFormData({
      ...formData,
      prizes: [...formData.prizes, {
        name: "",
        quantity: "",
        endDate: null
      }]
    });
  };

  const removePrizeField = (index: number): void => {
    const updatedPrizes = formData.prizes.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      prizes: updatedPrizes
    });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("the form data is", formData)
    if (isSubmitting) return;
    try {
      e.preventDefault();
      setIsSubmitting(true);

      // Format the main raffle date
      const formattedDate = selectedDate
        ? new Date(selectedDate).toISOString()
        : '';

      // Prepare prizes data - ensure required fields are present
      const preparedPrizes = formData.prizes.map(prize => ({
        name: prize.name,
        quantity: prize.quantity || "1", // Default quantity if not provided
        endDate: prize.endDate ? new Date(prize.endDate).toISOString() : null
      }));

      const submissionData = {
        name: formData.name,
        scheduledAt: formattedDate,
        prizes: preparedPrizes,
        status: "scheduled", // Default status
        isVisible: false // Default visibility
      };

      const response = await axios.post(`${API_BASE_URL}/Raff/createRaff`, submissionData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      setRaff((prev) => [...prev, response.data.raffle]);
      toast.success(response.data.message);

      // Reset form to initial state
      setFormData({
        name: "",
        scheduledAt: "",
        prizes: [{
          name: "",

          quantity: "",
          endDate: null
        }]
      });
      setSelectedDate(null);
      setOpenDialog(false);
    }
    catch (error: any) {
      console.error("Error creating raff:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create raff";
      toast.error(errorMessage);
    }
    finally {
      setIsSubmitting(false);
    }
  };



  const handleLogout = () => {
    localStorage.removeItem("AdminToken");
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const fetchAffiliate = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/affiliated`);
      setAffiliates(res.data.data);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch affiliates');
      setIsLoading(false);
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const fetchVendor = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendor/allDetails`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      setVendors(response.data);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchRaff = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/Raff`);
      console.log(res.data.raff);
      setRaff(res.data.raff);

      setIsLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch affiliates');
      setIsLoading(false);
      toast.error(error.message);
      console.log(error.message);
    }
  }

  const handleDelVendor = async () => {
    setOpen(true);

  };

  const confirmDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      // Delete the vendor
      const response = await axios.delete(`${API_BASE_URL}/vendor/del`, {
        data: { id, cancelReason: confirmText },
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      // Remove the vendor from the wheel (if they are on the wheel)
      const response2 = await axios.delete(`${API_BASE_URL}/wheel/remove`, {
        data: { vendorInfo: id },
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      console.log("Response from wheel removal:", response2);
      setVendors((prevVendors) => prevVendors.filter((vendor) => vendor._id !== id));
      toast.success(response.data.message);
    } catch (error: any) {
      console.error("Error deleting vendor:", error.response?.data || error.message);
      toast.error("Error deleting partner");
    } finally {
      setOpen(false);
      setIsDeleting(false);
      setConfirmText("");
    }
  };

  async function handleDeleteRaff(refId: string) {
    setLoading(refId);
    try {
      await axios.delete(`${API_BASE_URL}/Raff/delRaff`, {
        data: { refId },
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });
      setRaff((prev) => prev.filter((item) => item._id !== refId));

      toast.success("Raffle deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete raffle. Try again!");
    } finally {
      setLoading(null); // Reset loading state
    }
  }

  const updateVisibility = async (refId: string) => {
    setLoading(refId);

    // Optimistically update UI state
    setRaff((prevRaffles) =>
      prevRaffles.map((raffle) =>
        raffle._id === refId ? { ...raffle, isVisible: !raffle.isVisible } : raffle
      )
    );

    try {
      const response = await axios.put(`${API_BASE_URL}/Raff/changeVisibility`, { refId });

      toast.success("Raffle visibility updated!");

      // Emit visibility change event
      socket.emit("visibilityChanged", { refId, isVisible: true });

      // Fetch updated raffle data (assuming response contains updated raffle info)
      const updatedRaffle = response.data;

      // Check if quantity is still available, if yes, make it invisible
      if (updatedRaffle.quantity > 0) {
        setTimeout(() => {
          setRaff((prevRaffles) =>
            prevRaffles.map((raffle) =>
              raffle._id === refId ? { ...raffle, isVisible: false } : raffle
            )
          );
          toast.error("Raffle hidden because quantity is still available.");
        }, 500); // Small delay for UI smoothness
      }
    } catch (error) {
      // Revert state on failure
      setRaff((prevRaffles) =>
        prevRaffles.map((raffle) =>
          raffle._id === refId ? { ...raffle, isVisible: !raffle.isVisible } : raffle
        )
      );

      toast.error("Failed to update raffle visibility!");
      console.error("Error updating visibility:", error);
    } finally {
      setLoading(null);
    }
  };


  const delAffiliate = async (affId: string) => {
    try {

      const res = await axios.delete(`${API_BASE_URL}/affiliated/removeAffiliate`, {
        data: { affId },
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      setAffiliates((prev) => prev.filter((item) => item._id !== affId));
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to delete =. Try again!");
    }
  }

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/`);
      console.log(res.data);
      setUsers(res.data.users);
    } catch (error) {
      toast.error("Failed to fetch user  =. Try again!");
    }
  }

  const switchTab = (tab: 'affiliate' | 'partner' | 'weeklyReferral' | 'wheelManage' | 'manageUser') => {
    if (tab === 'affiliate') {
      setManageUser(false);
      setManageAffiliate(true);
      setManagePartner(false);
      setManageWeeklyReferral(false);
      setHasSelectedOption(true);
      setManageWheel(false);
      setSidebarOpen(false);
      fetchAffiliate();
    } else if (tab === 'partner') {
      setManageUser(false);
      setManageAffiliate(false);
      setManagePartner(true);
      setManageWeeklyReferral(false);
      setHasSelectedOption(true);
      setSidebarOpen(false);
      setManageWheel(false);
      fetchVendor();
    } else if (tab == 'weeklyReferral') {
      setManageUser(false);
      setManageAffiliate(false);
      setManagePartner(false);
      setManageWeeklyReferral(true);
      setHasSelectedOption(true);
      setSidebarOpen(false);
      setManageWheel(false);
      fetchRaff();
    }
    else if (tab == 'manageUser') {
      setManageUser(true);
      setManageAffiliate(false);
      setManagePartner(false);
      setManageWeeklyReferral(false);
      setHasSelectedOption(true);
      setSidebarOpen(false);
      setManageWheel(false);
      fetchUser();
    }
    else {
      setManageUser(false);
      setManageAffiliate(false);
      setManagePartner(false);
      setManageWeeklyReferral(false);
      setManageWheel(true);
      setHasSelectedOption(true);
      setSidebarOpen(false);
      fetchVendorOnWheel();

    }
  };

  const updateAffiliate = async (id: string, status: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: true })); // Start loading for this affiliate
    try {
      const payload = { id, status };
      const response = await axios.put(
        `${API_BASE_URL}/affiliated/updateStatus`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      // Ensure we maintain the full structure of the Affiliate object
      setAffiliates(prevAffiliates =>
        prevAffiliates.map((affiliate): Affiliated => {
          if (affiliate._id === id) {
            return { ...affiliate, status: status as "pending" | "approved" | "rejected" };
          }
          return affiliate;
        })
      );

      console.log(response)
      toast.success("Status updated successfully");
    } catch (error: any) {
      console.error("Error updating affiliate status:", error.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false })); // Stop loading
    }
  };

  const updatePartnerStatus = async (id: string, status: "pending" | "approved" | "rejected") => {
    setIsApproving(true);
    setLoadingStates(prev => ({ ...prev, [id]: true }));

    try {
      const payload = { id, status };
      const res = await axios.put(
        `${API_BASE_URL}/vendor/updateStatus`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log(res);
      toast.success("Partner status updated successfully");
      setVendors(prevPartners =>
        prevPartners.map((partner): IVendor => {
          if (partner._id === id) {
            return { ...partner, status };
          }
          return partner;
        })
      );
      try {

        const response = await axios.post(
          `${API_BASE_URL}/wheel/add`,
          {
            vendorInfo: res.data.vendor._id,
            offerings: res.data.vendor.wheelOffer.offerings
          },
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "Content-Type": "application/json"
            }
          }
        );

        console.log("Successfully added wheel offers:", response.data);
      } catch (error: any) {
        console.error("Failed to add wheel offers:", error);
        toast.error(`No offer available from the partner to add to the wheel. Please check and try again.`, { duration: 5000 });
        throw error;
      }



    } catch (error: any) {
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false })); // Stop loading
    }
    setIsApproving(false);
  };

  const updateTier = async (id: string, vendorTier: any) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/vendor/updateTier`,
        { id, vendorTier },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      toast.success(res.data.message);
    }
    catch (error: any) {
      console.error("Error updating partner tier:", error.message);
      toast.error("Failed to update tier");
    }
  }

  const handleShowOnRaff = async (exclusiveOffer: string, offering: any, vendorId: string) => {
    try {

      if (!offering) {
        console.log("No offerings available");
        toast.error("No offerings available");
        return;
      }

      const offeringDates = offering.endDate;

      if (offeringDates) {
        setMaxOfferDate(new Date(offeringDates));

        setIsOpen(true);
      } else {
        const quantity = offering.quantity;
        if (quantity && quantity > 0) {
          const prize = offering
            ? [{ name: offering.name, id: offering._id, quantity: quantity }]
            : [];


          await axios.post(
            `${API_BASE_URL}/Raff/createRaff`,
            {
              name: exclusiveOffer,
              scheduleAt: scheduleDate,
              prizes: prize,
              vendorId,
            },
            {
              headers: {
                Authorization: `Bearer ${adminToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          toast.success("Added to Raffle system");

        } else {
          toast.error("Invalid quantity");
        }
      }
    } catch (error: any) {
      console.error("Full error:", error);

      if (error.response) {
        const errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          "Failed to add to raffle system";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error("Network error - please check your connection");
      } else {
        toast.error("An unexpected error occurred");
      }

    }
  };

  const handleConfirmSchedule = async (exclusiveOffer: string, offering: any, vendorId: string,) => {

    setIsRaffLoading(true);
    if (!scheduleDate) return;

    if (new Date(scheduleDate) > maxOfferDate) {
      toast.error("Schedule date cannot be after the exclusive offer date.");
    } else {
      const newDate = new Date(maxOfferDate)
      const prize = offering
        ? [{ name: offering.name, id: offering._id, endDate: newDate, quantity: offering.quantity }]
        : [];

      await axios.post(`${API_BASE_URL}/Raff/createRaff`, {
        name: exclusiveOffer,
        scheduleAt: scheduleDate,
        prizes: prize,
        vendorId
      }, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success("Added on Raffle system")
      setIsRaffLoading(false);
    }

    setIsOpen(false);
  };


  const handleClickAffiliate = () => {
    switchTab('affiliate');
  };

  const fetchVendorOnWheel = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/wheel`);
      console.log(res.data.data);
      setVendorOnWheel(res.data.data);


    } catch (error: any) {
      console.error("Error removing vendor:", error);

    }
  }

  const handleDeleteOffering = async (offerId: string) => {
    try {

      const res = await axios.delete(`${API_BASE_URL}/wheel/offers/${offerId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      console.log("Offer deleted successfully:", res.data);
      if (res.status === 200) {
        console.log("Offer deleted successfully:", res.data);
        toast.success("offer deleted");
      } else {
        console.error("Failed to delete offer:", res.data);
        throw new Error("Failed to delete offer");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);

    }
    // Reload the current page
    window.location.reload();
  }

  const sidebarVariants = {
    open: { x: 0, transition: { duration: 0.3 } },
    closed: { x: "-100%", transition: { duration: 0.3 } }
  };

  const contentVariants = {
    sidebarOpen: { marginLeft: "250px", transition: { duration: 0.3 } },
    sidebarClosed: { marginLeft: "0px", transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };




  const deleteUser = async (id: string) => {
    try {
      setDeleteing(true);
      await axios.delete(
        `${API_BASE_URL}/users/del-user`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          data: { id },
        }
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      toast.success("User deleted successfully!");

    } catch (error) {
      console.error("Delete User Error:", error);
      toast.error("Failed to delete user. Try again!");
    } finally {
      setDeleteing(false);
    }
  };


  const handleSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!offer.name) {
        throw new Error("Offer name is required");
      }

      // Validate date if provided
      if (offer.endDate && new Date(offer.endDate) < new Date()) {
        throw new Error("End date cannot be in the past");
      }

      // Prepare the request data using ACTUAL form values
      const offerData = {
        vendor: {
          vendorInfo: null, // or your vendor ID if available
          offerings: [{
            name: offer.name, // Use state value
            quantity: offer.quantity ? parseInt(offer.quantity) : undefined,
            endDate: offer.endDate || undefined
          }]
        }
      };

      console.log("Submitting offer:", offerData);

      // Send to backend
      const response = await axios.post(`${API_BASE_URL}/wheel/addAdmin`, offerData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      // Handle successful response
      if (response.status === 200 || response.status === 201) {
        console.log("Offer created successfully:", response.data);
        toast.success("Offer has been added on wheel")
      } else {
        throw new Error(response.data.message || "Failed to create offer");
      }

      // Reset form and close dialog
      setOpen(false);
      setOffer({ name: "", quantity: "", endDate: "" });

    } catch (error) {
      console.error("Error submitting offer:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create offer");

      if (axios.isAxiosError(error)) {
        console.error("Backend error:", error.response?.data);
      }
    }
  };




  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOffer(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Sidebar - uses fixed positioning on larger screens, sliding drawer on mobile */}
      <motion.div
        className="fixed h-full w-64 bg-white shadow-lg z-20 md:z-10 top-0 left-0 overflow-y-auto"
        variants={sidebarVariants}
        initial="open"
        animate={isSidebarOpen ? "open" : "closed"}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <div
            className={`px-4 py-3 flex items-center cursor-pointer ${isManageAffiliate ? 'bg-[#DBC166] text-white' : 'hover:bg-gray-100'}`}
            onClick={handleClickAffiliate}
          >
            <Users size={20} className="mr-3 flex-shrink-0" />
            <span className="truncate">Manage Affiliates</span>
          </div>

          <div
            className={`px-4 py-3 flex items-center cursor-pointer ${isManagePartner ? 'bg-[#DBC166] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => switchTab('partner')}
          >
            <PackageCheck size={20} className="mr-3 flex-shrink-0" />
            <span className="truncate">Manage Partners</span>
          </div>
          <div
            className={`px-4 py-3 flex items-center cursor-pointer ${isManageUser ? 'bg-[#DBC166] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => switchTab('manageUser')}
          >
            <User size={20} className="mr-3 flex-shrink-0" />
            <span className="truncate">Manage User</span>
          </div>
          <div
            className={`px-4 py-3 flex items-center cursor-pointer ${isManageWeeklyReferral ? 'bg-[#DBC166] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => switchTab('weeklyReferral')}
          >
            <Calendar size={20} className="mr-3 flex-shrink-0" />
            <span className="truncate">Manage Raff</span>
          </div>

          <div
            className={`px-4 py-3 flex items-center cursor-pointer ${isManageWheel ? 'bg-[#DBC166] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => switchTab('wheelManage')}
          >
            <ShipWheelIcon size={20} className="mr-3 flex-shrink-0" />
            <span className="truncate">Manage Wheel</span>
          </div>
         
        </nav>
      </motion.div>

      {/* Overlay for mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <motion.div
        className="flex-1 bg-gray-50 w-full overflow-x-hidden"
        variants={contentVariants}
        initial="sidebarOpen"
        animate={isSidebarOpen ? "sidebarOpen" : "sidebarClosed"}
      >
        {/* Navbar */}
        <div className="bg-white h-16 shadow-sm flex items-center justify-between px-2 sm:px-4 sticky top-0 z-10">
          <button className="p-2 rounded-full hover:bg-gray-100" onClick={toggleSidebar} aria-label="Toggle sidebar">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              className="px-2 py-1 md:px-4 md:py-2 bg-[#DBC166] text-white rounded-md flex items-center text-xs md:text-base transition-colors hover:bg-[#c9a94c]"
              onClick={() => setCreateAdminModalOpen(true)}
            >
              <UserPlus size={16} className="mr-1 md:mr-2 flex-shrink-0" />
              <span className="hidden xs:inline">Create Admin</span>
            </button>
            <button
              className="px-2 py-1 md:px-4 md:py-2 bg-red-500 text-white rounded-md flex items-center text-xs md:text-base transition-colors hover:bg-red-600"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-1 md:mr-2 flex-shrink-0" />
              <span className="hidden xs:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-3 md:p-6 overflow-y-auto max-w-full">
          {!hasSelectedOption && (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-600">Please select an option to manage.</p>
            </div>
          )}

          {isManageAffiliate && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6">Manage Affiliates</h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DBC166]"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {affiliates.map(affiliate => (
                    <div key={affiliate._id} className="bg-white rounded-lg shadow p-4 md:p-6 text-sm md:text-base flex flex-col">
                      <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 break-words">{affiliate.fullName} {affiliate.surname}</h3>
                      <p className="text-gray-600 mb-2 break-words"><strong>Email:</strong> {affiliate.email}</p>
                      <p className="text-gray-600 mb-2"><strong>Phone:</strong> {affiliate.phoneNumber}</p>
                      <p className="text-gray-600 mb-2">
                        <strong>Type:</strong>
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${affiliate.type === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {affiliate.type}
                        </span>
                      </p>
                      {affiliate.type === 'business' && (
                        <div className="mt-2">
                          <p className="text-gray-600 mb-2 break-words"><strong>Business Name:</strong> {affiliate.businessName}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>Reg Number:</strong> {affiliate.companyRegistrationNumber}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>VAT Number:</strong> {affiliate.vatNumber}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>Address:</strong> {affiliate.tradingAddress}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>City:</strong> {affiliate.provinceCity}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>Business Phone:</strong> {affiliate.businessContactNumber}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>Business Email:</strong> {affiliate.businessEmailAddress}</p>
                        </div>
                      )}
                      <p className="text-gray-600 mb-2 break-words"><strong>Promotion:</strong> {affiliate.promotionChannels?.join(', ')}</p>
                      <p className="text-gray-600 mb-2 break-words"><strong>Social Media:</strong> {affiliate.socialMediaPlatforms?.join(', ')}</p>
                      <p className="text-gray-600 mb-2 break-words"><strong>Other Promotion:</strong> {affiliate.otherPromotionMethod}</p>
                      <p className="text-gray-600 mb-2 break-words"><strong>Target Audience:</strong> {affiliate.targetAudience}</p>

                      {/* Action Buttons */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {affiliate.status === "approved" ? (
                          <span className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md text-sm">Approved</span>
                        ) : (
                          <Button
                            onClick={() => updateAffiliate(affiliate._id, "approved")}
                            className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105 text-sm ${loadingStates[affiliate._id] ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            disabled={loadingStates[affiliate._id]}
                          >
                            {loadingStates[affiliate._id] ? "Approving..." : "Approve"}
                          </Button>
                        )}

                        {affiliate.status !== "approved" && (
                          <Button
                            onClick={() => updateAffiliate(affiliate._id, "rejected")}
                            className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105 text-sm ${loadingStates[affiliate._id] ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            disabled={loadingStates[affiliate._id]}
                          >
                            {loadingStates[affiliate._id] ? "Rejecting..." : "Reject"}
                          </Button>
                        )}
                        <Button
                          onClick={() => delAffiliate(affiliate._id)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105 text-sm"
                          disabled={loadingStates[affiliate._id]}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {isManagePartner && (

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6">Manage Partners</h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DBC166]"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {vendors.map((vendor) => (
                    <motion.div
                      key={vendor._id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full p-4 md:p-6 bg-white rounded-lg shadow-md border border-gray-200 text-sm md:text-base flex flex-col"
                    >
                      <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 break-words">{vendor.businessName}</h2>
                      <p className="text-gray-600 break-words">{vendor.businessType}</p>
                      <p className="text-gray-500 break-words">Reg No: {vendor.companyRegNumber}</p>
                      <p className="text-gray-500 break-words">VAT No: {vendor.vatNumber}</p>
                      <p className="text-gray-500 break-words">Address: {vendor.tradingAddress}</p>
                      <p className="text-gray-500 break-words">
                        Location: {vendor.city}, {vendor.province}
                      </p>
                      <p className="text-gray-500 break-words">Email: {vendor.businessEmail}</p>
                      <p className="text-gray-500 break-words">Contact: {vendor.businessContactNumber}</p>
                      <p className="text-gray-500 break-words">
                        Website: <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Visit</a>
                      </p>

                      <h3 className="mt-3 md:mt-4 font-semibold">Representative:</h3>
                      <p className="break-words">{vendor.representativeName} ({vendor.representativePosition})</p>
                      <p className="break-words">Email: {vendor.representativeEmail}</p>
                      <p className="break-words">Phone: {vendor.representativePhone}</p>

                      <h3 className="mt-3 md:mt-4 font-semibold">Exclusive Offer:</h3>
                      {/* Wheel Offer Section */}
                      <h3 className="mt-3 md:mt-4 font-semibold">Wheel Offer:</h3>
                      <p className="break-words"><strong>Type:</strong> {vendor.wheelOffer?.type || 'N/A'}</p>
                      <p className="break-words"><strong>Terms:</strong> {vendor.wheelOffer?.terms || 'N/A'}</p>
                      <div className="mt-2">
                        {vendor.wheelOffer?.offerings?.length > 0 ? (
                          <div className="space-y-2">
                            {vendor.wheelOffer.offerings.map((offering: any, index: any) => (
                              <div key={`wheel-${index}`} className="p-3 border rounded-lg bg-gray-50 relative">
                                {/* Notification badge */}
                                <span className="absolute top-2 right-2 bg-[#DBC166] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Auto-shown on wheel
                                </span>

                                <p className="font-medium mt-6">Name: {offering.name}</p>
                                <p>Quantity: {offering.quantity || 'Unlimited'}</p>
                                {offering.endDate && (
                                  <p>End Date: {new Date(offering.endDate).toLocaleDateString()}</p>
                                )}

                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No wheel offerings available</p>
                        )}
                      </div>

                      {/* Raffle Offer Section */}
                      <h3 className="mt-3 md:mt-4 font-semibold">Raffle Offer:</h3>
                      <p className="break-words"><strong>Type:</strong> {vendor.raffleOffer?.type || 'N/A'}</p>
                      <p className="break-words"><strong>Terms:</strong> {vendor.raffleOffer?.terms || 'N/A'}</p>
                      <div className="mt-2">
                        {vendor.raffleOffer?.offerings?.length > 0 ? (
                          <div className="space-y-2">
                            {vendor.raffleOffer.offerings.map((offering: any, index: any) => (
                              <div key={`raffle-${index}`} className="p-3 border rounded-lg bg-gray-50">
                                <p className="font-medium">Name: {offering.name}</p>
                                <p>Quantity: {offering.quantity || 'Unlimited'}</p>
                                {offering.endDate && (
                                  <p>End Date: {new Date(offering.endDate).toLocaleDateString()}</p>
                                )}


                                {vendor.status === "approved" && (
                                  <>
                                    <Button
                                      onClick={() => handleShowOnRaff('raffle', offering, vendor._id)}
                                      disabled={isRaffLoading}
                                      className={`mt-2 px-4 py-1 font-semibold rounded-lg shadow-md ${isRaffLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#DBC166] hover:bg-[#C2A857] text-white'
                                        }`}
                                    >
                                      {isRaffLoading ? 'Loading...' : 'Show on Raffles'}
                                    </Button>


                                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Enter Schedule Date</DialogTitle>
                                          <DialogDescription>
                                            Ensure the date is before {maxOfferDate?.toDateString()} and not in the past.
                                            <div className="text-red-500 font-medium">
                                              Important: The raffle cannot be created if there are no paid participants
                                              available.
                                            </div>
                                          </DialogDescription>
                                        </DialogHeader>
                                        <Input
                                          type="date"
                                          value={scheduleDate}
                                          onChange={(e) => setScheduleDate(e.target.value)}
                                          min={new Date().toISOString().split('T')[0]}
                                          max={maxOfferDate?.toISOString().split('T')[0]}
                                        />
                                        <DialogFooter>
                                          <Button
                                            onClick={() => handleConfirmSchedule('raffle', offering, vendor._id)}
                                            disabled={
                                              isRaffLoading ||
                                              !scheduleDate ||
                                              new Date(scheduleDate) < new Date() ||
                                              (maxOfferDate && new Date(scheduleDate) > maxOfferDate)
                                            }
                                          >
                                            {isRaffLoading ? "Processing..." : "Confirm"}
                                          </Button>

                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No raffle offerings available</p>
                        )}
                      </div>


                      <h3 className="mt-3 md:mt-4 font-semibold">Social Media:</h3>
                      <div className="flex flex-wrap gap-2">
                        <a href={vendor.socialMediaHandles?.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Facebook</a>
                        <a href={vendor.socialMediaHandles?.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 underline">Instagram</a>
                        <a href={vendor.socialMediaHandles?.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Twitter</a>
                        <a href={vendor.socialMediaHandles?.tiktok} target="_blank" rel="noopener noreferrer" className="text-black underline">TikTok</a>
                      </div>

                      <h3 className="mt-3 md:mt-4 font-semibold">Documents:</h3>
                      <div className="bg-white rounded-xl py-2 mb-2">
                        <ul className="list-none space-y-2">
                          {vendor.companyRegistrationCertificateURl && (
                            <li>
                              <a
                                href={
                                  vendor.companyRegistrationCertificateURl.secure_url.endsWith(".pdf")
                                    ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(vendor.companyRegistrationCertificateURl.secure_url)}`
                                    : vendor.companyRegistrationCertificateURl.secure_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                              >
                                Company Registration Certificate
                              </a>
                            </li>
                          )}

                          {vendor.vendorIdURl && (
                            <li>
                              <a
                                href={
                                  vendor.vendorIdURl.secure_url.endsWith(".pdf")
                                    ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(vendor.vendorIdURl.secure_url)}`
                                    : vendor.vendorIdURl.secure_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                              >
                                Vendor ID
                              </a>
                            </li>
                          )}

                          {vendor.addressProofURl && (
                            <li>
                              <a
                                href={
                                  vendor.addressProofURl.secure_url.endsWith(".pdf")
                                    ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(vendor.addressProofURl.secure_url)}`
                                    : vendor.addressProofURl.secure_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                              >
                                Address Proof
                              </a>
                            </li>
                          )}

                          {vendor.confirmationLetterURl && (
                            <li>
                              <a
                                href={
                                  vendor.confirmationLetterURl.secure_url.endsWith(".pdf")
                                    ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(vendor.confirmationLetterURl.secure_url)}`
                                    : vendor.confirmationLetterURl.secure_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                              >
                                Confirmation Letter
                              </a>
                            </li>
                          )}

                          {vendor.businessPromotionalMaterialURl && (
                            <li>
                              <a
                                href={vendor.businessPromotionalMaterialURl?.secure_url + "#toolbar=0"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                              >
                                Business Promotional Material
                              </a>
                            </li>
                          )}
                        </ul>

                      </div>

                      <div className="mt-4 md:mt-6 flex flex-wrap gap-2">
                        <Button
                          onClick={() => updatePartnerStatus(vendor._id, "approved")}
                          disabled={isApproving || vendor.status === "approved" || vendor.status === "rejected"}
                          className={`${vendor.status === "approved"
                            ? "bg-green-400 cursor-not-allowed"
                            : vendor.status === "rejected"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                            } text-white px-4 py-2 rounded-lg shadow-md transition-transform transform ${vendor.status !== "approved" && vendor.status !== "rejected" ? "hover:scale-105" : ""
                            } text-sm`}
                        >
                          {isApproving ? "Approving..." : vendor.status === "approved" ? "Approved" : "Approve"}
                        </Button>

                        {vendor.status !== "approved" && (
                          <Button
                            onClick={() => updatePartnerStatus(vendor._id, "rejected")}
                            disabled={vendor.status === "rejected"}
                            className={`${vendor.status === "rejected"
                              ? "bg-red-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                              } text-white px-4 py-2 rounded-lg shadow-md transition-transform transform ${vendor.status !== "rejected" ? "hover:scale-105" : ""
                              } text-sm`}
                          >
                            {vendor.status === "rejected" ? "Rejected" : "Reject"}
                          </Button>
                        )}

                        <Button
                          onClick={handleDelVendor}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 text-sm"
                        >
                          Delete
                        </Button>

                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this vendor? Please provide a reason for deletion.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                              <Input
                                placeholder="Enter reason for deletion"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <DialogFooter className="flex items-center justify-end space-x-2 mt-4">
                              <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="border-gray-300"
                                disabled={isDeleting}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => confirmDelete(vendor?._id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                                disabled={!confirmText.trim() || isDeleting}
                              >
                                {isDeleting ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                  </>
                                ) : (
                                  "Confirm Delete"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <h3 className="mt-3 md:mt-4 font-semibold">Select Tier:</h3>
                        <select
                          value={selectedTier}
                          onChange={(e: any) => setSelectedTier(e.target.value)}
                          className="border p-2 rounded-md text-gray-700"
                        >
                          <option value="Bronze">Bronze</option>
                          <option value="Sliver">Sliver</option>
                          <option value="Gold">Gold</option>
                        </select>

                        <button
                          onClick={() => updateTier(vendor._id, selectedTier)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md mt-2 hover:bg-blue-600 transition-transform transform hover:scale-105 text-sm"
                        >
                          Update
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div >
              )}
            </motion.div>
          )}


          {isManageUser && (
            <motion.div
              initial={{ y: -50, opacity: 0 }} // Start from the top
              animate={{ y: 0, opacity: 1 }} // Move to normal position
              transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
              className=""
            >
              <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: -50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.1, ease: "easeOut" },
                  },
                }}
              >
                {users.map((user) => (
                  <motion.div
                    key={user._id}
                    className="p-5 border rounded-lg shadow-md bg-white flex flex-col space-y-2"
                    variants={{
                      hidden: { opacity: 0, y: -30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    }}
                  >
                    <h3 className="text-lg font-semibold">{user.name}</h3>

                    <p className="text-gray-600 flex items-center">
                      <Mail size={16} className="mr-2" /> {user.email}
                    </p>

                    <p className="text-gray-600 flex items-center">
                      <Phone size={16} className="mr-2" /> {user.phone}
                    </p>

                    <p className="text-gray-600 flex items-center">
                      <MapPin size={16} className="mr-2" /> {user.street}, {user.city}, {user.province} - {user.postalCode}
                    </p>

                    <p className="text-gray-600">User Type: <span className="font-medium">{user.userType}</span></p>
                    <p className="text-gray-600">Total Points: <span className="font-medium">{user.TotalPoints}</span></p>
                    <p className="text-gray-600">Signup Date: <span className="font-medium">{new Date(user.signupDate || "").toLocaleDateString()}</span></p>

                    {user.prizeWon && (
                      <p className="text-gray-600 flex items-center">
                        <Award size={16} className="mr-2" /> Prize Won: {user.prizeWon}
                      </p>
                    )}

                    <button
                      onClick={() => user._id && deleteUser(user._id)}
                      disabled={isDeletingUser}
                      className={`mt-3 px-4 py-2 text-white rounded-lg flex items-center justify-center transition duration-200 ${isDeletingUser ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                        }`}
                    >
                      {isDeletingUser ? (
                        <>
                          <Loader size={18} className="mr-2 animate-spin" /> Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={18} className="mr-2" /> Delete
                        </>
                      )}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}


          {isManageWeeklyReferral && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <h2 className="text-xl md:text-2xl font-bold mb-6 ml-2">Manage Raff:</h2>
              <div className='flex flex-wrap  items-center'>
                <h2 className="text-xl md:text-2xl font-bold p-2 mr-7">Create new raffle </h2>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-[#DBC166] hover:bg-[#c0a855] text-black p-2 rounded-full transition duration-200"
                    >
                      <Plus size={20} strokeWidth={2} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md max-w-[95vw] mx-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Raff</DialogTitle>
                      <DialogDescription>
                        Fill out the details to create a new raff.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                      <div className="grid w-full items-center gap-2">
                        <label htmlFor="name">Raff Name</label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter raff name"
                          required
                        />
                      </div>
                      <div className="grid w-full items-center gap-2">
                        <label htmlFor="date">Date</label>
                        <CustomDatePicker
                          selectedDate={selectedDate}
                          setSelectedDate={setSelectedDate}
                          required={true}
                        />
                      </div>
                      <div className="grid w-full items-center gap-2">
                        <label>Prizes</label>
                        {formData.prizes.map((prize, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder={`Prize Name ${index + 1}`}
                                value={prize.name}
                                onChange={(e) => handlePrizeChange(index, 'name', e.target.value)}
                                required
                              />

                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Quantity"
                                value={prize.quantity}
                                onChange={(e) => handlePrizeChange(index, 'quantity', e.target.value)}
                              />
                              <CustomDatePicker
                                selectedDate={prize.endDate}
                                setSelectedDate={(date) => handlePrizeChange(index, 'endDate', date)}

                              />
                              {formData.prizes.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removePrizeField(index)}
                                  className="h-8 w-8 flex-shrink-0"
                                >
                                  <X size={16} />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addPrizeField}
                          className="mt-2"
                        >
                          Add Another Prize
                        </Button>
                      </div>

                      <DialogFooter className="sm:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setOpenDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#DBC166] hover:bg-[#c0a855] text-black disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Creating..." : "Create Raff"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>


              </div>
              <div className="p-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DBC166]"></div>
                  </div>
                ) : raff.length === 0 ? (
                  <h2 className="text-center text-xl font-semibold text-gray-500">No Raffles Available Please Create a new Raff</h2>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {raff.map((item) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="border p-4 rounded-lg shadow-md bg-white flex flex-col"
                      >
                        <h3 className="text-lg font-bold truncate">{item.name || "Unnamed Raff"}</h3>



                        {/* Scheduled At */}
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar size={16} className="text-blue-500 flex-shrink-0" />
                          <p>Schedule at: {new Date(item.scheduledAt).toISOString().split('T')[0]}</p>

                        </p>




                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar size={16} className="text-red-500 flex-shrink-0" />
                          {item.prizes.map((prize: any, index: any) => (
                            <li key={index} className="break-words">
                              End date: {prize.endDate ? new Date(prize.endDate).toISOString().split('T')[0] : "Not defined"}
                            </li>

                          ))}
                        </p>

                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Box size={16} className="text-green-500 flex-shrink-0" />
                          {item.prizes.map((prize: any, index: any) => (
                            <li key={index} className="break-words"> Quantity: {prize.quantity || "Not Defined"}</li>
                          ))}

                        </p>


                        {/* Prizes */}
                        <p className="text-sm font-medium mt-2">🎁 Prizes:</p>
                        <ul className="list-disc ml-4 text-sm text-gray-700">
                          {item.prizes.map((prize: any, index: any) => (
                            <li key={index} className="break-words">{prize?.name}</li>
                          ))}
                        </ul>

                        {/* Participants */}
                        <p className="text-sm font-medium mt-2 flex items-center gap-1">
                          <Users size={16} className="text-gray-500 flex-shrink-0" /> Participants:
                        </p>
                        <div className="max-h-40 overflow-y-auto">
                          {Array.isArray(item.participants) && item.participants.length > 0 ? (
                            <ul className="list-disc ml-4 text-sm text-gray-700">
                              {item.participants.map((participant, index) => (
                                <li key={index} className="mb-4 p-3 border rounded-lg shadow-md bg-white">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 font-semibold">Total Entries:</span>
                                    <span className={`px-3 py-1 text-sm font-bold rounded-md ${participant.entries === 10 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                                      {participant.entries} {participant.entries > 1 ? 'entries' : 'entry'}
                                    </span>
                                  </div>

                                  <div className="text-gray-800 font-semibold">{participant.user.email}</div>
                                  <div className="text-gray-600">{participant.user.phone}</div>

                                  <div className="mt-2 text-gray-600 text-sm">
                                    <span className="block">{participant.user.street}</span>
                                    <span className="block">{participant.user.town}, {participant.user.city}</span>
                                    <span className="block">{participant.user.province}, {participant.user.postalCode}</span>
                                  </div>
                                </li>

                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">🚫 No participants yet.</p>
                          )}
                        </div>
                        {/* Winner Section */}
                        <p className="text-sm font-medium mt-2 flex items-center gap-1">
                          <Trophy size={16} className="text-yellow-500 flex-shrink-0" /> Winner:
                        </p>
                        {item.winner && item.winner.length > 0 ? (
                          item.winner.map((winnerItem: any, index: any) => (
                            <p key={index} className="text-sm text-green-600 break-words">
                              🎉 <strong>{winnerItem.user?.email || "No Email"}</strong> - {winnerItem.user?.phone || "No Phone"}
                              <br />
                              {winnerItem.user?.street || "N/A"},
                              {winnerItem.user?.town || "N/A"},
                              {winnerItem.user?.city || "N/A"},
                              {winnerItem.user?.province || "N/A"},
                              {winnerItem.user?.postalCode || "N/A"}
                              <br />
                              🏆 Prize: <strong>{winnerItem.prize || "No Prize"}</strong>
                            </p>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">🏆 No winners yet.</p>
                        )}


                        {/* Delete Button */}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-4 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white self-start"
                          onClick={() => handleDeleteRaff(item._id)}
                          disabled={loading === item._id}
                        >
                          {loading === item._id ? "Deleting..." : <><Trash2 size={16} className="flex-shrink-0" /> Delete</>}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 flex items-center gap-2 text-gray-500 border-gray-400 hover:bg-gray-300 hover:text-black self-start"
                          disabled={loading === item._id}
                          onClick={() => updateVisibility(item._id)}
                        >
                          {loading === item._id ? "⏳ Updating..." : item.isVisible ? "🟢 Active" : "⚫ Inactive"}
                        </Button>
                      </motion.div>

                    ))}
                  </div>
                )}

                {/* Error Message */}
                {error && <div className="text-red-500 mt-4">{error}</div>}
              </div>
            </motion.div>
          )}

          {isManageWheel ? (
            <div className="min-h-screen">
              <h1 className='font-bold text-2xl mb-2'>Manage Wheel: </h1>
              <div className="mb-6 flex">
                <h2 className="font-bold text-xl mb-2">Create offer on wheel:</h2>

                <Dialog open={open1} onOpenChange={setOpen1}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-[#DBC166] ml-3 hover:bg-[#c0a855] text-black p-2 rounded-full transition duration-200"
                    >
                      <Plus size={20} strokeWidth={2} />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Offer</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit1} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium">
                          Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={offer.name}
                          onChange={handleChange1}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="quantity" className="block text-sm font-medium">
                          Quantity (optional)
                        </label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          value={offer.quantity}
                          onChange={handleChange1}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="endDate" className="block text-sm font-medium">
                          End Date
                        </label>
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          required
                          value={offer.endDate}
                          onChange={handleChange1}
                          min={new Date().toISOString().split('T')[0]} // Sets minimum date to today
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button type="submit">Create Offer</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendorOnWheel
                  .filter((vendor) => vendor?.vendor.offerings?.length > 0) // 🔥 Fixed filter condition
                  .map((vendor) => (
                    <div key={vendor._id} className="bg-white shadow-lg rounded-xl p-6">
                      {/* Vendor Details */}
                      <h1 className="text-2xl font-bold mb-4 text-gray-800">Details</h1>
                      <div className="mb-6 space-y-3">
                        {vendor.vendor.vendorInfo ? (
                          <>
                            <div className="flex items-center text-gray-700">
                              <User className="w-5 h-5 mr-2" />
                              <strong className="mr-2">Business Name:</strong>
                              {vendor.vendor.vendorInfo.businessName}
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Mail className="w-5 h-5 mr-2" />
                              <strong className="mr-2">Email:</strong>
                              {vendor.vendor.vendorInfo.businessEmail}
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Phone className="w-5 h-5 mr-2" />
                              <strong className="mr-2">Contact:</strong>
                              {vendor.vendor.vendorInfo.businessContactNumber}
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Clipboard className="w-5 h-5 mr-2" />
                              <strong className="mr-2">Description:</strong>
                              {vendor.vendor.vendorInfo.businessDescription}
                            </div>
                            <div className="flex items-center text-gray-700">
                              <MapPin className="w-5 h-5 mr-2" />
                              <strong className="mr-2">Location:</strong>
                              {`${vendor.vendor.vendorInfo.city || ''}, ${vendor.vendor.vendorInfo.province || ''}`.trim()}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center text-gray-700">
                            <User className="w-5 h-5 mr-2" />
                            <strong>Created by admin</strong>
                          </div>
                        )}

                      
                      </div>

                      {/* Offerings */}
                      <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                        <Tag className="w-5 h-5 mr-2" /> Wheel Offerings
                      </h2>
                      <div className="space-y-4">
                        {vendor.vendor.offerings?.map((offering: any) => (
                          <div key={offering._id} className="p-4 border rounded-lg bg-gray-50 relative">
                            {/* Auto-shown badge */}
                            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                              <Check className="w-3 h-3 mr-1" />
                              Auto-shown
                            </span>

                            <div className="mt-6 space-y-2">
                              <p className="font-medium">Name: {offering.name}</p>
                              {offering.quantity && <p>Quantity: {offering.quantity}</p>}
                              {offering.endDate && (
                                <p className="flex items-center">
                                  <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                                  <span>End Date: {new Date(offering.endDate).toLocaleDateString()}</span>
                                </p>
                              )}
                              <button
                                onClick={() => handleDeleteOffering(offering._id)}
                                className="mt-3 flex items-center px-3 py-1.5 bg-red-400 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                              >
                                <Trash2 className="w-4 h-4 mr-1.5" /> Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">

            </div>
          )}

        </div>
      </motion.div>

      {/* Create Admin Modal */}
      {isCreateAdminModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg w-full max-w-md p-4 md:p-6"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold">Create New Admin</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setCreateAdminModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* create new admin form */}
            <form onSubmit={() => { }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-3 py-1 md:px-4 md:py-2 border text-gray-700 rounded-md hover:bg-gray-100 text-sm md:text-base"
                  onClick={() => setCreateAdminModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 md:px-4 md:py-2 bg-[#DBC166] text-white rounded-md hover:bg-[#c9a94c] text-sm md:text-base"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


