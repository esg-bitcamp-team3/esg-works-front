import { ESGDataInput } from "../interface";
import { apiClient } from "./client";

export const patchESGData = async (data: Partial<ESGDataInput>) => {
  try {
    const response = await apiClient.patch(`/esg-data/data-value`, data);
    return response.data;
  } catch (error) {
    console.log("data patch error");
  }
};
