import TimeModel from "../models/timer.model.js";
export const getMainWebTime = async (req, res) => {
  try {
    const timeData = await TimeModel.findOne(); // Fetch first document
    if (!timeData) return res.status(404).json({ message: "No data found" });

    res.json({ mainWebTime: timeData.mainWebTime });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get appTime
export const getAppTime = async (req, res) => {
  try {
    const timeData = await TimeModel.findOne(); // Fetch first document
    if (!timeData) return res.status(404).json({ message: "No data found" });

    res.json({ appTime: timeData.appTime });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const setTimeData = async (req, res) => {
  try {
    const { mainWebTime, appTime } = req.body;

    // Check if there's an existing document (assuming only one document exists)
    let timeData = await TimeModel.findOne();

    if (timeData) {
      // Update existing document
      timeData.mainWebTime = mainWebTime ?? timeData.mainWebTime;
      timeData.appTime = appTime ?? timeData.appTime;
      await timeData.save();
    } else {
      // Create new document
      timeData = await TimeModel.create({ mainWebTime, appTime });
    }

    res.status(200).json({ message: "Time data saved successfully", timeData });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
