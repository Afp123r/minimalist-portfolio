"use client";
import { useEffect, useState } from "react";

export default function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("https://api.countapi.xyz/hit/minimalist-portfolio/visits")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("CountAPI response:", data);
        if (typeof data.value === "number") {
          setViews(data.value);
        } else {
          setError("CountAPI returned invalid data: " + JSON.stringify(data));
        }
      })
      .catch((err) => {
        setError("Failed to load view count. " + err);
        console.error("CountAPI error:", err);
      });
  }, []);
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "2rem",
        color: "#888",
        fontSize: "0.95rem",
      }}
    >
      {error
        ? error
        : views !== null
        ? `👁️ ${views} page views`
        : "Loading views..."}
    </div>
  );
}
