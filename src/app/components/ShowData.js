"use client";
import React, { useState, useMemo } from "react";
import { Search, MapPin, Clock, Star, Filter } from "lucide-react";

const ShowData = ({ data, state, setSubmitted }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);

  const filteredData = useMemo(() => {
    return data.filter(
      (city) =>
        city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.famous_for.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  const getCityColor = (index) => {
    const colors = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-purple-500 to-pink-600",
      "from-yellow-500 to-orange-600",
      "from-indigo-500 to-blue-600",
      "from-pink-500 to-rose-600",
      "from-teal-500 to-green-600",
      "from-red-500 to-pink-600",
      "from-cyan-500 to-blue-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Explore {state}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the rich heritage, culture, and beauty of {state}&#39;s
              magnificent cities
            </p>
            <button
              className="bg-amber-400 p-5 rounded-2xl text-white"
              onClick={() => {
                setSubmitted(false);
              }}
            >
              Go Back
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search cities, attractions, or keywords..."
              className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-900 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((city, index) => (
            <div
              key={city.city}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
            >
              {/* City Header */}
              <div
                className={`h-32 bg-gradient-to-r ${getCityColor(
                  index
                )} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative h-full flex items-center justify-center">
                  <h2 className="text-2xl font-bold text-white text-center">
                    {city.city}
                  </h2>
                </div>
                <div className="absolute top-4 right-4">
                  <MapPin className="h-6 w-6 text-white opacity-80" />
                </div>
              </div>

              {/* City Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {city.description}
                </p>

                {/* Famous For Section */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="font-semibold text-gray-800 text-sm">
                      Famous For
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {city.famous_for}
                  </p>
                </div>

                {/* History Preview */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-semibold text-gray-800 text-sm">
                      History
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {city.history}
                  </p>
                </div>

                {/* Learn More Button */}
                <button
                  onClick={() => setSelectedCity(city)}
                  className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${getCityColor(
                    index
                  )} text-white font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No cities found
            </h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Modal for Selected City */}
      {selectedCity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div
              className={`h-40 bg-gradient-to-r ${getCityColor(
                data.findIndex((c) => c.city === selectedCity.city)
              )} relative`}
            >
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative h-full flex items-center justify-center">
                <h2 className="text-3xl font-bold text-white">
                  {selectedCity.city}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  About
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedCity.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <Clock className="h-5 w-5 text-green-500 mr-2" />
                  Historical Background
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedCity.history}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  What It&#39;s Famous For
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedCity.famous_for}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowData;
