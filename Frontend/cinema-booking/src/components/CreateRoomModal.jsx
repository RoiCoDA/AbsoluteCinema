import React, { useState, useEffect } from "react";
import {
  MapPin,
  Building2,
  Loader2,
  CheckCircle,
  X,
  Search,
  AlertCircle,
} from "lucide-react"; // Added AlertCircle
import { MockDatabase } from "../services/mockApi";

export default function CreateRoomModal({ movieId, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState([]);
  const [cityQuery, setCityQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [partner, setPartner] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    MockDatabase.getCities().then(setCities);
  }, []);

  const filteredCities = cities.filter(
    (c) =>
      c.cityNameEn.toLowerCase().includes(cityQuery.toLowerCase()) ||
      c.cityNameHe.includes(cityQuery)
  );

  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    setStep(2);
    const result = await MockDatabase.getLocationsForCity(city.cityId);
    setPartner(result);
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!selectedLocation || !partner || !partner.company) return;
    setIsSubmitting(true);

    await MockDatabase.createRoomA({
      movieId,
      cityId: selectedCity.cityId,
      companyId: partner.company.companyId,
      locationId: selectedLocation.companyLocationId,
    });

    setIsSubmitting(false);
    setStep(4);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="text-lg font-bold text-white">Start a Screening</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 min-h-[300px]">
          {/* STEP 1: SELECT CITY */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-slate-400 text-sm">
                Select a city where you'd like to host this movie.
              </p>

              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="text-slate-500" size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Search city (e.g. Tel Aviv)..."
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  autoFocus
                />
              </div>

              <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city.cityId}
                      onClick={() => handleCitySelect(city)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-emerald-500/50 group"
                    >
                      <div className="text-left">
                        <span className="font-bold text-slate-200 block">
                          {city.cityNameEn}
                        </span>
                        <span className="text-xs text-slate-500">
                          {city.cityNameHe}
                        </span>
                      </div>
                      <MapPin
                        size={16}
                        className="text-slate-500 group-hover:text-emerald-400"
                      />
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No cities found matching "{cityQuery}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: LOADING */}
          {step === 2 && (
            <div className="flex flex-col items-center justify-center h-full py-12 space-y-4">
              <Loader2 className="animate-spin text-emerald-500" size={48} />
              <div className="text-center">
                <h3 className="text-white font-bold text-lg">
                  Contacting Venues...
                </h3>
                <p className="text-slate-500 text-sm">
                  Searching for available halls in {selectedCity?.cityNameEn}
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT LOCATION (Safe Mode) */}
          {step === 3 && partner && (
            <div className="space-y-6">
              {/* CRASH FIX: Check if company exists first */}
              {!partner.company ? (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                    <AlertCircle className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">
                      No Partners Available
                    </h3>
                    <p className="text-slate-400 text-sm mt-1 max-w-[200px] mx-auto">
                      We currently don't have any partner cinemas in{" "}
                      {selectedCity?.cityNameEn}.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-emerald-400 text-sm font-bold hover:underline"
                  >
                    Try another city
                  </button>
                </div>
              ) : (
                <>
                  {/* Valid Partner Found */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="text-slate-900" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-400 uppercase font-bold tracking-wider">
                        Partner Found
                      </div>
                      <div className="text-white font-bold">
                        {partner.company.companyName}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">Select a location:</p>
                    {partner.locations.map((loc) => (
                      <button
                        key={loc.companyLocationId}
                        onClick={() => setSelectedLocation(loc)}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          selectedLocation?.companyLocationId ===
                          loc.companyLocationId
                            ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        <div className="font-bold text-sm">
                          {loc.locationName}
                        </div>
                        <div className="text-xs opacity-70 truncate">
                          {loc.address}
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!selectedLocation || isSubmitting}
                    className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors flex justify-center"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Create Proposal"
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center h-full py-8 space-y-6 text-center animate-in fade-in slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <CheckCircle className="text-slate-900" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Proposal Live!
                </h3>
                <p className="text-slate-400 text-sm max-w-[250px] mx-auto">
                  Your Room A is now active. Share it with friends to reach the
                  vote goal!
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-emerald-400 font-bold hover:underline"
              >
                Close & View Room
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
