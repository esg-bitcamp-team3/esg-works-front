
"use client";
import React, { useState } from "react";

export default function ListFilter({ filter,setFilter }: { filter: string; setFilter: (f: string) => void }) {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <button
        onClick={() => setFilter("all")}
        style={{color:filter === "all" ? "#2F6EEA" : "#000" }}
      >
        모두
      </button>
      <button
        onClick={() => setFilter("recent")}
        style={{color:filter === "recent" ? "#2F6EEA" : "#000" }}
        >
          최근에 변경
        </button>
      <button
        onClick={() => setFilter("interest")}
        style={{color:filter === "interest" ? "#2F6EEA" : "#000" }}
      >
        즐겨찾기
      </button>
    </div>
  );
}