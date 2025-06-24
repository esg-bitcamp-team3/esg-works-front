import { Password } from "../interface";
import { ESGDataInput } from "../interface";
import { apiClient } from "./client";

export interface CategoryInput {
  categoryName: string;
  description: string;
  unitId: string;
}

export const patchESGData = async (data: Partial<ESGDataInput>) => {
  try {
    const response = await apiClient.patch(`/esg-data/data-value`, data);
    return response.data;
  } catch (error) {
    console.log("data patch error");
  }
};

export const patchPassword = async (data: Password) => {
  try {
    const response = await apiClient.patch(`/password`, data);
    return response.data;
  } catch (error) {
    console.log("data patch error");
  }
};

export const patchCategory = async (
  categoryId: string,
  data: Partial<CategoryInput>
) => {
  try {
    const response = await apiClient.patch(`/categories/${categoryId}`, data);
    return response.data;
  } catch (error) {
    console.log("category patch error");
  }
};

export const patchSection = async (
  sectionId: string,
  data: { sectionName: string }
) => {
  try {
    const response = await apiClient.patch(`/sections/${sectionId}`, data);
    return response.data;
  } catch (error) {
    console.log("section patch error");
  }
};
