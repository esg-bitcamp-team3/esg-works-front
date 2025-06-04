import { PartialESGData } from "../interface";
import { apiClient } from "./client";
import { ESGData } from "./interfaces/esgData";

export const postESGData = async (data: PartialESGData) => {
  try {
    const response = await apiClient.post(`/esg-data/data-value`, data);
    return response.data;
  } catch (error) {
    console.log("data post error");
  }
};
