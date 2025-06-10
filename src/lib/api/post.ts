import { PartialESGData } from "../interface";
import { apiClient } from "./client";
import { InteresrtChartDetail } from "./interfaces/chart";
import { ESGData } from "./interfaces/esgData";

export const postESGData = async (data: PartialESGData) => {
  try {
    const response = await apiClient.post(`/esg-data/data-value`, data);
    return response.data;
  } catch (error) {
    console.log("data post error");
  }
};

export const postInterestChart = async (chartId: string) => {
  try {
    const res = await apiClient.post(`/interest-charts`, { chartId });
    console.log("Interest Chart data:", res.data);
    return res.data;
  } catch (error) {
    console.error("관심 차트 등록 실패");
  }
};
