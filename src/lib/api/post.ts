import { PartialESGData } from "../interface";
import { apiClient } from "./client";
import { ESGData } from "./interfaces/esgData";

export const postESGData = async (data: PartialESGData) => {
  try {
    const response = await apiClient.post(`/esg-data/data-value`, data);
    return response.data;
  } catch (error) {
    console.log("data post error");
  }
};

export const postInterestReports = async (reportId: string) => {
  try {
    const res = await apiClient.post(`/interest-reports/${reportId}`);
    return res.data;
  } catch (error) {
    console.log("즐겨찾기 리포트 등록 실패", error);
  }
};
