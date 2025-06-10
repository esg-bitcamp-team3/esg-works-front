import { apiClient } from "./client";
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
