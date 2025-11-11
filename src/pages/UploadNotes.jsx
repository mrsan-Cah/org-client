import React, { useState } from "react";
import axios from "axios";
import DepartmentSelector from "../components/DepartmentSelector.jsx";

function UploadNotes() {
  const [form, setForm] = useState({
    title: "",
    department: "CSE",
    year: 1,
    semester: "",
    file: null
  });
  const [message, setMessage] = useState("");

  const romanSemesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  const romanToNumber = { I:1, II:2, III:3, IV:4, V:5, VI:6, VII:7, VIII:8 };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, file: e.target.files[0] });
  const handleDepartmentChange = (dept) => setForm({ ...form, department: dept });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) return setMessage("Please select a PDF file.");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("department", form.department);
    formData.append("year", form.year); // numeric year
    formData.append("semester", romanToNumber[form.semester]); // numeric semester
    formData.append("file", form.file);

    try {
      const token = localStorage.getItem("adminToken");
      await axios.post("http://localhost:5000/api/admin/notes", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      setMessage("Note uploaded successfully!");
      setForm({ title: "", department: "CSE", year: 1, semester: "", file: null });
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    }
  };

  // Internal CSS
  const styles = {
    container: { display: "flex", justifyContent: "center", alignItems: "center", padding: "32px 16px", minHeight: "100vh", backgroundColor: "#f3f4f6", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    form: { width: "100%", maxWidth: "600px", backgroundColor: "#fff", borderRadius: "32px", padding: "32px 40px", display: "flex", flexDirection: "column", gap: "24px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" },
    title: { fontSize: "28px", fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: "8px" },
    input: { padding: "12px 16px", borderRadius: "24px", border: "1px solid #d1d5db", fontSize: "16px", outline: "none" },
    dropdown: { padding: "12px 16px", borderRadius: "24px", border: "1px solid #d1d5db", fontSize: "16px", outline: "none", cursor: "pointer" },
    yearSemesterContainer: { display: "flex", flexWrap: "wrap", gap: "16px" },
    fileInput: { padding: "12px 16px", borderRadius: "24px", border: "1px solid #d1d5db", fontSize: "16px", cursor: "pointer", outline: "none" },
    submitButton: { background: "linear-gradient(90deg, #6366f1, #8b5cf6)", color: "#fff", fontWeight: "600", padding: "12px", borderRadius: "24px", border: "none", cursor: "pointer", fontSize: "16px" },
    message: { textAlign: "center", color: "#16a34a", fontWeight: "600", marginTop: "8px" }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Upload Notes</h2>

        <input
          type="text"
          name="title"
          placeholder="Note Title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <DepartmentSelector value={form.department} onChange={handleDepartmentChange} style={styles.dropdown} />

        <div style={styles.yearSemesterContainer}>
          {/* Year dropdown numeric */}
          <select name="year" value={form.year} onChange={handleChange} required style={styles.dropdown}>
            <option value="">Select Year</option>
            {[1,2,3,4].map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          {/* Semester dropdown Roman */}
          <select name="semester" value={form.semester} onChange={handleChange} required style={styles.dropdown}>
            <option value="">Select Semester</option>
            {romanSemesters.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <input type="file" accept=".pdf" onChange={handleFileChange} required style={styles.fileInput} />

        <button type="submit" style={styles.submitButton}>Upload Note</button>
        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

export default UploadNotes;
