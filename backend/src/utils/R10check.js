
import usersModel from "../models/users.model.js";
export const resetExpiredR10Users = async () => {
    try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const expiredUsers = await usersModel.find({
            userType: "R10",
            isPaid: true,
            R10UserPaidDate: { $lte: oneHourAgo }
        });

        if (expiredUsers.length > 0) {
            // Reset payment status
            await usersModel.updateMany(
                { _id: { $in: expiredUsers.map(user => user._id) } },
                { $set: { isPaid: false } }
            );
            console.log(`Reset payment status for ${expiredUsers.length} R10 users`);
        }
    } catch (error) {
        console.error("Error resetting expired R10 users:", error);
    }
}


