    import mongoose from 'mongoose';

    const wheelSchema = new mongoose.Schema({
        vendor: {
            vendorInfo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Vendor",
            },
            offerings: {
                type: [
                    {
                        name: { type: String, required: true },
                        quantity: { type: Number, required: false },
                        endDate: { type: Date, required: false },  
                    }
                ],
                default: [],
                
            }
        }
    });

    export default mongoose.model("Wheel", wheelSchema);
