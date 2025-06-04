import {
  Category,
  CategoryList,
  DataFilter,
  PartialESGData,
  Section,
} from "../interface";
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
import { apiClient } from "./client";
<<<<<<< HEAD
import { ChartDetail } from "./interfaces/chart";
=======
import { CategorizedESGDataList } from "./interfaces/categorizedEsgDataList";
import { CategoryDetail, Section } from "./interfaces/categoryDetail";
>>>>>>> bafd3eb8ca00f6494d4544c8768f7f58352c6529

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
<<<<<<< HEAD
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

export const getChart = async () => {
  try {
    const res = await apiClient.get<ChartDetail[]>(`/charts/my`);
    console.log("Chart data:", res.data);
    return res.data;
  } catch (error) {
    console.error("ESG 데이터 가져오기 실패:", error);
    return null;
  }
};
=======
    try {
        const res = await apiClient.get<CategoryDetail[]>(`/categories/by-section/${sectionId}`);
        return res.data;
    } catch (error) {
        console.error("카테고리 가져오기 실패:", error);
        return [];
    }
}

export const getEsgData = async (categoryId: string, selected: string[]) => {
    try {
        const res = await apiClient.get<CategorizedESGDataList[]>(`/esg-data/category/${categoryId}`);
        console.log("보내는 categoryId:", categoryId);
        return res.data;
    } catch (error) {
        console.error("ESG 데이터 가져오기 실패:", error);
        return null;
    }
}

>>>>>>> bafd3eb8ca00f6494d4544c8768f7f58352c6529
