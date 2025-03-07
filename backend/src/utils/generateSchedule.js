import schedule from 'node-schedule';
import raffModel from '../models/raff.model.js';

export const ScheduleRaff = async (raff) => {
    try {
        const { _id, scheduledAt } = raff;
        const scheduledDate = new Date(scheduledAt);

        if (isNaN(scheduledDate.getTime())) {
            console.error(`❌ Invalid date for raff ${_id}: ${scheduledAt}`);
            return;
        }

        if (scheduledDate < new Date()) {
            console.warn(`⚠️ Skipping scheduling for raff ${_id}, scheduled date is in the past.`);
            await raffModel.deleteOne({ _id: raff._id });
            console.log(`🗑️ Deleted expired raff ${_id}`);
            return;
        }
        
        try {
            schedule.scheduleJob(scheduledDate, async () => {
                console.log(`⏳ Executing scheduled job for raff ${_id}...`);
                await updateStatus(raff);
                console.log(`✅ Successfully executed raff ${_id}`);
            });

            console.log(`✅ Scheduled raff ${_id} for ${scheduledDate.toISOString()}`);
        } catch (scheduleError) {
            console.error(`❌ Error while scheduling raff ${_id}:`, scheduleError);
        }

    } catch (error) {
        console.error(`❌ Error scheduling raff ${raff._id}:`, error);
    }
};


const updateStatus = async (raff) => {
    try {
        const updatedRaff = await raffModel.findById(raff._id); //get new date
        if (!updatedRaff || updatedRaff.status !== "scheduled") {
            console.warn(`⚠️ Skipping status update for raff ${raff._id}, already updated.`);
            return;
        }

        updatedRaff.status = "completed";
        await updatedRaff.save();
        console.log(`✅ Status updated to "completed" for raff ${raff._id}`);
    } catch (error) {
        console.error(`❌ Error updating status for raff ${raff._id}:`, error);
    }
};

export const handleServerRestart = async () => {
    try {

        let pendingRaffs = await raffModel.find({ status: "scheduled" });
        if (pendingRaffs.length === 0) {
            console.log("✅ No pending raffles to reschedule.");
            return;
        }


        await Promise.all(pendingRaffs.map((raff) => ScheduleRaff(raff))); //runs in background

        console.log(`✅ Rescheduled ${pendingRaffs.length} raffs after server restart.`);
    } catch (error) {
        console.error("❌ Error in handleServerRestart:", error);
    }
};
