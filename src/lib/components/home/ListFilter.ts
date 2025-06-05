import {
  exampleReports,
  InterestReport,
  ir,
  Report,
} from "@/lib/api/interfaces/report";
import { useEffect, useState } from "react";

export const listFilter = (filter: string, asc: boolean) => {
  const [reportList, setReportList] = useState<Report[]>(exampleReports);
  const [favoriteReport, setFavoriteReport] = useState<InterestReport[]>(ir);
  const [viewList, setViewList] = useState<Report[]>();

  const sortByDate = <T>(list: T[], key: keyof T) =>
    list
      .slice()
      .sort((a, b) =>
        asc
          ? new Date(a[key] as string).getTime() -
            new Date(b[key] as string).getTime()
          : new Date(b[key] as string).getTime() -
            new Date(a[key] as string).getTime()
      );

  const recentCreate = sortByDate(reportList, "createAt");
  const recentUpdate = sortByDate(reportList, "updateAt");
  const recentInterest = sortByDate(favoriteReport, "checkTime");

  useEffect(() => {
    try {
      const fetchReports = async () => {
        // const data = await getReports();
        // setReportList(data || [])
        // const interestData = await getInterestReports();
        // setFavoriteReport(interestData || [])
      };
      fetchReports();
    } catch (error) {
      console.log("fetching error", error);
    }
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setViewList(recentCreate);
    }
    if (filter === "recent") {
      setViewList(recentUpdate);
    }
    if (filter === "favorite") {
      const list: Report[] = recentInterest.map((report) => report.report);
      setViewList(list);
    }
  }, [filter, asc]);

  return viewList;
};
