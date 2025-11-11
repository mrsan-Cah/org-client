import React, { useState, useEffect } from "react";
import axios from "axios";
import ViewNotes from "./ViewNotes.jsx";
import { FiMenu, FiX, FiUser, FiBook, FiSend } from "react-icons/fi";

function StudentDashboard() {
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  const [year, setYear] = useState(studentData.year);
  const [semester, setSemester] = useState(studentData.semester);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [noteRequest, setNoteRequest] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("studentData");
    window.location.href = "/";
  };

  const handleRequestNotes = async (e) => {
    e.preventDefault();
    if (!noteRequest.trim()) {
      alert("Please enter a subject or topic for your request.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/noteRequests", {
        studentName: studentData.name,
        rollNo: studentData.rollNo,
        department: studentData.department,
        year,
        semester,
        topic: noteRequest,
      });

      if (response.status === 201) {
        alert(`Your request for notes on "${noteRequest}" has been submitted successfully!`);
        setNoteRequest("");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to send note request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0fdfa, #dcfce7, #bbf7d0)",
      fontFamily: "'Poppins', sans-serif",
      paddingBottom: "60px",
    },
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "linear-gradient(90deg, #15803d, #16a34a, #22c55e)",
      color: "#fff",
      padding: "18px 28px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    navLinks: { display: "flex", alignItems: "center", gap: "20px", fontSize: "17px" },
    logoutButton: {
      background: "linear-gradient(90deg, #ef4444, #dc2626)",
      color: "#fff",
      border: "none",
      padding: "10px 22px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "600",
      boxShadow: "0 3px 8px rgba(239,68,68,0.3)",
    },
    button: {
      background: "linear-gradient(90deg, #22c55e, #16a34a)",
      color: "#fff",
      border: "none",
      padding: "10px 22px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "600",
      boxShadow: "0 3px 8px rgba(34,197,94,0.3)",
    },
    sectionContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "30px",
      margin: "40px auto",
      maxWidth: "1200px",
      padding: "0 16px",
    },
    card: {
      background: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(12px)",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      flex: "1 1 450px",
      transition: "all 0.3s ease",
    },
    cardTitle: {
      fontSize: "22px",
      fontWeight: "700",
      marginBottom: "18px",
      color: "#065f46",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderBottom: "2px solid #16a34a",
      paddingBottom: "6px",
    },
    inputContainer: {
      display: "flex",
      gap: "14px",
      flexWrap: "wrap",
      marginTop: "10px",
    },
    input: {
      flex: "1",
      padding: "10px 16px",
      borderRadius: "12px",
      border: "1px solid #d1d5db",
      outline: "none",
      fontSize: "15px",
    },
    viewNotesContainer: {
      background: "#fff",
      borderRadius: "20px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      padding: "24px",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={{ fontSize: "22px", fontWeight: "700" }}>Student Dashboard</h1>
        {isMobile ? (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}
          >
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        ) : (
          <div style={styles.navLinks}>
            <span>Welcome, {studentData.name}</span>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Student Info & Request Notes */}
      <div style={styles.sectionContainer}>
        {/* Student Info */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <FiUser /> Student Information
          </h2>
          <p><strong>Roll No:</strong> {studentData.rollNo}</p>
          <p><strong>Department:</strong> {studentData.department}</p>
          <div style={styles.inputContainer}>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
              style={styles.input}
            />
            <input
              type="number"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="Semester"
              style={styles.input}
            />
          </div>
        </div>

        {/* Request Notes */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <FiSend /> Request Notes
          </h2>
          <form onSubmit={handleRequestNotes}>
            <input
              type="text"
              value={noteRequest}
              onChange={(e) => setNoteRequest(e.target.value)}
              placeholder="Enter subject or topic name"
              style={styles.input}
              required
            />
            <button
              type="submit"
              style={{ ...styles.button, marginTop: "12px" }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>

      {/* View Notes Section */}
      <div style={{ ...styles.sectionContainer, flexDirection: "column" }}>
        <div style={styles.viewNotesContainer}>
          <h2 style={styles.cardTitle}>
            <FiBook /> View Notes
          </h2>
          <ViewNotes department={studentData.department} year={year} semester={semester} />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
