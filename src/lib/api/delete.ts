import { apiClient } from "./client";

export const deleteInterestReports = async (reportId: string) => {
  try {
    const res = await apiClient.delete(`/interest-reports/${reportId}`);
    return res.data;
  } catch (error) {
    console.log("즐겨찾기 리포트 삭제 실패", error);
  }
};
