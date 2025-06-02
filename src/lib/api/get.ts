import { Category, CategoryList, ESGData, Section } from "../interface";
import { apiClient } from "./client";
export async function getSearchSectionId(sectionId: string) {
  try {
    const response = await apiClient.get<Section[]>(
      `/sections/search/${sectionId}`
    );
    return response.data;
  } catch (error) {}
}

export async function getDataByCorpYear(year: string, categoryId: string) {
  try {
    const response = await apiClient.get<ESGData>(
      `/year/${year}/category/${categoryId}`
    );
    return response.data;
  } catch (error) {}
}

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
    const res = await apiClient.get<Category[]>(
      `/categories/by-section/${sectionId}`
    );
    return res.data;
  } catch (error) {
    console.error("카테고리 가져오기 실패:", error);
    return [];
  }
};

export const getEsgData = async (categoryId: string, selected: string[]) => {
  try {
    const res = await apiClient.get<ESGData[]>(
      `/esg-data/category/${categoryId}`
    );
    return res.data;
  } catch (error) {
    console.error("ESG 데이터 가져오기 실패:", error);
    return null;
  }
};
