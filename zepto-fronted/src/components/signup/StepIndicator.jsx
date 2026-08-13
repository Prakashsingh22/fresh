import React from "react";

const StepIndicator = ({ currentStep, totalSteps, labels }) => {
  return (
    <div className="flex space-x-2 mb-4">
      {labels.map((label, index) => (
        <div key={index} className={currentStep === index + 1 ? "font-bold" : "text-gray-400"}>
          {label}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
