import { Category, CategoryList, ESGData, Section } from "../interface";
import { apiClient } from "./client";

export async function getCategoryList(sectionId: string) {
  try {
    const response = await apiClient.get<Category[]>(
      `/categories/by-section/${sectionId}`
    );
    return response.data;
  } catch (error: any) {}
}

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
