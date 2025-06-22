"use client";
import { useEffect, useState } from "react";

export default function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);
  useEffect(() => {
    fetch("https://api.countapi.xyz/hit/minimalist-portfolio/visits")
      .then((res) => res.json())
      .then((data) => setViews(data.value));
  }, []);
  return (
    <div style={{ textAlign: "center", marginTop: "2rem", color: "#888", fontSize: "0.95rem" }}>
      {views !== null ? `👁️ ${views} page views` : "Loading views..."}
    </div>
  );
}

