import { ESGDataInput } from "../interface";
import { apiClient } from "./client";
import {
  InputCategory,
  InputCriterion,
  InputSection,
} from "./interfaces/criterion";
import {
  Chart,
  InputChart,
  InputDataSet,
  InteresrtChartDetail,
} from "./interfaces/chart";
import { DataSet } from "./interfaces/dataSets";

export const postESGData = async (data: Partial<ESGDataInput>) => {
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
export const postCriterion = async (data: InputCriterion) => {
  try {
    const res = await apiClient.post(`/criteria`, data);
    return res.data;
  } catch (error) {
    console.log("기준 등록 실패", error);
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

export const postDataSet = async (data: Record<string, any>) => {
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

export const postSection = async (data: Partial<InputSection>) => {
  try {
    const res = await apiClient.post(`/sections`, data);
    return res.data;
  } catch (error) {
    console.log("세부 기준 등록 실패", error);
  }
};

export const postCategory = async (data: Partial<InputCategory>) => {
  try {
    const res = await apiClient.post(`/categories`, data);
    return res.data;
  } catch (error) {
    console.log("세부 기준 등록 실패", error);
  }
};
