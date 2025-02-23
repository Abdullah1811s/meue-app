export const CheckEmailAndPh = async (modelName, email, phone) => {
    try {
        if (!modelName) {
            throw new Error("Model is required");
        }

        const isEmailExist = await modelName.findOne({ email });
        if (isEmailExist) {
            return { status: 409, message: "Email already registered" };
        }

        const isPhoneExist = await modelName.findOne({ phone });
        if (isPhoneExist) {
            return { status: 409, message: "Phone number already registered, please use a different one" };
        }

        return { status: 200, message: "Email and phone number are available" };
    } catch (error) {
        console.log("UTILS ERROR", error);
        return { status: 500, message: "Internal server error" };
    }
};
