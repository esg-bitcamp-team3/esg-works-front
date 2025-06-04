import { apiClient } from "./client";
import { CategorizedESGDataList } from "./interfaces/categorizedEsgDataList";
import { CategoryDetail, Section } from "./interfaces/categoryDetail";

export const getSections = async () => {
    try {
        const res = await apiClient.get<Section[]>("/sections");
        return res.data;
    } catch (error) {
        console.error("섹션 가져오기 실패:", error);
        return [];
    }
}

export const getCategories = async (sectionId: string) => {
    try {
        const res = await apiClient.get<CategoryDetail[]>(`/categories/by-section/${sectionId}`);
        return res.data;
    } catch (error) {
        console.error("카테고리 가져오기 실패:", error);
        return [];
    }
}

export const getEsgData = async (categoryId: string) => {
    try {
        const res = await apiClient.get<CategorizedESGDataList>(`/esg-data/category/${categoryId}`);
        console.log("보내는 categoryId:", categoryId);
        return res.data;
    } catch (error) {
        console.error("ESG 데이터 가져오기 실패:", error);
        return null;
    }
}

