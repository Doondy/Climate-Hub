import React, { useEffect, useState } from "react";
import { getAbsenceRequests } from "../../services/wellnessService.js";

const AbsenceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getAbsenceRequests();
        setRequests(res.data || []);
      } catch (err) {
        console.error("Error fetching absence requests:", err);
        setError("Failed to load absence requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading absence requests...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Absence Requests</h2>

      {requests.length === 0 ? (
        <p>No absence requests found</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={index}>
                <td>{req.employeeName}</td>
                <td>{req.date}</td>
                <td>{req.reason}</td>
                <td>{req.status || "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AbsenceRequests;