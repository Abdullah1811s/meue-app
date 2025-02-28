import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store, Building2, Phone, Package } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const businessSchema = z.object({
    business_name: z.string().min(2, 'Business name must be at least 2 characters'),
    contact_person: z.string().min(2, 'Contact person name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    offerings: z.array(z.string()).min(1, 'At least one offering is required'),
});

export type BusinessFormData = z.infer<typeof businessSchema>;

interface BusinessFormProps {
    onSubmit: (data: BusinessFormData) => Promise<void>;
    initialData?: Partial<BusinessFormData>;
    title: string;
    subtitle: string;
    submitText: string;
}

export function BusinessForm({ onSubmit, initialData, title, subtitle, submitText }: BusinessFormProps) {
    const [offeringInput, setOfferingInput] = useState('');
    const [offerings, setOfferings] = useState<string[]>(initialData?.offerings || []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<BusinessFormData>({
        resolver: zodResolver(businessSchema),
        defaultValues: initialData,
    });

    const handleAddOffering = () => {
        if (offeringInput.trim()) {
            const newOfferings = [...offerings, offeringInput.trim()];
            setOfferings(newOfferings);
            setValue('offerings', newOfferings);
            setOfferingInput('');
        }
    };

    const handleRemoveOffering = (index: number) => {
        const newOfferings = offerings.filter((_, i) => i !== index);
        setOfferings(newOfferings);
        setValue('offerings', newOfferings);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Store className="w-16 h-16 mx-auto mb-4 text-[#C5AD59]" />
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">{title}</h1>
                    <p className="text-gray-600">{subtitle}</p>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Business Details Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0 }}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <div className="flex items-center mb-4">
                            <Building2 className="w-6 h-6 text-[#C5AD59] mr-2" />
                            <h2 className="text-2xl font-semibold text-gray-800">Business Details</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                <input
                                    {...register("business_name")}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                                />
                                {errors.business_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.business_name.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                                <input
                                    {...register("contact_person")}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                                />
                                {errors.contact_person && (
                                    <p className="text-red-500 text-sm mt-1">{errors.contact_person.message}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Information Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <div className="flex items-center mb-4">
                            <Phone className="w-6 h-6 text-[#C5AD59] mr-2" />
                            <h2 className="text-2xl font-semibold text-gray-800">Contact Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    {...register("email")}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    {...register("phone")}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                                <input
                                    {...register("address")}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Offerings Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <div className="flex items-center mb-4">
                            <Package className="w-6 h-6 text-[#C5AD59] mr-2" />
                            <h2 className="text-2xl font-semibold text-gray-800">Product Offerings</h2>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Add Product Offering</label>
                            <div className="flex gap-2">
                                <input
                                    value={offeringInput}
                                    onChange={(e) => setOfferingInput(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5AD59] focus:border-transparent"
                                    placeholder="Enter a product or service"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddOffering}
                                    className="px-4 py-2 bg-[#C5AD59] text-white rounded-md hover:bg-[#b39b47] transition-colors duration-200"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Current Offerings:</p>
                                {offerings.length === 0 ? (
                                    <p className="text-sm text-gray-500">No offerings added yet</p>
                                ) : (
                                    <div className="space-y-2">
                                        {offerings.map((offering, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                                <span className="text-gray-700">{offering}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOffering(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        type="submit"
                        className="w-full bg-[#C5AD59] text-white py-3 px-6 rounded-md hover:bg-[#b39b47] transition-colors duration-200 font-semibold text-lg shadow-md"
                    >
                        {submitText}
                    </motion.button>
                </form>
            </div>
        </div>
    );
}