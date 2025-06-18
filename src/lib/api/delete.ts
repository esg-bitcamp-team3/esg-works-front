import { apiClient } from "./client";

export const deleteInterestReports = async (reportId: string) => {
  try {
    const res = await apiClient.delete(`/interest-reports/${reportId}`);
    return res.data;
  } catch (error) {
    console.log("즐겨찾기 리포트 삭제 실패", error);
  }
};

import { InteresrtChartDetail } from "./interfaces/chart";

export const deleteInterestChart = async (chartId: string) => {
  try {
    const res = await apiClient.delete(`/interest-charts/${chartId}`);
    console.log("Delete Interest Chart data:", res.data);
    return res.data;
  } catch (error) {
    console.error(`${chartId}차트 관심 해제 실패:`, error);
    return null;
  }
};

export const deleteSection = async (sectionId: string) => {
  try {
    const res = await apiClient.delete(`/sections/${sectionId}`);
    console.log("Delete Section data:", res.data);
    return res.data;
  } catch (error) {
    console.error(`${sectionId}섹션 삭제 실패:`, error);
    return null;
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const res = await apiClient.delete(`/categories/${categoryId}`);
    return res.data;
  } catch (error) {
    console.error(`${categoryId}카테고리 삭제 실패:`, error);
    return null;
  }
};
