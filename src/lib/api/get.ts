import axios from "axios";

import { Section } from "./interfaces/section";
import { Category } from "./interfaces/category";
import { ESGData } from "./interfaces/esgData";
import { apiClient } from "./client";

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
        const res = await apiClient.get<Category[]>(`/categories/by-section/${sectionId}`);
        return res.data;
    } catch (error) {
        console.error("카테고리 가져오기 실패:", error);
        return [];
    }
}

export const getEsgData = async (categoryId: string, selected: string[]) => {
    try {
        const res = await apiClient.get<ESGData[]>(`/esg-data/category/${categoryId}`);
        return res.data;
    } catch (error) {
        console.error("ESG 데이터 가져오기 실패:", error);
        return null;
    }
}
