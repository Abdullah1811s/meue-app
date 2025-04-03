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
  Loader,
  ChevronDownIcon,
  Trash

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

import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CustomDatePicker from '@/components/customComponents/Datepicker';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaSpinner } from 'react-icons/fa6';


export interface IVendor {
  referralCodeUsed: any;
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
  idNumber: any;
  totalR10: number;
  bankConfirmationUrl: any;
  accountNumber: any;
  branchCode: any;
  affiliate: any;
  accountHolder: any;
  bankName: any;
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

// interface RaffFormData {
//   name: string;
//   scheduledAt: string;
//   prizes: Prize[];
// }

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
  prizeWon?: string[] | undefined;
  referralCodeShare?: string;
  numberOfTimesWheelRotate?: number;
}



// const socket = io("http://localhost:8000");
const socket = io(import.meta.env.VITE_BACKEND_URL_SOCKET); //here

const AdminDashboard = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const adminToken = localStorage.getItem("AdminToken");
  const { id } = useParams();
  const [affiliates, setAffiliates] = useState<Affiliated[]>([]);
  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [raff, setRaff] = useState<RaffleItem[]>([])
  const [users, setUsers] = useState<IUser[]>([])
  const [admins, setAdmin] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [isManageAffiliate, setManageAffiliate] = useState(false);
  const [isManageAdmin, setManageAdmin] = useState(false);
  const [isManageWheel, setManageWheel] = useState(false);
  const [isManagePartner, setManagePartner] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isManageWeeklyReferral, setManageWeeklyReferral] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isManageUser, setManageUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [currentOffering, setCurrentOffering] = useState<any>(null);
  const [currentVendorId, setCurrentVendorId] = useState<string>("");
  // const [currentExclusiveOffer, setCurrentExclusiveOffer] = useState<string>("");
  const [isRejecting, setIsRejecting] = useState(false);
  // const [onRaff, setOnRaff] = useState<boolean>(false);
  const [, setSelectedDate] = useState<Date | null>(new Date());
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [delAffLoading, setDelAffLoading] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectBtn, setRejectBtn] = useState<{ [key: string]: boolean }>({});
  const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);
  const [expandedAffiliates, setExpandedAffiliates] = useState<any>({});
  const [referralStats, setReferralStats] = useState<any>({});
  // const [rejectDialogOpen1, setRejectDialogOpen1] = useState<any>(false);
  const [rejectionReason1, setRejectionReason1] = useState<any>('');
  const [vendorToReject1, setVendorToReject] = useState<any>(null);
  const [raffleName, setRaffleName] = useState('');
  const [newAdmin, setNewAdmin] = useState({
    whoMadeHimEmail: '',  // Email of the admin creating this new admin
    name: '',             // Name of the new admin
    newEmail: '',         // Email of the new admin
    password: ''          // Password for the new admin
  });

  const handleCreateAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show loading toast

    if (!newAdmin.whoMadeHimEmail.includes("super")) {

      toast.error("You are not super admin.");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(newAdmin.password)) {
      alert("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }
    const toastId = toast.loading('Creating admin...');
    try {
      // Validate email ends with @adminMenu.com
      if (!newAdmin.newEmail.endsWith('@adminMenu.com')) {
        toast.error('Email must end with @adminMenu.com', { id: toastId });
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/admin/createAdmin`, {
        whoMadeHimEmail: newAdmin.whoMadeHimEmail,
        newEmail: newAdmin.newEmail,
        password: newAdmin.password,
        name: newAdmin.name
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.data) {
        toast.success('Admin created successfully! Do reload to see changes', { id: toastId });
        setCreateAdminModalOpen(false);
        setNewAdmin({
          whoMadeHimEmail: '',
          name: '',
          newEmail: '',
          password: ''
        });
       
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);

      if (error.response) {
        // Handle different error statuses
        console.log(error.response.data.error);
        toast.error(error.response.data.error, {
          id: toastId,
          duration: 5000 // Show for longer duration
        });
        switch (error.response.status) {
          case 400:
            toast.error(error.response.data.error || 'Validation failed', { id: toastId });
            break;

          case 409:
            toast.error('Admin with this email already exists', { id: toastId });
            break;
          default:
            toast.error('An error occurred while creating admin', { id: toastId });
        }
      } else {
        toast.error('Network error. Please try again.', { id: toastId });
      }
    }
  };
  const [formData, setFormData] = useState<any>({
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
  // const addPrizeField = (): void => {
  //   setFormData({
  //     ...formData,
  //     prizes: [...formData.prizes, {
  //       name: "",
  //       quantity: "",
  //       endDate: null
  //     }]
  //   });
  // };

  const removePrizeField = (index: number): void => {
    const updatedPrizes = formData.prizes.filter((_: any, i: any) => i !== index);
    setFormData({
      ...formData,
      prizes: updatedPrizes
    });
  };

  // Helper function to format date for date input (YYYY-MM-DD)
  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateOnly = (date: Date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Format the main raffle date
      const formattedDate = formData.scheduledAt
        ? formatDateOnly(formData.scheduledAt)
        : '';

      // Prepare prizes data - ensure required fields are present
      const preparedPrizes = formData.prizes.map((prize: any) => ({
        name: prize.name,
        quantity: prize.quantity || "1",
        endDate: prize.endDate ? new Date(prize.endDate).toISOString() : null
      }));

      const submissionData = {
        name: formData.name,
        scheduleAt: formattedDate,
        prizes: preparedPrizes,
        status: "scheduled",
        isVisible: false
      };

      const response = await axios.post(`${API_BASE_URL}/Raff/createRaff`, submissionData, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      setRaff((prevRaff) => [...prevRaff, response.data.raffle]);

      toast.success(response.data.message);

      // Reset form
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

  const fetchRaff = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/Raff`);
      console.log("This is the data : ", res.data.raff);
      setRaff(res.data.raff);

      setIsLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch affiliates');
      setIsLoading(false);
      toast.error(error.message);
      console.log(error.message);
    }
  }

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

  const fetchReferralStats = async (affiliateId: any) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/referral/${affiliateId}/stats`);
      setReferralStats((prev: any) => ({
        ...prev,
        [affiliateId]: res.data
      }));
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      // Handle error as needed
    }
  };

  const toggleReferralInfo = async (affiliateId: any) => {
    // Toggle the expanded state
    setExpandedAffiliates((prev: any) => ({
      ...prev,
      [affiliateId]: !prev[affiliateId]
    }));

    // If we're expanding and don't have the data yet, fetch it
    if (!expandedAffiliates[affiliateId] && !referralStats[affiliateId]) {
      await fetchReferralStats(affiliateId);
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
       await axios.delete(`${API_BASE_URL}/wheel/remove`, {
        data: { vendorInfo: id },
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      
      await axios.delete(`${API_BASE_URL}/Raff/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
    
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


  const delAffiliate = async (affId: string, reason: string) => {
    try {
      setDelAffLoading(true);
      const res = await axios.delete(`${API_BASE_URL}/affiliated/removeAffiliate`, {
        data: { affId, reason },
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      setAffiliates((prev) => prev.filter((item) => item._id !== affId));
      toast.success(res.data.message);
      setDelAffLoading(false);
    } catch (error) {
      toast.error("Failed to delete =. Try again!");
    }
    finally {
      setDelAffLoading(false);
    }
  }

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/`);

      setUsers(res.data.users);
    } catch (error) {
      toast.error("Failed to fetch user  =. Try again!");
    }
  }
  const fetchAdmin = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin`);
      console.log(res.data);
      setAdmin(res.data.admins);
      console.log("this ", admins);
    } catch (error) {
      toast.error("Failed to fetch user  =. Try again!");
    }
  }



  const switchTab = (tab: 'affiliate' | 'partner' | 'weeklyReferral' | 'wheelManage' | 'manageUser' | 'manageAdmin') => {
    if (tab === 'affiliate') {
      setManageUser(false);
      setManageAffiliate(true);
      setManagePartner(false);
      setManageWeeklyReferral(false);
      setHasSelectedOption(true);
      setManageWheel(false);
      setManageAdmin(false);
      setSidebarOpen(false);
      fetchAffiliate();
    } else if (tab === 'partner') {
      setManageUser(false);
      setManageAffiliate(false);
      setManagePartner(true);
      setManageWeeklyReferral(false);
      setHasSelectedOption(true);
      setSidebarOpen(false);
      setManageAdmin(false);
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
      setManageAdmin(false);
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
      setManageAdmin(false);
      fetchUser();
    }
    else if (tab === 'wheelManage') {
      setManageUser(false);
      setManageAffiliate(false);
      setManagePartner(false);
      setManageWeeklyReferral(false);
      setManageWheel(true);
      setHasSelectedOption(true);
      setSidebarOpen(false);
      setManageAdmin(false);
      fetchVendorOnWheel();
    }
    else {
      setManageAdmin(true);
      setManageUser(false);
      setManageAffiliate(false);
      setManagePartner(false);
      setManageWeeklyReferral(false);
      setManageWheel(false);
      setHasSelectedOption(true);
      setSidebarOpen(false);
      fetchAdmin();
    }
  };

  const updateAffiliate = async (id: string, status: string, reason: string) => {
    if (status === "approved")
      setLoadingStates(prev => ({ ...prev, [id]: true }));
    else if (status === "rejected")
      setRejectBtn(prev => ({ ...prev, [id]: true }));
    try {
      const payload = { id, status, reason };
      await axios.put(
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

      toast.success("Status updated successfully");
      if (status === "rejected") {
        toast.success("Rejected affiliate will be removed from the database after 24 hours", {
          duration: 8000,
        });
      }
    } catch (error: any) {
      console.error("Error updating affiliate status:", error.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false })); // Stop loading
    }
  };

  const updatePartnerStatus = async (id: string, status: "pending" | "approved" | "rejected", reason: string) => {
    if (status === "approved")
      setIsApproving(true);
    if (status === "rejected")
      setIsRejecting(true);
    setLoadingStates(prev => ({ ...prev, [id]: true }));

    try {
      const payload = { id, status, reason };
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

        await axios.post(
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


      } catch (error: any) {
        console.error("Failed to add wheel offers:", error);
        if (status === "approved")
          toast.error(`No offer available from the partner to add to the wheel. Please check and try again.`, { duration: 5000 });
        throw error;
      }



    } catch (error: any) {
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false })); // Stop loading
    }
    if (status === "approved")
      setIsApproving(false);
    if (status === "rejected")
      setIsRejecting(false);
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

  const handleShowOnRaff = async (offering: any, vendorId: string) => {
    try {
      if (!offering) {
        toast.error("No offerings available");
        return;
      }

      // Store current offering and vendor ID
      setCurrentOffering(offering);
      setCurrentVendorId(vendorId);

      // Check end date if exists
      if (offering.endDate) {
        setMaxOfferDate(new Date(offering.endDate));
        setIsOpen(true);
      } else if (offering.quantity > 0) {
        // If no end date but has quantity, create immediately
        await createRaffle(offering, vendorId, 'Custom Raffle Name'); // Default name
        toast.success("Added to Raffle system");
      } else {
        toast.error("Invalid quantity");
      }
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const handleConfirmSchedule = async () => {
    if (!raffleName.trim() || !scheduleDate || !currentOffering || !currentVendorId) {
      toast.error("Please fill all fields");
      return;
    }

    if (maxOfferDate && new Date(scheduleDate) > maxOfferDate) {
      toast.error("Schedule date cannot be after the exclusive offer date.");
      return;
    }

    setIsRaffLoading(true);
    try {
      await createRaffle(currentOffering, currentVendorId, raffleName);
      toast.success("Raffle created successfully");
      setIsOpen(false);
      setRaffleName(''); // Reset name
      setScheduleDate(''); // Reset date
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsRaffLoading(false);
    }
  };

  const createRaffle = async (offering: any, vendorId: string, name: string) => {
    const prize = [{
      name: offering.name,
      id: offering._id,
      quantity: offering.quantity,
      ...(offering.endDate && { endDate: new Date(offering.endDate) })
    }];

    await axios.post(`${API_BASE_URL}/Raff/createRaff`, {
      name,
      scheduleAt: scheduleDate,
      prizes: prize,
      vendorId
    }, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
  };

  const handleApiError = (error: any) => {
    console.error("Error:", error);
    if (error.response) {
      const errorMessage = error.response.data?.message ||
        error.response.data?.error ||
        "Failed to process raffle";
      toast.error(errorMessage);
    } else if (error.request) {
      toast.error("Network error - please check your connection");
    } else {
      toast.error("An unexpected error occurred");
    }
  };


  const handleClickAffiliate = () => {
    switchTab('affiliate');
  };

  const fetchVendorOnWheel = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/wheel`);

      const filteredData = res.data.data.filter(
        (entry: any) =>
          (entry.vendor?.offerings?.length ?? 0) > 0 ||
          (entry.admin?.offerings?.length ?? 0) > 0
      );

      setVendorOnWheel(filteredData);
    } catch (error: any) {
      console.error("Error fetching vendor on wheel:", error);
    }
  };

  const handleDeleteOffering = async (offerId: string) => {
    try {
      console.log("This is the offering:", offerId);

      const res = await axios.delete(`${API_BASE_URL}/wheel/offers/${offerId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (res.status === 200) {
        toast.success("Offer deleted");

        setVendorOnWheel((prevData) =>
          prevData.map((wheel) => ({
            ...wheel,
            vendor: wheel.vendor
              ? {
                ...wheel.vendor,
                offerings: wheel.vendor.offerings
                  ? wheel.vendor.offerings.filter((offering: any) => offering._id !== offerId)
                  : [],
              }
              : null,
            admin: wheel.admin
              ? {
                ...wheel.admin,
                offerings: wheel.admin.offerings
                  ? wheel.admin.offerings.filter((offering: any) => offering._id !== offerId)
                  : [],
              }
              : null,
          })).filter((wheel) =>
            (wheel.vendor?.offerings?.length ?? 0) > 0 ||
            (wheel.admin?.offerings?.length ?? 0) > 0
          ) // Remove empty entries
        );
      } else {
        console.error("Failed to delete offer:", res.data);
        throw new Error("Failed to delete offer");
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };



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

      if (!offer.name) {
        throw new Error("Offer name is required");
      }

      if (offer.endDate && new Date(offer.endDate) < new Date()) {
        throw new Error("End date cannot be in the past");
      }

      const offerData = {
        admin: {
          adminInfo: id,
          offerings: [{
            name: offer.name,
            quantity: offer.quantity ? parseInt(offer.quantity) : undefined,
            endDate: offer.endDate || undefined
          }]
        }
      };

      // Send POST request to add the offer
      const response = await axios.post(`${API_BASE_URL}/wheel/addAdmin`, offerData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Offer has been added on wheel!");

        await fetchVendorOnWheel();


      } else {
        throw new Error(response.data.message || "Failed to create offer");
      }

      // Reset form
      setOpen(false);
      setOffer({ name: "", quantity: "", endDate: "" });

    } catch (error: any) {
      console.error("Error submitting offer:", error);
      toast.error(error?.response?.data.message || error.message);

      if (axios.isAxiosError(error)) {
        console.error("Backend error:", error.response?.data.message);
      }
    }
  };


  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOffer(prev => ({ ...prev, [name]: value }));
  };

  function handleDeleteAdmin(email: string): void {
    const res = axios.delete(`${API_BASE_URL}/admin/removeAdmin`, {
      data: { removeEmail: email },
      headers: {
        'Authorization': `Bearer ${adminToken}` // Assuming you store the token in localStorage
      }
    })

      .then(response => {
        console.log('Admin deleted successfully:', response.data.message);
        toast.success("Admin deleted");
        setAdmin((prevAdmins:any) => prevAdmins.filter((admin:any) => admin.email !== email));
      })
      .catch(error => {
        console.error('Error deleting admin:', error.response?.data?.message || error.message);
        toast.error("error in deleting admin");
      });
    console.log(res);
  }

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
          <div
            className={`px-4 py-3 flex items-center cursor-pointer ${isManageAdmin ? 'bg-[#DBC166] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => switchTab('manageAdmin')}
          >
            <Users size={20} className="mr-3 flex-shrink-0" />
            <span className="truncate">Manage Admins</span>
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
                  {affiliates.map((affiliate) => (
                    <div key={affiliate._id} className="bg-white rounded-lg shadow p-4 md:p-6 flex flex-col">
                      <h3 className="text-lg md:text-xl font-bold mb-3 break-words">
                        {affiliate.fullName} {affiliate.surname}
                      </h3>
                      <p className="text-gray-600 mb-2 break-words"><strong>Email:</strong> {affiliate.email}</p>
                      <p className="text-gray-600 mb-2"><strong>Phone:</strong> {affiliate.phoneNumber}</p>
                      <p className="text-gray-600 mb-2">
                        <strong>Type:</strong>
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${affiliate.type === "business" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                          {affiliate.type}
                        </span>
                      </p>
                      {affiliate.type === "individual" && (
                        <div className="mt-2">
                          <p className="text-gray-600 mb-2 break-words"><strong>ID number:</strong> {affiliate.idNumber}</p>
                        </div>
                      )}
                      {affiliate.type === "business" && (
                        <div className="mt-2">
                          <p className="text-gray-600 mb-2 break-words"><strong>Business Name:</strong> {affiliate.businessName}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>Reg Number:</strong> {affiliate.companyRegistrationNumber}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>VAT Number:</strong> {affiliate.vatNumber}</p>
                          <p className="text-gray-600 mb-2 break-words"><strong>Address:</strong> {affiliate.tradingAddress}</p>
                        </div>
                      )}

                      <div className="mt-4">
                        <h4 className="text-lg font-bold mb-2">Bank Details</h4>
                        <p className="text-gray-600 mb-2"><strong>Bank Name:</strong> {affiliate.bankName}</p>
                        <p className="text-gray-600 mb-2"><strong>Account Holder:</strong> {affiliate.accountHolder}</p>
                        <p className="text-gray-600 mb-2"><strong>Account Number:</strong> {affiliate.accountNumber}</p>
                        <p className="text-gray-600 mb-2"><strong>Branch Code:</strong> {affiliate.branchCode}</p>

                        {affiliate.bankConfirmationUrl?.secure_url && (
                          <div className="mt-2">
                            <strong className="text-gray-700">Bank Confirmation Document:</strong>
                            {affiliate.bankConfirmationUrl.secure_url.endsWith('.pdf') ? (
                              <a href={affiliate.bankConfirmationUrl.secure_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-2">
                                View PDF
                              </a>
                            ) : (
                              <img src={affiliate.bankConfirmationUrl.secure_url} alt="Bank Confirmation" className="mt-2 w-full max-w-xs rounded-lg shadow" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Referral Info Section */}
                      <div className="mt-4 border-t pt-4">
                        <button
                          onClick={() => toggleReferralInfo(affiliate._id)}
                          className="flex items-center justify-between w-full text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          <span className="font-medium">
                            {expandedAffiliates[affiliate._id] ? 'Hide Referral Stats' : 'Show Referral Stats'}
                          </span>
                          <ChevronDownIcon className={`ml-2 h-4 w-4 transition-transform ${expandedAffiliates[affiliate._id] ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedAffiliates[affiliate._id] ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                          {referralStats[affiliate._id] ? (
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Referrals:</span>
                                <span className="font-medium">{referralStats[affiliate._id].totalReferrals}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">R10 Users:</span>
                                <span className="font-medium">{referralStats[affiliate._id].userReferrals.r10Count}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">R50 Users:</span>
                                <span className="font-medium">{referralStats[affiliate._id].userReferrals.r50Count}</span>
                              </div>
                            </div>
                          ) : expandedAffiliates[affiliate._id] ? (
                            <div className="flex justify-center items-center py-3">
                              <FaSpinner className="animate-spin text-gray-400" />
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {affiliate.status === "approved" ? (
                          <span className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md text-sm">Approved</span>
                        ) : affiliate.status === "rejected" ? (
                          <span className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md text-sm">Rejected</span>
                        ) : (
                          <>
                            <Button
                              onClick={() => updateAffiliate(affiliate._id, "approved", "")}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105 text-sm"
                              disabled={loadingStates[affiliate._id]}
                            >
                              {loadingStates[affiliate._id] ? "Approving..." : "Approve"}
                            </Button>

                            <Button
                              disabled={rejectBtn[affiliate._id]}
                              onClick={() => {
                                setRejectDialogOpen(true);
                                setSelectedAffiliate(affiliate);
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105 text-sm"
                            >
                              {rejectBtn[affiliate._id] ? "Rejecting..." : "Reject"}
                            </Button>
                          </>
                        )}

                        <Button
                          onClick={() => {
                            setDeleteDialogOpen(true);
                            setSelectedAffiliate(affiliate);
                          }}
                          disabled={delAffLoading}
                          className={`${delAffLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600"
                            } text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105 text-sm`}
                        >
                          {delAffLoading ? "Deleting..." : "Delete"}
                        </Button>

                      </div>
                    </div>
                  ))}

                  {/* Reject Confirmation Dialog */}
                  <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Affiliate</DialogTitle>
                        <DialogDescription>
                          Provide a reason for rejecting <strong>{selectedAffiliate?.fullName}</strong>.
                        </DialogDescription>
                      </DialogHeader>
                      <textarea
                        className="w-full border rounded p-2"
                        placeholder="Enter rejection reason..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                        <Button
                          variant="destructive"
                          disabled={!rejectionReason.trim()}
                          onClick={() => {
                            updateAffiliate(selectedAffiliate._id, "rejected", rejectionReason);
                            setRejectDialogOpen(false);
                          }}
                        >
                          Confirm Reject
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Confirmation Dialog */}
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Affiliate</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete <strong>{selectedAffiliate?.fullName}</strong>? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <textarea
                        className="w-full border rounded p-2"
                        placeholder="Enter cancellation reason..."
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                      />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button
                          variant="destructive"
                          disabled={!cancellationReason.trim()}
                          onClick={() => {
                            delAffiliate(selectedAffiliate._id, cancellationReason);
                            setDeleteDialogOpen(false);
                          }}
                        >
                          Confirm Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                      <p className="text-gray-500 break-words">Code used: {vendor.referralCodeUsed || "No code used"}</p>

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
                                    <button
                                      onClick={() => handleShowOnRaff(offering, vendor._id)}
                                      disabled={isRaffLoading}
                                      className={`mt-2 px-4 py-1 font-semibold rounded-lg shadow-md ${isRaffLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#DBC166] hover:bg-[#C2A857] text-white'
                                        }`}
                                    >
                                      {isRaffLoading ? 'Loading...' : 'Create Raffle'}
                                    </button>

                                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Create New Raffle</DialogTitle>
                                          <DialogDescription>
                                            Please enter a name for the raffle and select a schedule date.
                                          </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-4">
                                          <div>
                                            <label htmlFor="raffleName" className="block text-sm font-medium text-gray-700">
                                              Raffle Name
                                            </label>
                                            <input
                                              id="raffleName"
                                              type="text"
                                              value={raffleName}
                                              onChange={(e) => setRaffleName(e.target.value)}
                                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                              placeholder="Enter raffle name"
                                            />
                                          </div>

                                          <div>
                                            <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700">
                                              Schedule Date
                                            </label>
                                            <input
                                              id="scheduleDate"
                                              type="date"
                                              value={scheduleDate}
                                              onChange={(e) => setScheduleDate(e.target.value)}
                                              min={new Date().toISOString().split('T')[0]}
                                              max={maxOfferDate?.toISOString().split('T')[0]}
                                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                            />
                                            {maxOfferDate && (
                                              <p className="mt-1 text-sm text-gray-500">
                                                Must be before {maxOfferDate.toLocaleDateString()}
                                              </p>
                                            )}
                                          </div>
                                        </div>

                                        <DialogFooter>
                                          <Button
                                            onClick={handleConfirmSchedule}
                                          // disabled={
                                          //   isRaffLoading ||
                                          //   !raffleName.trim() ||
                                          //   !scheduleDate ||
                                          //   (new Date(scheduleDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) || // Prevent past dates
                                          //   (maxOfferDate && new Date(scheduleDate).setHours(0, 0, 0, 0) > new Date(maxOfferDate).setHours(0, 0, 0, 0)) // Prevent schedule date after max offer date
                                          // }
                                          >
                                            {isRaffLoading ? "Creating..." : "Create Raffle"}
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
                          onClick={() => updatePartnerStatus(vendor._id, "approved", "")}
                          disabled={isApproving || vendor.status === "approved"}
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
                          <>
                            <Button
                              onClick={() => {
                                if (vendor.status !== "rejected") {
                                  setVendorToReject(vendor._id);
                                  setRejectDialogOpen(true);
                                }
                              }}
                              disabled={isRejecting || vendor.status === "rejected"}
                              className={`${vendor.status === "rejected"
                                ? "bg-red-400 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600"
                                } text-white px-4 py-2 rounded-lg shadow-md transition-transform transform ${vendor.status !== "rejected" ? "hover:scale-105" : ""
                                } text-sm`}
                            >
                              {isRejecting ? "rejecting..." : vendor.status === "rejected" ? "Rejected" : "Reject"}
                            </Button>

                            {/* Rejection Dialog */}
                            {rejectDialogOpen && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                                  <h3 className="text-lg font-medium mb-4">Confirm Rejection</h3>
                                  <p className="mb-2">Please provide a reason for rejecting this vendor:</p>
                                  <textarea
                                    className="w-full p-2 border border-gray-300 rounded mb-4"

                                    value={rejectionReason1}
                                    onChange={(e) => setRejectionReason1(e.target.value)}
                                    placeholder="Enter rejection reason..."
                                  />
                                  <div className="flex justify-end space-x-3">
                                    <button
                                      onClick={() => {
                                        setRejectDialogOpen(false);
                                        setRejectionReason('');
                                      }}
                                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => { updatePartnerStatus(vendorToReject1, "rejected", rejectionReason1), setRejectDialogOpen(false); setRejectionReason(''); }}
                                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                      Confirm Reject
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
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

                    {user?.prizeWon && user.prizeWon.length > 0 && (
                      <div className="text-gray-600">
                        <div className="flex items-center">
                          <Award size={16} className="mr-2" />
                          <span>Prizes Won:</span>
                        </div>
                        <ul className="list-disc pl-5 mt-1">
                          {user.prizeWon.map((prize, index) => (
                            <li key={index}>{prize}</li>
                          ))}
                        </ul>
                      </div>
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
                        <label htmlFor="scheduledAt">Schedule Date</label>
                        <input
                          type="date"
                          id="scheduledAt"
                          value={formData.scheduledAt ? formatDateForInput(formData.scheduledAt) : ""}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            setFormData((prev: any) => ({ ...prev, scheduledAt: date }));
                          }}
                          required
                          min={new Date().toISOString().split('T')[0]} // This prevents selecting past dates
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <div className="grid w-full items-center gap-2">
                        <label>Prizes</label>
                        {formData.prizes.map((prize: any, index: any) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder={`Prize Name ${index + 1}`}
                                value={prize.name}
                                onChange={(e) => handlePrizeChange(index, 'name', e.target.value)}
                                required
                              />

                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                              {/* Quantity Field */}
                              <div className="flex items-center gap-2">
                                <label htmlFor="quantity" className="font-medium">Quantity:</label>
                                <Input
                                  placeholder="Quantity"
                                  value={prize.quantity}
                                  onChange={(e) => handlePrizeChange(index, 'quantity', e.target.value)}
                                  className="w-24"
                                />
                              </div>

                              {/* End Date Field */}
                              <div className="flex items-center gap-2">
                                <label htmlFor="endDate" className="font-medium">End Date:</label>
                                <CustomDatePicker
                                  selectedDate={prize.endDate}
                                  setSelectedDate={(date) => handlePrizeChange(index, 'endDate', date)}

                                />
                              </div>

                              {/* Remove Button (Only if multiple prizes exist) */}
                              {formData.prizes.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removePrizeField(index)}
                                  className="h-8 w-8 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                                >
                                  <X size={16} />
                                </Button>
                              )}
                            </div>

                          </div>
                        ))}

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
                          <span>Scheduled at: {new Date(item.scheduledAt).toISOString().split('T')[0]}</span>
                        </p>

                        {/* End Dates */}
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar size={16} className="text-red-500 flex-shrink-0" />
                            <span>End dates:</span>
                          </div>
                          <ul className="list-disc ml-5">
                            {item.prizes.map((prize: any, index: number) => (
                              <li key={`end-date-${index}`} className="break-words">
                                {prize.endDate ? new Date(prize.endDate).toISOString().split('T')[0] : "Not defined"}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Quantities */}
                        <div className="text-sm text-gray-600 mt-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Box size={16} className="text-green-500 flex-shrink-0" />
                            <span>Quantities:</span>
                          </div>
                          <ul className="list-disc ml-5">
                            {item.prizes.map((prize: any, index: number) => (
                              <li key={`quantity-${index}`} className="break-words">
                                {prize.quantity !== undefined ? prize.quantity : "Not Defined"}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Prizes */}
                        <p className="text-sm font-medium mt-2">🎁 Prizes:</p>
                        <ul className="list-disc ml-4 text-sm text-gray-700">
                          {item.prizes.map((prize: any, index: number) => (
                            <li key={`prize-${index}`} className="break-words">{prize?.name || "Unnamed Prize"}</li>
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
                                <li key={`participant-${index}`} className="mb-4 p-3 border rounded-lg shadow-md bg-white">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 font-semibold">Total Entries:</span>
                                    <span className={`px-3 py-1 text-sm font-bold rounded-md ${participant.entries === 10 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                                      {participant.entries} {participant.entries > 1 ? 'entries' : 'entry'}
                                    </span>
                                  </div>

                                  {/* Safe participant.user access */}
                                  <div className="text-gray-800 font-semibold">{participant?.user?.email || "No email"}</div>
                                  <div className="text-gray-600">{participant?.user?.phone || "No phone"}</div>

                                  <div className="mt-2 text-gray-600 text-sm">
                                    <span className="block">{participant?.user?.street || "N/A"}</span>
                                    <span className="block">
                                      {participant?.user?.town || "N/A"}, {participant?.user?.city || "N/A"}
                                    </span>
                                    <span className="block">
                                      {participant?.user?.province || "N/A"}, {participant?.user?.postalCode || "N/A"}
                                    </span>
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
                          <Trophy size={16} className="text-yellow-500 flex-shrink-0" /> Winners:
                        </p>
                        {item.winner && item.winner.length > 0 ? (
                          <ul className="list-disc ml-4 text-sm text-green-600">
                            {item.winner.map((winnerItem: any, index: number) => (
                              <li key={`winner-${index}`} className="break-words">
                                🎉 <strong>{winnerItem.user?.email || "No Email"}</strong> - {winnerItem.user?.phone || "No Phone"}
                                <br />
                                {winnerItem.user?.street || "N/A"}, {winnerItem.user?.town || "N/A"}, {winnerItem.user?.city || "N/A"},
                                {winnerItem.user?.province || "N/A"}, {winnerItem.user?.postalCode || "N/A"}
                                <br />
                                🏆 Prize: <strong>{winnerItem.prize || "No Prize"}</strong>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">🏆 No winners yet.</p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                          {/* Delete Button */}
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => handleDeleteRaff(item._id)}
                            disabled={loading === item._id}
                          >
                            {loading === item._id ? "Deleting..." : <><Trash2 size={16} className="flex-shrink-0" /> Delete</>}
                          </Button>



                          {Array.isArray(item.prizes) && item.prizes.length > 0 &&
                            item.prizes.some((prize: any) => {
                              const today = new Date().toISOString().split('T')[0];
                              const prizeEndDate = prize.endDate ? new Date(prize.endDate).toISOString().split('T')[0] : null;


                              return prize.quantity <= 0 || (prizeEndDate && prizeEndDate === today);
                            }) ? (
                            <p className="text-sm text-red-500 font-semibold">⚠️ This raffle is no longer available.</p>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 text-gray-500 border-gray-400 hover:bg-gray-300 hover:text-black"
                              disabled={loading === item._id}
                              onClick={() => updateVisibility(item._id,)}
                            >
                              {loading === item._id ? (
                                "⏳ Updating..."
                              ) : (
                                (() => {
                                  const today = new Date().toISOString().split("T")[0];
                                  const canBeActiveAgain = item.prizes.some(
                                    (prize: any) => prize.quantity > 1 && (!prize.endDate || new Date(prize.endDate).toISOString().split("T")[0] !== today)
                                  );

                                  return item.isVisible
                                    ? "🟢 Open Raffles"
                                    : canBeActiveAgain
                                      ? "⚫ Closed Raffles "
                                      : "⚫ Closed Raffles";
                                })()
                              )}
                            </Button>
                          )}





                        </div>
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
                  .filter((entry) => (entry.vendor?.offerings?.length || 0) > 0 || (entry.admin?.offerings?.length || 0) > 0) // 🎯 Only show cards with offerings
                  .map((entry) => (
                    <div key={entry._id} className="bg-white shadow-lg rounded-xl p-6">
                      {/* 🎯 Vendor Details (Only if Offerings Exist) */}
                      {entry.vendor?.offerings?.length > 0 && entry.vendor?.vendorInfo && (
                        <>
                          <h1 className="text-2xl font-bold mb-4 text-gray-800">Vendor Details</h1>
                          <div className="mb-6 space-y-3">
                            <div className="flex items-center text-gray-700">
                              <User className="w-5 h-5 mr-2" />
                              <strong className="mr-2">Business Name:</strong>
                              {entry.vendor.vendorInfo.businessName}
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Mail className="w-5 h-5 mr-2" />
                              <strong className="mr-2">Email:</strong>
                              {entry.vendor.vendorInfo.businessEmail}
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Phone className="w-5 h-5 mr-2" />
                              <strong className="mr-2">Contact:</strong>
                              {entry.vendor.vendorInfo.businessContactNumber}
                            </div>
                          </div>
                        </>
                      )}

                      {/* 🎯 Admin Details (Only if Offerings Exist) */}
                      {entry.admin?.offerings?.length > 0 && entry.admin?.adminInfo && (
                        <>
                          <h1 className="text-2xl font-bold mb-4 text-gray-800">Admin Details</h1>
                          <div className="mb-6 space-y-3">
                            <div className="flex items-center text-gray-700">
                              <User className="w-5 h-5 mr-2" />
                              <strong className="mr-2">Admin Name:</strong>
                              {entry.admin.adminInfo.name || "N/A"}
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Mail className="w-5 h-5 mr-2" />
                              <strong className="mr-2">Email:</strong>
                              {entry.admin.adminInfo.email || "N/A"}
                            </div>
                          </div>
                        </>
                      )}

                      {/* 🎯 Offerings */}
                      <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                        <Tag className="w-5 h-5 mr-2" /> Wheel Offerings
                      </h2>
                      <div className="space-y-4">
                        {entry.vendor?.offerings?.length > 0 ? (
                          entry.vendor.offerings.map((offering: any) => (
                            <div key={offering._id} className="p-4 border rounded-lg bg-gray-50 relative">
                              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                                <Check className="w-3 h-3 mr-1" />
                                Vendor Offer
                              </span>

                              <div className="mt-6 space-y-2">
                                <p className="font-medium">Name: {offering.name}</p>
                                {offering.quantity && <p>Quantity: {offering.quantity}</p>}
                                <button
                                  onClick={() => handleDeleteOffering(offering._id)}
                                  className="mt-3 flex items-center px-3 py-1.5 bg-red-400 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                >
                                  <Trash2 className="w-4 h-4 mr-1.5" /> Remove
                                </button>
                              </div>
                            </div>
                          ))
                        ) : entry.admin?.offerings?.length > 0 ? (
                          entry.admin.offerings.map((offering: any) => (
                            <div key={offering._id} className="p-4 border rounded-lg bg-gray-50 relative">
                              <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                                <Check className="w-3 h-3 mr-1" />
                                Admin Offer
                              </span>

                              <div className="mt-6 space-y-2">
                                <p className="font-medium">Name: {offering.name}</p>
                                {offering.quantity && <p>Quantity: {offering.quantity}</p>}
                                <button
                                  onClick={() => handleDeleteOffering(offering._id)}
                                  className="mt-3 flex items-center px-3 py-1.5 bg-red-400 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                >
                                  <Trash2 className="w-4 h-4 mr-1.5" /> Remove
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No offerings available</p>
                        )}
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
            <form onSubmit={handleCreateAdminSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Admin Email (Creator)</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
                  value={newAdmin.whoMadeHimEmail}
                  onChange={(e) => setNewAdmin({ ...newAdmin, whoMadeHimEmail: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Admin Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Admin Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
                  value={newAdmin.newEmail}
                  onChange={(e) => setNewAdmin({ ...newAdmin, newEmail: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Must end with @adminMenu.com</p>
              </div>
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-md"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                  autoComplete="new-password" // Prevent browser autofill
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters with uppercase, lowercase, and number
                </p>
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



      {isManageAdmin && (
        <motion.div
          initial={{ y: -50, opacity: 0 }} // Start from the top
          animate={{ y: 0, opacity: 1 }} // Move to normal position
          transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
          className=" absolute top-20 m-4"
        >
          <h2 className="text-2xl font-bold mb-4">Manage admin</h2>
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
            {admins?.map((admin) => (
              <div key={admin._id} className="bg-white shadow-lg rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-xl font-semibold">{admin.name}</h3>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                    <p className="text-xs text-gray-400">Created on: {new Date(admin.createdAt).toLocaleDateString()}</p>
                  </div>
                  {admin.role !== 'superadmin' && (
                    <button
                      onClick={() => handleDeleteAdmin(admin.email)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}





    </div>
  );
};

export default AdminDashboard;


