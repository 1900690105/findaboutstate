"use client";
import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { AIState } from "../../config/AIConfig";

// Mock ShowData component
const ShowData = ({ data, state, setSubmitted }) => (
  <div className="p-6 bg-white rounded-lg shadow-xl">
    <h2 className="text-2xl font-bold mb-4">Cities in {state}</h2>
    <button
      onClick={() => setSubmitted(false)}
      className="bg-indigo-600 text-white px-4 py-2 rounded-md"
    >
      Back to Form
    </button>
    <pre className="mt-4 p-4 bg-gray-100 rounded-md text-sm overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);

export default function LocationForm() {
  const [formData, setFormData] = useState({
    stateName: "",
    countryName: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Refs for focus management
  const stateInputRef = useRef(null);
  const countryInputRef = useRef(null);
  const submitButtonRef = useRef(null);
  const resetButtonRef = useRef(null);
  const locationButtonRef = useRef(null);

  // Focus management on component mount
  useEffect(() => {
    if (stateInputRef.current) {
      stateInputRef.current.focus();
    }
  }, []);

  // Function to get location using browser's geolocation API
  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setLocationLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes cache
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          await reverseGeocode(latitude, longitude);
        } catch (error) {
          console.error("Error processing location:", error);
          setLocationError("Failed to process location data");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        let errorMessage = "Unable to retrieve location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage =
              "An unknown error occurred while retrieving location";
            break;
        }

        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      options
    );
  };

  // Function to convert coordinates to address using a free geocoding service
  const reverseGeocode = async (latitude, longitude) => {
    try {
      // Using OpenStreetMap's Nominatim service (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            "User-Agent": "LocationForm/1.0", // Required by Nominatim
          },
        }
      );

      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }

      const locationData = await response.json();

      if (locationData && locationData.address) {
        const address = locationData.address;

        // Extract state/province and country
        const state = address.state || address.province || address.region || "";
        const country = address.country || "";

        if (state && country) {
          setFormData({
            stateName: state,
            countryName: country,
          });

          // Clear any existing errors
          setErrors({});

          // Optional: Show success message
          console.log(`Location detected: ${state}, ${country}`);
        } else {
          setLocationError(
            "Could not determine state and country from your location"
          );
        }
      } else {
        setLocationError("Location data not available for your area");
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setLocationError("Failed to convert location to address");
    }
  };

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

    // Clear location error when user manually types
    if (locationError) {
      setLocationError("");
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
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleReset();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const currentElement = e.target;

      if (e.key === "ArrowDown") {
        if (currentElement === stateInputRef.current) {
          countryInputRef.current?.focus();
        } else if (currentElement === countryInputRef.current) {
          locationButtonRef.current?.focus();
        } else if (currentElement === locationButtonRef.current) {
          submitButtonRef.current?.focus();
        } else if (currentElement === submitButtonRef.current) {
          resetButtonRef.current?.focus();
        }
      } else if (e.key === "ArrowUp") {
        if (currentElement === resetButtonRef.current) {
          submitButtonRef.current?.focus();
        } else if (currentElement === submitButtonRef.current) {
          locationButtonRef.current?.focus();
        } else if (currentElement === locationButtonRef.current) {
          countryInputRef.current?.focus();
        } else if (currentElement === countryInputRef.current) {
          stateInputRef.current?.focus();
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      if (errors.stateName) {
        stateInputRef.current?.focus();
      } else if (errors.countryName) {
        countryInputRef.current?.focus();
      }
      return;
    }

    setIsLoading(true);
    console.log("Form submitted:", formData);

    const prompt = `give me list of cities in given state:${formData.stateName},country:${formData.countryName}.include cities,short description,history,famous for. in json format`;

    try {
      const result = await AIState.sendMessage(prompt);
      const response = await result.response.text();
      const json = JSON.parse(response);
      setData(json);
      setSubmitted(true);
      console.log(response);
    } catch (error) {
      console.error("Error fetching city data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      stateName: "",
      countryName: "",
    });
    setErrors({});
    setLocationError("");
    setTimeout(() => {
      stateInputRef.current?.focus();
    }, 0);
  };

  if (submitted) {
    return (
      <ShowData
        data={data}
        state={formData.stateName}
        setSubmitted={setSubmitted}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <a
        href="#main-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-50"
      >
        Skip to main content
      </a>

      <main className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
            City Information Finder
          </h1>
          <p className="text-gray-600 text-center text-sm sm:text-base">
            Discover cities in any state and country with detailed information
          </p>
        </header>

        <div id="main-form" className="space-y-6">
          <fieldset>
            <legend className="sr-only">Location Information Form</legend>

            {/* Auto-detect location button */}
            <div className="mb-4">
              <button
                ref={locationButtonRef}
                type="button"
                onClick={getCurrentLocation}
                onKeyDown={handleKeyDown}
                disabled={locationLoading || isLoading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                aria-describedby="location-help"
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Detecting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    Use My Current Location
                  </>
                )}
              </button>
              <div
                id="location-help"
                className="mt-1 text-xs text-gray-500 text-center"
              >
                Auto-fill form with your current location
              </div>

              {locationError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {locationError}
                  </p>
                </div>
              )}
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  or enter manually
                </span>
              </div>
            </div>

            {/* State Name Field */}
            <div>
              <label
                htmlFor="stateName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                State or Province Name{" "}
                <span className="text-red-500" aria-label="required">
                  *
                </span>
              </label>
              <input
                ref={stateInputRef}
                type="text"
                id="stateName"
                name="stateName"
                value={formData.stateName}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onKeyPress={handleKeyPress}
                aria-required="true"
                aria-invalid={errors.stateName ? "true" : "false"}
                aria-describedby={
                  errors.stateName
                    ? "stateName-error stateName-help"
                    : "stateName-help"
                }
                className={`w-full px-3 py-2 text-black border rounded-md shadow-sm focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.stateName
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                placeholder="e.g., California, Ontario, Bayern"
                autoComplete="address-level1"
              />
              <div id="stateName-help" className="mt-1 text-xs text-gray-500">
                Enter the state, province, or region name
              </div>
              {errors.stateName && (
                <p
                  id="stateName-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  <span aria-hidden="true">⚠ </span>
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
                ref={countryInputRef}
                type="text"
                id="countryName"
                name="countryName"
                value={formData.countryName}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onKeyPress={handleKeyPress}
                aria-required="true"
                aria-invalid={errors.countryName ? "true" : "false"}
                aria-describedby={
                  errors.countryName
                    ? "countryName-error countryName-help"
                    : "countryName-help"
                }
                className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.countryName
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                placeholder="e.g., United States, Canada, Germany"
                autoComplete="country-name"
              />
              <div id="countryName-help" className="mt-1 text-xs text-gray-500">
                Enter the full country name
              </div>
              {errors.countryName && (
                <p
                  id="countryName-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  <span aria-hidden="true">⚠ </span>
                  {errors.countryName}
                </p>
              )}
            </div>
          </fieldset>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              ref={submitButtonRef}
              type="submit"
              onKeyDown={handleKeyDown}
              disabled={isLoading || locationLoading}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              aria-describedby="submit-help"
            >
              {isLoading ? (
                <>
                  <span aria-hidden="true">⏳ </span>
                  Loading...
                </>
              ) : (
                "Find Cities"
              )}
            </button>
            <div id="submit-help" className="sr-only">
              Press Enter or click to search for cities in the specified
              location
            </div>

            <button
              ref={resetButtonRef}
              type="button"
              onClick={handleReset}
              onKeyDown={handleKeyDown}
              disabled={isLoading || locationLoading}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              aria-describedby="reset-help"
            >
              Clear Form
            </button>
            <div id="reset-help" className="sr-only">
              Press Escape or click to clear all form fields
            </div>
          </div>

          {/* Keyboard shortcuts help */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Keyboard Shortcuts:
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>
                <kbd className="px-1 py-0.5 bg-gray-200 rounded">Enter</kbd> -
                Submit form
              </li>
              <li>
                <kbd className="px-1 py-0.5 bg-gray-200 rounded">Escape</kbd> -
                Clear form
              </li>
              <li>
                <kbd className="px-1 py-0.5 bg-gray-200 rounded">↑/↓</kbd> -
                Navigate between fields
              </li>
              <li>
                <kbd className="px-1 py-0.5 bg-gray-200 rounded">Tab</kbd> -
                Standard navigation
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

// "use client";
// import { useState, useEffect, useRef } from "react";
// import { AIState } from "../../config/AIConfig";
// import ShowData from "./components/ShowData";
// import Head from "next/head";

// export default function LocationForm() {
//   const [formData, setFormData] = useState({
//     stateName: "",
//     countryName: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [data, setData] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Refs for focus management
//   const stateInputRef = useRef(null);
//   const countryInputRef = useRef(null);
//   const submitButtonRef = useRef(null);
//   const resetButtonRef = useRef(null);

//   // Focus management on component mount
//   useEffect(() => {
//     if (stateInputRef.current) {
//       stateInputRef.current.focus();
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.stateName.trim()) {
//       newErrors.stateName = "State name is required";
//     }

//     if (!formData.countryName.trim()) {
//       newErrors.countryName = "Country name is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleKeyPress = (e) => {
//     // Enhanced keyboard navigation
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleSubmit(e);
//     } else if (e.key === "Escape") {
//       e.preventDefault();
//       handleReset();
//     } else if (e.key === "Tab") {
//       // Allow natural tab navigation, but handle custom logic if needed
//       return;
//     }
//   };

//   // Handle arrow key navigation between form elements
//   const handleKeyDown = (e) => {
//     if (e.key === "ArrowDown" || e.key === "ArrowUp") {
//       e.preventDefault();
//       const currentElement = e.target;

//       if (e.key === "ArrowDown") {
//         if (currentElement === stateInputRef.current) {
//           countryInputRef.current?.focus();
//         } else if (currentElement === countryInputRef.current) {
//           submitButtonRef.current?.focus();
//         } else if (currentElement === submitButtonRef.current) {
//           resetButtonRef.current?.focus();
//         }
//       } else if (e.key === "ArrowUp") {
//         if (currentElement === resetButtonRef.current) {
//           submitButtonRef.current?.focus();
//         } else if (currentElement === submitButtonRef.current) {
//           countryInputRef.current?.focus();
//         } else if (currentElement === countryInputRef.current) {
//           stateInputRef.current?.focus();
//         }
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();

//     if (!validateForm()) {
//       // Focus on first error field
//       if (errors.stateName) {
//         stateInputRef.current?.focus();
//       } else if (errors.countryName) {
//         countryInputRef.current?.focus();
//       }
//       return;
//     }

//     setIsLoading(true);
//     console.log("Form submitted:", formData);

//     const prompt = `give me list of cities in given state:${formData.stateName},country:${formData.countryName}.include cities,short description,history,famous for. in json format`;

//     try {
//       const result = await AIState.sendMessage(prompt);
//       const response = await result.response.text();
//       const json = JSON.parse(response);
//       setData(json);
//       setSubmitted(true);
//       console.log(response);
//     } catch (error) {
//       console.error("Error fetching city data:", error);
//       // You might want to set an error state here for user feedback
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       stateName: "",
//       countryName: "",
//     });
//     setErrors({});
//     // Focus back to first input after reset
//     setTimeout(() => {
//       stateInputRef.current?.focus();
//     }, 0);
//   };

//   // SEO Meta tags component
//   const SEOHead = () => (
//     <Head>
//       <title>
//         City Information Finder - Discover Cities by State and Country
//       </title>
//       <meta
//         name="description"
//         content="Find detailed information about cities in any state and country. Get city descriptions, history, and what they're famous for. Free city information lookup tool."
//       />
//       <meta
//         name="keywords"
//         content="city information, state cities, country cities, city finder, travel information, city history, city descriptions"
//       />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <meta name="robots" content="index, follow" />
//       <meta
//         property="og:title"
//         content="City Information Finder - Discover Cities by State and Country"
//       />
//       <meta
//         property="og:description"
//         content="Find detailed information about cities in any state and country. Get city descriptions, history, and what they're famous for."
//       />
//       <meta property="og:type" content="website" />
//       <meta name="twitter:card" content="summary" />
//       <meta name="twitter:title" content="City Information Finder" />
//       <meta
//         name="twitter:description"
//         content="Find detailed information about cities in any state and country."
//       />
//       <link
//         rel="canonical"
//         href={typeof window !== "undefined" ? window.location.href : ""}
//       />
//     </Head>
//   );

//   if (submitted) {
//     return (
//       <>
//         <SEOHead />
//         <ShowData
//           data={data}
//           state={formData.stateName}
//           setSubmitted={setSubmitted}
//         />
//       </>
//     );
//   }

//   return (
//     <>
//       <SEOHead />
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//         {/* Skip to main content link for screen readers */}
//         <a
//           href="#main-form"
//           className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-50"
//         >
//           Skip to main content
//         </a>

//         <main className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md">
//           <header className="mb-6">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
//               City Information Finder
//             </h1>
//             <p className="text-gray-600 text-center text-sm sm:text-base">
//               Discover cities in any state and country with detailed information
//             </p>
//           </header>

//           <form
//             id="main-form"
//             onSubmit={handleSubmit}
//             className="space-y-6"
//             noValidate
//           >
//             <fieldset>
//               <legend className="sr-only">Location Information Form</legend>

//               {/* State Name Field */}
//               <div>
//                 <label
//                   htmlFor="stateName"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   State or Province Name{" "}
//                   <span className="text-red-500" aria-label="required">
//                     *
//                   </span>
//                 </label>
//                 <input
//                   ref={stateInputRef}
//                   type="text"
//                   id="stateName"
//                   name="stateName"
//                   value={formData.stateName}
//                   onChange={handleInputChange}
//                   onKeyDown={handleKeyDown}
//                   onKeyPress={handleKeyPress}
//                   aria-required="true"
//                   aria-invalid={errors.stateName ? "true" : "false"}
//                   aria-describedby={
//                     errors.stateName
//                       ? "stateName-error stateName-help"
//                       : "stateName-help"
//                   }
//                   className={`w-full px-3 py-2 text-black border rounded-md shadow-sm focus:outline-none focus:ring-2 transition duration-200 ${
//                     errors.stateName
//                       ? "border-red-300 focus:ring-red-500 focus:border-red-500"
//                       : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
//                   }`}
//                   placeholder="e.g., California, Ontario, Bayern"
//                   autoComplete="address-level1"
//                 />
//                 <div id="stateName-help" className="mt-1 text-xs text-gray-500">
//                   Enter the state, province, or region name
//                 </div>
//                 {errors.stateName && (
//                   <p
//                     id="stateName-error"
//                     className="mt-1 text-sm text-red-600"
//                     role="alert"
//                     aria-live="polite"
//                   >
//                     <span aria-hidden="true">⚠ </span>
//                     {errors.stateName}
//                   </p>
//                 )}
//               </div>

//               {/* Country Name Field */}
//               <div>
//                 <label
//                   htmlFor="countryName"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Country Name{" "}
//                   <span className="text-red-500" aria-label="required">
//                     *
//                   </span>
//                 </label>
//                 <input
//                   ref={countryInputRef}
//                   type="text"
//                   id="countryName"
//                   name="countryName"
//                   value={formData.countryName}
//                   onChange={handleInputChange}
//                   onKeyDown={handleKeyDown}
//                   onKeyPress={handleKeyPress}
//                   aria-required="true"
//                   aria-invalid={errors.countryName ? "true" : "false"}
//                   aria-describedby={
//                     errors.countryName
//                       ? "countryName-error countryName-help"
//                       : "countryName-help"
//                   }
//                   className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 transition duration-200 ${
//                     errors.countryName
//                       ? "border-red-300 focus:ring-red-500 focus:border-red-500"
//                       : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
//                   }`}
//                   placeholder="e.g., United States, Canada, Germany"
//                   autoComplete="country-name"
//                 />
//                 <div
//                   id="countryName-help"
//                   className="mt-1 text-xs text-gray-500"
//                 >
//                   Enter the full country name
//                 </div>
//                 {errors.countryName && (
//                   <p
//                     id="countryName-error"
//                     className="mt-1 text-sm text-red-600"
//                     role="alert"
//                     aria-live="polite"
//                   >
//                     <span aria-hidden="true">⚠ </span>
//                     {errors.countryName}
//                   </p>
//                 )}
//               </div>
//             </fieldset>

//             {/* Form Actions */}
//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 ref={submitButtonRef}
//                 type="submit"
//                 onKeyDown={handleKeyDown}
//                 disabled={isLoading}
//                 className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                 aria-describedby="submit-help"
//               >
//                 {isLoading ? (
//                   <>
//                     <span aria-hidden="true">⏳ </span>
//                     Loading...
//                   </>
//                 ) : (
//                   "Find Cities"
//                 )}
//               </button>
//               <div id="submit-help" className="sr-only">
//                 Press Enter or click to search for cities in the specified
//                 location
//               </div>

//               <button
//                 ref={resetButtonRef}
//                 type="button"
//                 onClick={handleReset}
//                 onKeyDown={handleKeyDown}
//                 disabled={isLoading}
//                 className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                 aria-describedby="reset-help"
//               >
//                 Clear Form
//               </button>
//               <div id="reset-help" className="sr-only">
//                 Press Escape or click to clear all form fields
//               </div>
//             </div>

//             {/* Keyboard shortcuts help */}
//             <div className="mt-4 p-3 bg-gray-50 rounded-md">
//               <h3 className="text-sm font-medium text-gray-700 mb-2">
//                 Keyboard Shortcuts:
//               </h3>
//               <ul className="text-xs text-gray-600 space-y-1">
//                 <li>
//                   <kbd className="px-1 py-0.5 bg-gray-200 rounded">Enter</kbd> -
//                   Submit form
//                 </li>
//                 <li>
//                   <kbd className="px-1 py-0.5 bg-gray-200 rounded">Escape</kbd>{" "}
//                   - Clear form
//                 </li>
//                 <li>
//                   <kbd className="px-1 py-0.5 bg-gray-200 rounded">↑/↓</kbd> -
//                   Navigate between fields
//                 </li>
//                 <li>
//                   <kbd className="px-1 py-0.5 bg-gray-200 rounded">Tab</kbd> -
//                   Standard navigation
//                 </li>
//               </ul>
//             </div>
//           </form>
//         </main>
//       </div>
//     </>
//   );
// }
// // "use client";
// // import { useState } from "react";
// // import { AIState } from "../../config/AIConfig";
// // import ShowData from "./components/ShowData";

// // export default function LocationForm() {
// //   const [formData, setFormData] = useState({
// //     stateName: "",
// //     countryName: "",
// //   });
// //   const [errors, setErrors] = useState({});
// //   const [submitted, setSubmitted] = useState(false);
// //   const [data, setData] = useState("");

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: value,
// //     }));

// //     // Clear error when user starts typing
// //     if (errors[name]) {
// //       setErrors((prev) => ({
// //         ...prev,
// //         [name]: "",
// //       }));
// //     }
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};

// //     if (!formData.stateName.trim()) {
// //       newErrors.stateName = "State name is required";
// //     }

// //     if (!formData.countryName.trim()) {
// //       newErrors.countryName = "Country name is required";
// //     }

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleKeyPress = (e) => {
// //     if (e.key === "Enter") {
// //       handleSubmit(e);
// //     } else if (e.key === "Escape") {
// //       handleReset();
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     if (e) e.preventDefault();

// //     if (!validateForm()) return;

// //     console.log("Form submitted:", formData);
// //     const prompt = `give me list of cities in given state:${formData.stateName},country:${formData.countryName}.include cities,short description,history,famous for. in json formate`;
// //     try {
// //       const result = await AIState.sendMessage(prompt);
// //       const response = await result.response.text();
// //       const josn = JSON.parse(response);
// //       setData(josn);
// //       setSubmitted(true); // ✅ This line is important
// //       console.log(response);
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   const handleReset = () => {
// //     setFormData({
// //       stateName: "",
// //       countryName: "",
// //     });
// //     setErrors({});
// //   };

// //   if (submitted) {
// //     return (
// //       <>
// //         <ShowData
// //           data={data}
// //           state={formData.stateName}
// //           setSubmitted={setSubmitted}
// //         />
// //       </>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// //       <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md">
// //         <div className="mb-6">
// //           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
// //             Location Information
// //           </h1>
// //           <p className="text-gray-600 text-center text-sm sm:text-base">
// //             Please enter your state and country details
// //           </p>
// //         </div>

// //         <div className="space-y-6">
// //           {/* State Name Field */}
// //           <div>
// //             <label
// //               htmlFor="stateName"
// //               className="block text-sm font-medium text-gray-700 mb-2"
// //             >
// //               State Name{" "}
// //               <span className="text-red-500" aria-label="required">
// //                 *
// //               </span>
// //             </label>
// //             <input
// //               type="text"
// //               id="stateName"
// //               name="stateName"
// //               value={formData.stateName}
// //               onChange={handleInputChange}
// //               onKeyDown={handleKeyPress}
// //               aria-required="true"
// //               aria-invalid={errors.stateName ? "true" : "false"}
// //               aria-describedby={
// //                 errors.stateName ? "stateName-error" : undefined
// //               }
// //               className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition duration-200 ${
// //                 errors.stateName
// //                   ? "border-red-300 focus:ring-red-500 focus:border-red-500"
// //                   : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
// //               }`}
// //               placeholder="Enter state name"
// //             />
// //             {errors.stateName && (
// //               <p
// //                 id="stateName-error"
// //                 className="mt-1 text-sm text-red-600"
// //                 role="alert"
// //               >
// //                 {errors.stateName}
// //               </p>
// //             )}
// //           </div>

// //           {/* Country Name Field */}
// //           <div>
// //             <label
// //               htmlFor="countryName"
// //               className="block text-sm font-medium text-gray-700 mb-2"
// //             >
// //               Country Name{" "}
// //               <span className="text-red-500" aria-label="required">
// //                 *
// //               </span>
// //             </label>
// //             <input
// //               type="text"
// //               id="countryName"
// //               name="countryName"
// //               value={formData.countryName}
// //               onChange={handleInputChange}
// //               aria-required="true"
// //               aria-invalid={errors.countryName ? "true" : "false"}
// //               aria-describedby={
// //                 errors.countryName ? "countryName-error" : undefined
// //               }
// //               className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition duration-200 ${
// //                 errors.countryName
// //                   ? "border-red-300 focus:ring-red-500 focus:border-red-500"
// //                   : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
// //               }`}
// //               placeholder="Enter country name"
// //             />
// //             {errors.countryName && (
// //               <p
// //                 id="countryName-error"
// //                 className="mt-1 text-sm text-red-600"
// //                 role="alert"
// //               >
// //                 {errors.countryName}
// //               </p>
// //             )}
// //           </div>

// //           {/* Form Actions */}
// //           <div className="flex flex-col sm:flex-row gap-3">
// //             <button
// //               type="button"
// //               onClick={handleSubmit}
// //               className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 font-medium"
// //             >
// //               Submit
// //             </button>
// //             <button
// //               type="button"
// //               onClick={handleReset}
// //               className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 font-medium"
// //             >
// //               Reset
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
