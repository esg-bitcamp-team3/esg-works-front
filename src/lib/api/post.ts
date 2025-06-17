import { PartialESGData } from "../interface";
import { apiClient } from "./client";
import { Chart, InputChart, InteresrtChartDetail } from "./interfaces/chart";
import { DataSet } from "./interfaces/dataSets";
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

export const postInterestChart = async (chartId: string) => {
  try {
    const res = await apiClient.post(`/interest-charts`, { chartId });
    console.log("Interest Chart data:", res.data);
    return res.data;
  } catch (error) {
    console.error("관심 차트 등록 실패");
  }
};

export const postDataSet = async (data: DataSet) => {
  try {
    const res = await apiClient.post(`/datasets`, data);
    console.log("dataSet 등록 성공:", res.data);
    return res.data;
  } catch (error) {
    console.log("DataSet Post Error", error);
  }
};

export const postChart = async (data: InputChart) => {
  try {
    const res = await apiClient.post(`/charts`, data);
    console.log("chart 등록 성공", res.data);
    return res.data;
  } catch (error) {
    console.error("Chart Post Error", error);
  }
};
