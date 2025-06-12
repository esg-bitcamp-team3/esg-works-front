// import {
//   exampleReports,
//   InterestReport,
//   ir,
//   Report,
// } from "@/lib/api/interfaces/report";
// import { useEffect, useState } from "react";

// export const listFilter = (filter: string) => {
//   const [reportList, setReportList] = useState<Report[]>(exampleReports);
//   const [favoriteReport, setFavoriteReport] = useState<InterestReport[]>(ir);
//   const [viewList, setViewList] = useState<Report[]>();

//   const recentCreate = reportList
//     .slice()
//     .sort(
//       (a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
//     );

//   const recentUpdate = reportList
//     .slice()
//     .sort(
//       (a, b) => new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime()
//     );

//   const recentInterest = favoriteReport
//     .slice()
//     .sort(
//       (a, b) =>
//         new Date(b.checkTime).getTime() - new Date(a.checkTime).getTime()
//     );

//   useEffect(() => {
//     try {
//       const fetchReports = async () => {
//         // const data = await getReports();
//         // setReportList(data || [])
//         // const interestData = await getInterestReports();
//         // setFavoriteReport(interestData || [])
//       };
//       fetchReports();
//     } catch (error) {
//       console.log("fetching error", error);
//     }
//   }, []);

//   useEffect(() => {
//     if (filter === "all") {
//       setViewList(recentCreate);
//     }
//     if (filter === "recent") {
//       setViewList(recentUpdate);
//     }
//     if (filter === "favorite") {
//       const list: Report[] = recentInterest.map((report) => report.report);
//       setViewList(list);
//     }
//   }, [filter]);

//   return viewList;
// };

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