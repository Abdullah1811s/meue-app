import schedule from 'node-schedule';
const date = new Date("3/7/2025, 10:13:00 PM")
const job = schedule.scheduleJob(date, function(){
  console.log('The answer to life, the universe, and everything!');
});
console.log(job);
/*

export const ScheduleRaff = async (Raff) => {
    try {
        if (!Raff || !Raff.scheduledAt) {
            throw new Error("Invalid Raff object or missing scheduledAt field.");
        }

        const currentDate = new Date();
        const scheduleDate = new Date(Raff.scheduledAt);
        const delay = scheduleDate.getTime() - currentDate.getTime();

        if (delay > 0) {
            console.log(`📌 Scheduling task in ${delay / 1000} seconds`);

            setTimeout(async () => {
                try {
                    console.log(`✅ Executing task`);
                    Raff.status = "completed";
                    await Raff.save();
                    
                } catch (error) {
                    console.error("❌ Error executing scheduled task:", error);
                }
            }, delay);
        } else {
            console.log(`⏳ Missed schedule! Executing immediately`);
            Raff.status = "completed";
            await Raff.save();
        }
    } catch (error) {
        console.error("❌ Error in ScheduleRaff:", error);
    }
};



*/