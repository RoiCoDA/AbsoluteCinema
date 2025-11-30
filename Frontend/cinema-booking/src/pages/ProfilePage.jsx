import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Globe,
  Edit2,
  Save,
  Ticket,
  Vote,
  Sparkles,
  Loader2,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { MockDatabase } from "../services/mockApi";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    homeCityId: "",
    language: "en",
  });

  const [cities, setCities] = useState([]);

  // Load Data
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      const [actData, cityData] = await Promise.all([
        MockDatabase.getUserActivity(user.userId),
        MockDatabase.getCities(),
      ]);
      setActivity(actData);
      setCities(cityData);

      // Init form with existing data or defaults
      setFormData({
        userName: user.userName || "",
        userFullName: user.userFullName || "",
        homeCityId: user.homeCityId || "",
        language: "en",
      });

      setLoading(false);
    };
    loadData();
  }, [user, navigate]);

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  if (loading || !user)
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center text-emerald-500">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );

  return (
    <div className="fixed inset-0 w-full h-full bg-slate-900 text-slate-100 font-sans overflow-y-auto overflow-x-hidden z-50">
      <Header />

      <main className="max-w-4xl mx-auto p-4 pb-20 space-y-8">
        {/* --- IDENTITY CARD --- */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center md:items-start relative">
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="absolute top-4 right-4 p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-emerald-400 transition-colors"
          >
            {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
          </button>

          {/* Avatar Circle */}
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl">
            {user.userFullName.charAt(0)}
          </div>

          {/* Info Fields */}
          <div className="flex-1 text-center md:text-left space-y-4 w-full">
            {/* Name & Phone */}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.userFullName}
              </h1>
              <p className="text-slate-400 font-mono text-sm">
                {user.userPhoneNumber}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username Field */}
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
                <User size={18} className="text-emerald-500" />
                {isEditing ? (
                  <input
                    className="bg-transparent border-b border-slate-600 focus:border-emerald-500 outline-none w-full text-sm"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Set Username"
                  />
                ) : (
                  <span className="text-sm">
                    {user.username || "No username set"}
                  </span>
                )}
              </div>

              {/* Location Field */}
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
                <MapPin size={18} className="text-emerald-500" />
                {isEditing ? (
                  <select
                    className="bg-transparent border-b border-slate-600 focus:border-emerald-500 outline-none w-full text-sm text-slate-300"
                    value={formData.homeCityId}
                    onChange={(e) =>
                      setFormData({ ...formData, homeCityId: e.target.value })
                    }
                  >
                    <option value="">Select Home City</option>
                    {cities.map((c) => (
                      <option key={c.cityId} value={c.cityId}>
                        {c.cityNameEn}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-sm">
                    {cities.find((c) => c.cityId === user.homeCityId)
                      ?.cityNameEn || "No location set"}
                  </span>
                )}
              </div>

              {/* Language Field */}
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
                <Globe size={18} className="text-emerald-500" />
                {isEditing ? (
                  <select
                    className="bg-transparent border-b border-slate-600 focus:border-emerald-500 outline-none w-full text-sm text-slate-300"
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
                  >
                    <option value="en">English</option>
                    <option value="he">Hebrew</option>
                    <option value="ru">Russian</option>
                    <option value="ar">Arabic</option>
                  </select>
                ) : (
                  <span className="text-sm uppercase">
                    {user.language || "EN"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* --- ACTIVITY DASHBOARD --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. TICKETS (Future) */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-300 flex items-center gap-2">
              <Ticket className="text-emerald-500" size={20} /> My Tickets
            </h3>
            {activity.tickets.length > 0 ? (
              <div className="space-y-3">
                {activity.tickets.map((t) => (
                  <div
                    key={t.id}
                    className="bg-slate-800 p-3 rounded-xl border-l-4 border-emerald-500 shadow-lg"
                  >
                    <div className="font-bold text-white text-sm">
                      {t.movieTitle}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {t.location}
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-700">
                      <span className="font-mono text-emerald-400 font-bold">
                        {t.seatLabel}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(t.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-600 italic">
                No upcoming tickets.
              </div>
            )}
          </div>

          {/* 2. PROPOSALS (Room A) */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-300 flex items-center gap-2">
              <Sparkles className="text-amber-500" size={20} /> My Proposals
            </h3>
            {activity.proposals.length > 0 ? (
              <div className="space-y-3">
                {activity.proposals.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-800 p-3 rounded-xl border border-slate-700"
                  >
                    <div className="font-bold text-white text-sm">
                      {p.movieTitle}
                    </div>
                    <div className="mt-2 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full transition-all duration-500"
                        style={{ width: `${(p.voteCount / p.target) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>{p.voteCount} votes</span>
                      <span>Goal: {p.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-600 italic">
                No active proposals.
              </div>
            )}
          </div>

          {/* 3. VOTES */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-300 flex items-center gap-2">
              <Vote className="text-blue-500" size={20} /> Voted For
            </h3>
            {activity.votes.length > 0 ? (
              <div className="space-y-3">
                {activity.votes.map((v) => (
                  <div
                    key={v.id}
                    className="bg-slate-800 p-3 rounded-xl flex items-center justify-between"
                  >
                    <span className="text-sm text-slate-300">
                      {v.movieTitle}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        v.roomStatus === "active"
                          ? "bg-blue-900 text-blue-300"
                          : "bg-emerald-900 text-emerald-300"
                      }`}
                    >
                      {v.roomStatus}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-600 italic">
                No voting history.
              </div>
            )}
          </div>
        </div>

        {/* LOGOUT BUTTON (Mobile style) */}
        <div className="pt-8 border-t border-slate-800 md:hidden">
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full flex items-center justify-center gap-2 text-red-400 font-bold p-4 bg-slate-800 rounded-xl"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
