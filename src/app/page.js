"use client";
import { useState } from "react";
import { AIState } from "../../config/AIConfig";
import ShowData from "./components/ShowData";

export default function LocationForm() {
  const [formData, setFormData] = useState({
    stateName: "",
    countryName: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.stateName.trim()) {
      newErrors.stateName = "State name is required";
    }

    if (!formData.countryName.trim()) {
      newErrors.countryName = "Country name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    } else if (e.key === "Escape") {
      handleReset();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) return;

    console.log("Form submitted:", formData);
    const prompt = `give me list of cities in given state:${formData.stateName},country:${formData.countryName}.include cities,short description,history,famous for. in json formate`;
    try {
      const result = await AIState.sendMessage(prompt);
      const response = await result.response.text();
      const josn = JSON.parse(response);
      setData(josn);
      setSubmitted(true); // ✅ This line is important
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    setFormData({
      stateName: "",
      countryName: "",
    });
    setErrors({});
  };

  if (submitted) {
    return (
      <>
        <ShowData
          data={data}
          state={formData.stateName}
          setSubmitted={setSubmitted}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
            Location Information
          </h1>
          <p className="text-gray-600 text-center text-sm sm:text-base">
            Please enter your state and country details
          </p>
        </div>

        <div className="space-y-6">
          {/* State Name Field */}
          <div>
            <label
              htmlFor="stateName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              State Name{" "}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </label>
            <input
              type="text"
              id="stateName"
              name="stateName"
              value={formData.stateName}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              aria-required="true"
              aria-invalid={errors.stateName ? "true" : "false"}
              aria-describedby={
                errors.stateName ? "stateName-error" : undefined
              }
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition duration-200 ${
                errors.stateName
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
              placeholder="Enter state name"
            />
            {errors.stateName && (
              <p
                id="stateName-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.stateName}
              </p>
            )}
          </div>

          {/* Country Name Field */}
          <div>
            <label
              htmlFor="countryName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Country Name{" "}
              <span className="text-red-500" aria-label="required">
                *
              </span>
            </label>
            <input
              type="text"
              id="countryName"
              name="countryName"
              value={formData.countryName}
              onChange={handleInputChange}
              aria-required="true"
              aria-invalid={errors.countryName ? "true" : "false"}
              aria-describedby={
                errors.countryName ? "countryName-error" : undefined
              }
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition duration-200 ${
                errors.countryName
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
              placeholder="Enter country name"
            />
            {errors.countryName && (
              <p
                id="countryName-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.countryName}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 font-medium"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
