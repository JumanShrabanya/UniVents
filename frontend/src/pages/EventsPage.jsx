import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import EventCard from "../components/EventCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faCalendarAlt,
  faMapMarkerAlt,
  faBuilding,
  faTimes,
  faSortAmountDown,
  faSortAmountUp,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title"); // "title" or "college"
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date"); // "date", "title", "organizer"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [availabilityFilter, setAvailabilityFilter] = useState("open"); // default to open; options: "all", "open", "closed"

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [eventsPerPage, setEventsPerPage] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // Fetch all events on component mount
  useEffect(() => {
    fetchAllEvents();
  }, []);

  // Apply filters and sorting when events or filters change
  useEffect(() => {
    applyFiltersAndSort();
  }, [events, searchQuery, searchType, sortBy, sortOrder, availabilityFilter]);

  const fetchAllEvents = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (availabilityFilter !== "all") {
        params.registrationAvailable = availabilityFilter === "open"; // hint to backend
      }
      const response = await axios.get("https://univents-backend.vercel.app/api/v1/event/", {
        params,
      });

      const { events: fetchedEvents, pagination } = response.data.data;
      setEvents(fetchedEvents || []);
      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
      setTotalEvents(pagination.totalEvents);
      setEventsPerPage(pagination.eventsPerPage);
      setHasNextPage(pagination.hasNextPage);
      setHasPrevPage(pagination.hasPrevPage);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to fetch events. Please try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (page = 1, limit = 10) => {
    if (!searchQuery.trim()) {
      fetchAllEvents(page, limit);
      return;
    }

    setLoading(true);
    try {
      const params = { search: searchQuery, page, limit };
      if (availabilityFilter !== "all") {
        params.registrationAvailable = availabilityFilter === "open";
      }
      const response = await axios.get("https://univents-backend.vercel.app/api/v1/event/", {
        params,
      });

      const { events: fetchedEvents, pagination } = response.data.data;
      setEvents(fetchedEvents || []);
      setCurrentPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
      setTotalEvents(pagination.totalEvents);
      setEventsPerPage(pagination.eventsPerPage);
      setHasNextPage(pagination.hasNextPage);
      setHasPrevPage(pagination.hasPrevPage);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "No events found");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...events];

    // Apply availability filter
    if (availabilityFilter !== "all") {
      filtered = filtered.filter((event) => {
        if (availabilityFilter === "open") return event.registrationAvailable;
        if (availabilityFilter === "closed")
          return !event.registrationAvailable;
        return true;
      });
    }

    // Apply search filter (client-side filtering for current page)
    if (searchQuery.trim()) {
      filtered = filtered.filter((event) => {
        const query = searchQuery.toLowerCase();
        if (searchType === "title") {
          return (
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query)
          );
        } else if (searchType === "college") {
          // normalize potential shapes: organizer.collegeName, organizer.college, event.collegeName
          const orgCollege = event.organizer?.collegeName || event.organizer?.college || "";
          const eventCollege = event.collegeName || "";
          return (
            orgCollege.toLowerCase().includes(query) ||
            eventCollege.toLowerCase().includes(query)
          );
        }
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.eventDate);
          bValue = new Date(b.eventDate);
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "organizer":
          aValue = a.organizer?.clubName?.toLowerCase() || "";
          bValue = b.organizer?.clubName?.toLowerCase() || "";
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredEvents(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSearchType("title");
    setSortBy("date");
    setSortOrder("asc");
    setAvailabilityFilter("open");
    setCurrentPage(1);
    fetchAllEvents(1, eventsPerPage);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      handleSearch(1, eventsPerPage);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (searchQuery.trim()) {
      handleSearch(newPage, eventsPerPage);
    } else {
      fetchAllEvents(newPage, eventsPerPage);
    }
  };

  const handleLimitChange = (newLimit) => {
    setEventsPerPage(newLimit);
    setCurrentPage(1);
    if (searchQuery.trim()) {
      handleSearch(1, newLimit);
    } else {
      fetchAllEvents(1, newLimit);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl text-black md:text-5xl font-bold mb-4">
              Discover Amazing Events
            </h1>
            <p className="text-lg text-zinc-400 text-indigo-100 max-w-2xl mx-auto">
              Find and join exciting events happening around you. Search by
              event title or college name.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={`Search ${
                  searchType === "title"
                    ? "events by title"
                    : "events by college name"
                }...`}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div className="flex gap-2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="title">Search by Title</option>
                <option value="college">Search by College</option>
              </select>

              <button
                onClick={() => {
                  setCurrentPage(1);
                  handleSearch(1, eventsPerPage);
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
              >
                Search
              </button>
            </div>
          </div>

          {/* Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faFilter} />
              <span>Filters & Sort</span>
            </button>

            {(searchQuery ||
              availabilityFilter !== "all" ||
              sortBy !== "date") && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faTimes} />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Status
                  </label>
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Events</option>
                    <option value="open">Registration Open</option>
                    <option value="closed">Registration Closed</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="date">Event Date</option>
                    <option value="title">Event Title</option>
                    <option value="organizer">Organizer</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortOrder("asc")}
                      className={`flex-1 px-3 py-2 rounded-lg border transition-colors duration-200 ${
                        sortOrder === "asc"
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <FontAwesomeIcon icon={faSortAmountUp} className="mr-2" />
                      Ascending
                    </button>
                    <button
                      onClick={() => setSortOrder("desc")}
                      className={`flex-1 px-3 py-2 rounded-lg border transition-colors duration-200 ${
                        sortOrder === "desc"
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={faSortAmountDown}
                        className="mr-2"
                      />
                      Descending
                    </button>
                  </div>
                </div>

                {/* Events Per Page */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Events Per Page
                  </label>
                  <select
                    value={eventsPerPage}
                    onChange={(e) =>
                      handleLimitChange(parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {loading
                  ? "Searching..."
                  : `${filteredEvents.length} Event${filteredEvents.length !== 1 ? "s" : ""} Found`}
              </h2>
              {searchQuery && (
                <p className="text-gray-600 mt-1">
                  Showing results for "{searchQuery}" in{" "}
                  {searchType === "title" ? "event titles" : "college names"}
                </p>
              )}
              {!searchQuery && !loading && totalEvents === 0 && (
                <p className="text-gray-600 mt-1">
                  Browse through all available events or use the search above to
                  find specific events
                </p>
              )}
            </div>

            {totalEvents > 0 && (
              <div className="text-sm text-gray-500">
                {availabilityFilter !== "all" && (
                  <span className="inline-block bg-gray-100 px-3 py-1 rounded-full mr-2">
                    {availabilityFilter === "open"
                      ? "Registration Open"
                      : "Registration Closed"}
                  </span>
                )}
                <span className="inline-block bg-gray-100 px-3 py-1 rounded-full">
                  Sorted by {sortBy} ({sortOrder})
                </span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faTimes} className="text-red-400 mr-3" />
                <p className="text-red-800">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {/* Events Grid */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((item, index) => (
                    <EventCard key={index} item={item} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="text-6xl"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {searchQuery ? "No events found" : "No events available"}
                    </h3>
                    <p className="text-gray-600">
                      {searchQuery
                        ? "Try adjusting your search criteria or filters."
                        : "There are currently no events posted. Check back later for exciting events!"}
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {(currentPage - 1) * eventsPerPage + 1} to{" "}
                    {Math.min(currentPage * eventsPerPage, totalEvents)} of{" "}
                    {totalEvents} events
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevPage}
                      className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                        hasPrevPage
                          ? "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                                currentPage === pageNum
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                      className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                        hasNextPage
                          ? "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
