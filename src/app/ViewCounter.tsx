"use client";
import { useEffect, useState } from "react";

export default function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch("https://api.visitorbadge.io/api/visitors?path=minimalist-portfolio&label=Page%20views")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // The API returns { count: number }
        console.log("VisitorBadge response:", data);
        if (typeof data.count === "number") {
          setViews(data.count);
        } else {
          setError("VisitorBadge returned invalid data: " + JSON.stringify(data));
        }
      })
      .catch((err) => {
        setError("Failed to load view count. " + err);
        console.error("VisitorBadge error:", err);
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
