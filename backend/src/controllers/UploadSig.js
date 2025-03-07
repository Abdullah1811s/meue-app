import { v2 as cloudinary } from 'cloudinary'


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
})


const generateSignature = async (req, res) => {
    try {
        const { folder } = req.body;
        console.log(req.body)
        if (!folder) {
            return res.status(400).json({ message: "Please provide the folder name" });
        }
        const timestamp = Math.round((new Date()).getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request({
            timestamp,
            folder,
        }, process.env.CLOUD_API_SECRET);
        console.log(signature)
        return res.status(200).json({
            message: "Signature created successfully",
            timestamp, signature
        });
    }
    catch (error) {
        console.log(
            "[CLOUDINARY ERROR] Vendor upload"
        );
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}
export default generateSignature;