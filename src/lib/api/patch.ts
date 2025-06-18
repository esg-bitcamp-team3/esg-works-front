import { PartialESGData, Password } from "../interface";
import { apiClient } from "./client";

export const patchESGData = async (data: PartialESGData) => {
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
