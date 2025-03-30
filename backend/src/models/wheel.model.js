import mongoose from 'mongoose';

const wheelSchema = new mongoose.Schema({
    //now we have admin or vendor on wheel 
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
    },
    admin: {
        adminInfo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
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


// Add an instance method to delete the document
wheelSchema.methods.delete = async function () {
    try {
        await this.deleteOne();
        console.log(`Wheel with ID ${this._id} deleted successfully.`);
    } catch (error) {
        console.error("Error deleting wheel:", error);
    }
};

export default mongoose.model("Wheel", wheelSchema);
