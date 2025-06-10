import { getFavoriteReports, getReports } from "@/lib/api/get";
import { ReportDetail } from "@/lib/api/interfaces/report";
import { useEffect, useState } from "react";

export const listFilter = (filter: string, asc: boolean) => {
  const [reportList, setReportList] = useState<ReportDetail[]>([]);

  useEffect(() => {
    try {
      const fetchReports = async () => {
        if (filter === "all") {
          const data = await getReports({
            sortField: "createdAt",
            direction: asc ? "ASC" : "DESC",
          });
          setReportList(data || []);
        }
        if (filter === "recent") {
          const data = await getReports({
            sortField: "updatedAt",
            direction: asc ? "ASC" : "DESC",
          });
          setReportList(data || []);
        }
        if (filter === "favorite") {
          const data = await getFavoriteReports({
            sortField: "updatedAt",
            direction: asc ? "ASC" : "DESC",
          });
          setReportList(data || []);
        }
      };
      fetchReports();
    } catch (error) {
      console.log("fetching error", error);
    }
  }, [filter, asc]);

  return reportList;
};
