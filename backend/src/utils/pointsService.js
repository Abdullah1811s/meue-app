import usersModel from "../models/users.model.js";

export const addPoints = async (userId, points) => {
    const user = await usersModel.findById(userId);
    if (!user) throw new Error("User not found");
    
    user.TotalPoints += points;
    await user.save();
    return user.TotalPoints;
};
