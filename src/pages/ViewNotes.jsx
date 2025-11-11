import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewNotes({ department, year, semester }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Convert semester number to Roman
  const numberToRoman = { 1:"I", 2:"II", 3:"III", 4:"IV", 5:"V", 6:"VI", 7:"VII", 8:"VIII" };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/student/notes?department=${department}&year=${year}&semester=${semester}`
        );
        setNotes(res.data);
      } catch (err) {
        console.error(err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [department, year, semester]);

  // Internal CSS
  const styles = {
    container: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" },
    card: { backgroundColor: "#fff", padding: "20px", borderRadius: "20px", boxShadow: "0 6px 18px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "12px", cursor: "pointer", transition: "transform 0.3s, box-shadow 0.3s" },
    cardHover: { transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(0,0,0,0.15)" },
    title: { fontSize: "18px", fontWeight: "700", color: "#111827" },
    text: { fontSize: "14px", color: "#4b5563" },
    link: { color: "#2563eb", fontWeight: "500", textDecoration: "none", transition: "color 0.3s" },
    linkHover: { color: "#1d4ed8" },
    noNotes: { color: "#6b7280", fontSize: "16px", textAlign: "center", marginTop: "16px" },
    loading: { color: "#374151", fontSize: "16px", textAlign: "center", marginTop: "16px" }
  };

  if (loading) return <p style={styles.loading}>Loading notes...</p>;

  return (
    <div>
      {notes.length === 0 ? (
        <p style={styles.noNotes}>No notes available for Year {year} Semester {numberToRoman[semester]}.</p>
      ) : (
        <div style={styles.container}>
          {notes.map((note) => (
            <div
              key={note._id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = styles.card.boxShadow;
              }}
            >
              <h3 style={styles.title}>{note.title}</h3>
              <p style={styles.text}>
                Year: {note.year}, Semester: {numberToRoman[note.semester]}
              </p>
              <a
                href={note.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
                onMouseEnter={(e) => e.currentTarget.style.color = styles.linkHover.color}
                onMouseLeave={(e) => e.currentTarget.style.color = styles.link.color}
              >
                Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewNotes;
