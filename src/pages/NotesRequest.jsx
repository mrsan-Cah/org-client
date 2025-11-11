import React, { useEffect, useState } from "react";
import axios from "axios";

function NotesRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes/requests");
      setRequests(res.data);
    } catch (error) {
      console.error("Error fetching note requests:", error);
      alert("Failed to load note requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/notes/requests/${id}`);
      setRequests(requests.filter((req) => req._id !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  if (loading) return <p>Loading note requests...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "20px" }}>
        📩 Notes Requests
      </h2>
      {requests.length === 0 ? (
        <p>No note requests found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <thead style={{ background: "#16a34a", color: "#fff" }}>
            <tr>
              <th style={th}>Student Name</th>
              <th style={th}>Roll No</th>
              <th style={th}>Department</th>
              <th style={th}>Year</th>
              <th style={th}>Semester</th>
              <th style={th}>Topic</th>
              <th style={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} style={{ textAlign: "center" }}>
                <td style={td}>{req.studentName}</td>
                <td style={td}>{req.rollNo}</td>
                <td style={td}>{req.department}</td>
                <td style={td}>{req.year}</td>
                <td style={td}>{req.semester}</td>
                <td style={td}>{req.topic}</td>
                <td style={td}>
                  <button
                    onClick={() => handleDelete(req._id)}
                    style={{
                      background: "#EF4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = { padding: "12px", borderBottom: "1px solid #ddd" };
const td = { padding: "10px", borderBottom: "1px solid #eee" };

export default NotesRequest;
