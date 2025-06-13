import { Category, DataFilter, PartialESGData, Section } from "../interface";
import { apiClient } from "./client";
import { ESGData } from "./interfaces/esgData";
export async function getSearchSectionId(sectionId: string) {
  try {
    const response = await apiClient.get<Section[]>(
      `/sections/search/${sectionId}`
    );
    return response.data;
  } catch (error) {}
}

export async function getDataByCorpYear(data: DataFilter) {
  try {
    const response = await apiClient.get<PartialESGData>(
      `/esg-data/data-value`,
      {
        params: data,
      }
    );
    return response.data;
  } catch (error) {}
}

import { ChartDetail, InteresrtChartDetail } from "./interfaces/chart";

import { CategorizedESGDataList } from "./interfaces/categorizedEsgDataList";
import { CategoryDetail } from "./interfaces/categoryDetail";
import {
  InterestReport,
  Report,
  ReportDetail,
  SortProp,
} from "./interfaces/report";

export const getSections = async () => {
  try {
    const res = await apiClient.get<Section[]>("/sections");
    return res.data;
  } catch (error) {
    console.error("섹션 가져오기 실패:", error);
    return [];
  }
};

export const getCategories = async (sectionId: string) => {
  try {
    const res = await apiClient.get<CategoryDetail[]>(
      `/categories/by-section/${sectionId}`
    );
    return res.data;
  } catch (error) {
    console.error("카테고리 가져오기 실패:", error);
    return [];
  }
};

export const getEsgData = async (categoryId: string) => {
  try {
    const res = await apiClient.get<CategorizedESGDataList>(
      `/esg-data/category/${categoryId}`
    );
    console.log("보내는 categoryId:", categoryId);
    return res.data;
  } catch (error) {
    console.error("ESG 데이터 가져오기 실패:", error);
    return null;
  }
};

export const getChart = async () => {
  try {
    const res = await apiClient.get<ChartDetail[]>(`/charts/my/`);
    console.log("Chart data:", res.data);
    return res.data;
  } catch (error) {
    console.error("차트 가져오기 실패:", error);
    return null;
  }
};

export const getInterestChart = async () => {
  try {
    const res = await apiClient.get<InteresrtChartDetail[]>(
      `/interest-charts/my/`
    );
    console.log("Interest Chart data:", res.data);
    return res.data;
  } catch (error) {
    console.error("관심 차트 가져오기 실패:", error);
    return null;
  }
};

export const getChartByType = async (type: string) => {
  try {
    const res = await apiClient.get<ChartDetail[]>(`/charts/my/${type}`);
    console.log("Chart data:", res.data);
    return res.data;
  } catch (error) {
    console.error(`${type}인 차트 가져오기 실패:`, error);
    return null;
  }
};

export const getInterestChartByType = async (type: string) => {
  try {
    const res = await apiClient.get<InteresrtChartDetail[]>(
      `/interest-charts/my/${type}`
    );
    console.log("Interest Chart data:", res.data);
    return res.data;
  } catch (error) {
    console.error(`${type}인 관심 차트 가져오기 실패:`, error);
    return null;
  }
};

export const getCategory = async () => {
  try {
    const res = await apiClient.get<Category[]>("/categories");
    return res.data;
  } catch (error) {
    console.error("카테고리 리스트를 가져오지 못했습니다.");
    return null;
  }
};

// ==========================Report

export const getReports = async (sortProp: SortProp) => {
  try {
    const res = await apiClient.get<ReportDetail[]>("/reports/corp", {
      params: sortProp,
    });
    return res.data;
  } catch (error) {
    console.error("리포트 리스트 가져오기 실패");
    return null;
  }
};

export const getFavoriteReports = async (sortProp: SortProp) => {
  try {
    const res = await apiClient.get<ReportDetail[]>("/reports/interest", {
      params: sortProp,
    });
    return res.data;
  } catch (error) {
    console.error("리포트 리스트 가져오기 실패");
    return null;
  }
};

export const getInterestReports = async () => {
  try {
    const res = await apiClient.get<InterestReport[]>("/interest-reports");
    return res.data;
  } catch (error) {
    console.error("리포트 리스트 가져오기 실패");
    return null;
  }
};
