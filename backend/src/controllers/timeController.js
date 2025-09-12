import TimeModel from "../models/timer.model.js";

// Get mainWebTime (with elapsed time adjustment)
export const getMainWebTime = async (req, res) => {
  try {
    const timeData = await TimeModel.findOne();
    if (!timeData) return res.status(404).json({ message: "No data found" });

    const { mainWebTime, updatedAt } = timeData;
    const elapsedSeconds = Math.floor((Date.now() - new Date(updatedAt)) / 1000);
    const remainingTime = Math.max(0, mainWebTime - elapsedSeconds);
    console.log("main web: " , mainWebTime);
    res.json({ mainWebTime: remainingTime });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get appTime (same logic applied)
export const getAppTime = async (req, res) => {
  try {
    const timeData = await TimeModel.findOne();
    if (!timeData) return res.status(404).json({ message: "No data found" });

    const { appTime, updatedAt } = timeData;
    const elapsedSeconds = Math.floor((Date.now() - new Date(updatedAt)) / 1000);
    const remainingTime = Math.max(0, appTime - elapsedSeconds);
    console.log("app time: " , appTime)
    res.json({ appTime: remainingTime });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Set mainWebTime and appTime (reset the timer)
export const setTimeData = async (req, res) => {
  try {
    const { mainWebTime, appTime } = req.body;
    let timeData = await TimeModel.findOne();

    if (timeData) {
      timeData.mainWebTime = mainWebTime ?? timeData.mainWebTime;
      timeData.appTime = appTime ?? timeData.appTime;
      timeData.updatedAt = new Date(); // Reset start time
      await timeData.save();
    } else {
      timeData = await TimeModel.create({
        mainWebTime,
        appTime,
        updatedAt: new Date(),
      });
    }

    res.status(200).json({ message: "Time data saved successfully", timeData });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
