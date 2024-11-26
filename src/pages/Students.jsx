import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

const Students = () => {
  const { userId } = useContext(AuthContext);
  const [students, setStudents] = useState([]); // Holds combined leads and contacts
  const [filteredStudents, setFilteredStudents] = useState([]); // Holds filtered data for search
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 10; // Number of items per page
  const [searchQuery, setSearchQuery] = useState(""); // Search input

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}ambassadors/leads?Ambassador=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userId}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("No records found for the provided Ambassador.");
          }
          throw new Error("Failed to fetch students.");
        }

        const data = await response.json(); // Parse the JSON data
        console.log("Fetched data:", data);

        const formatDateTime = (dateTime) => {
          if (!dateTime) return "N/A"; // Handle null or undefined Created_Time
          const date = new Date(dateTime);
          const formattedDate = date.toISOString().slice(0, 10); // Extract YYYY-MM-DD
          return `${formattedDate}`;
        };

        // Combine leads and contacts into one array
        const combinedData = [
          ...(data.leads || []).map((lead) => ({
            name: lead.Full_Name || "N/A",
            email: lead.Email || "N/A",
            createdTime: formatDateTime(lead.Created_Time), // Format Created_Time
            Contract_Date: lead.Contract_Date || "N/A",
          })),
          ...(data.contacts || []).map((contact) => ({
            name: contact.Full_Name || "N/A",
            email: contact.Email || "N/A",
            createdTime: formatDateTime(contact.Created_Time), // Format Created_Time
            Contract_Date: contact.Contract_Date || "N/A",
          })),
        ];

        setStudents(combinedData); // Update the students state
        setFilteredStudents(combinedData); // Initialize filtered data
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err.message); // Set error message for popup
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    if (userId) {
      fetchStudents();
    }
  }, [userId]);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  // Get current page data for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const closeErrorPopup = () => setError(""); // Close popup handler

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center mt-8">
        Students
      </h1>

      {/* Error Popup */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-4 rounded shadow-lg z-50">
          <p>{error}</p>
          <button
            onClick={closeErrorPopup}
            className="mt-2 bg-white text-red-500 px-4 py-2 rounded font-semibold hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      )}

      {/* Spinner */}
      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="w-12 h-12 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
        </div>
      )}

      {/* Students Table with Search and Pagination */}
      {!loading && (
        <div className="w-full max-w-4xl mx-auto bg-white rounded shadow-lg p-6">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {filteredStudents.length > 0 ? (
            <>
              <table className="w-full text-center border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="px-4 py-2 border-b border-gray-300">Name</th>
                    <th className="px-4 py-2 border-b border-gray-300">Email</th>
                    <th className="px-4 py-2 border-b border-gray-300">
                      Created Time
                    </th>
                    <th className="px-4 py-2 border-b border-gray-300">Contract Signed</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-2 border-b border-gray-300">
                        {student.name}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        {student.email}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        {student.createdTime}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-300">
                        {student.Contract_Date? student.Contract_Date : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <p>
                  Page {currentPage} of {totalPages}
                </p>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-600 mt-4 text-center">
              No students to display.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Students;
