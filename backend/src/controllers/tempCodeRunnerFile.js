
import { updateRaffWithPart, check } from './RaffController.js';


const dummyUserR50 = {
    _id: "user123",
    userType: "R50",
    signupDate: "2025-03-25T10:00:00Z", // Not needed for R50, but included for consistency
};

const dummyUserR10 = {
    _id: "user456",
    userType: "R10",
    signupDate: "2025-03-25T10:00:00Z", // Matches a dummy raffle date
};

const dummyUserR10NoRaffle = {
    _id: "user789",
    userType: "R10",
    signupDate: "2025-03-22T10:00:00Z", // No matching raffle
};


check();
console.log("Done with check()");
process.exit(0);