import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  required?: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  setSelectedDate,
  required = false,
}) => {
  // Get current date for minimum selectable date
  const today = new Date();

  return (
    <div className="relative w-full">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        scrollableMonthYearDropdown
        placeholderText={`Select Date${required ? " *" : ""}`}
        className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200
                 hover:border-blue-400"
        required={required}
        minDate={today} // This sets the minimum date to today
      />
    </div>
  );
};

export default CustomDatePicker;
