import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import { AuthContext } from "../contexts/Authcontext";
import { GetRegisteredParticipants } from "../services/GetRegisteredParticipants";

const OrganizerEventDetailsPage = () => {
  const { userId, eventId } = useParams();
  const navigate = useNavigate();
  const { role, userDetails } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        // fetch event details
        const res = await axios.get(`http://localhost:8000/api/v1/event/${eventId}`);
        setEvent(res.data?.data || null);
        // fetch registrations
        const regs = await GetRegisteredParticipants(eventId);
        if (regs?.status === 200) {
          setParticipants(regs.data.data || []);
        } else {
          setParticipants([]);
        }
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    if (eventId) load();
  }, [eventId]);

  const filled = useMemo(() => participants.length || 0, [participants]);
  const capacity = useMemo(() => event?.availableSeats || 0, [event]);
  const pct = useMemo(() => (capacity ? Math.min((filled / capacity) * 100, 100) : 0), [filled, capacity]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter((p) => {
      const s = p?.studentId || {};
      return (
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        String(s.rollNo || "").toLowerCase().includes(q)
      );
    });
  }, [participants, query]);

  const goBack = () => navigate(`/dashboard/${userId}`);
  const publicUrl = useMemo(() => `${window.location.origin}/event/${eventId}`, [eventId]);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      alert("Link copied");
    } catch {
      alert(publicUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Event Details</h1>
            <p className="text-sm text-gray-500">Organizer dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={publicUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50">Open Public Page</a>
            <button onClick={copyLink} className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50">Copy Link</button>
            <button onClick={goBack} className="px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50">Back</button>
          </div>
        </div>

        {/* states */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800">{error}</div>
        )}

        {!loading && !error && event && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* left: event summary */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Summary</h2>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between"><span className="text-gray-500">Title</span><span className="font-medium text-right ml-3 line-clamp-1">{event.title}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Venue</span><span className="font-medium text-right ml-3">{event.venue}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium text-right ml-3">{new Date(event.eventDate).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Category</span><span className="font-medium text-right ml-3">{typeof event.category === 'object' ? event.category?.categoryTitle : event.category}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Availability</span><span className={`font-medium ml-3 ${event.registrationAvailable ? 'text-green-700' : 'text-gray-600'}`}>{event.registrationAvailable ? 'Open' : 'Closed'}</span></div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Registrations</h2>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-gray-600">Total registered</span>
                  <span className="font-semibold text-indigo-600">{filled} / {capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{Math.round(pct)}% filled</p>
              </div>
            </div>

            {/* right: participants table */}
            <div className="lg:col-span-2">
              {/* quick stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-500">Registered</div>
                  <div className="text-xl font-semibold text-gray-900">{filled}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-500">Capacity</div>
                  <div className="text-xl font-semibold text-gray-900">{capacity}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-500">Fill Rate</div>
                  <div className="text-xl font-semibold text-gray-900">{Math.round(pct)}%</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">Registered Participants</h2>
                  <div className="flex-1 max-w-sm ml-auto">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by name, email, roll no"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No participants registered yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Roll No</th>
                          <th className="text-left py-3 px-4">Semester</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((p, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="py-3 px-4 font-medium text-gray-900">{p.studentId?.name}</td>
                            <td className="py-3 px-4 text-gray-700">{p.studentId?.email}</td>
                            <td className="py-3 px-4 text-gray-700">{p.studentId?.rollNo || '—'}</td>
                            <td className="py-3 px-4 text-gray-700">{p.studentId?.semester || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerEventDetailsPage;
