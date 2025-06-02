import axios from "axios";

import { Section } from "./interfaces/section";
import { Category } from "./interfaces/category";
import { ESGData } from "./interfaces/esgData";

export const getSections = async () => {
    try {
        const res = await axios.get<Section[]>("http://localhost:8080/api/sections");
        return res.data;
    } catch (error) {
        console.error("섹션 가져오기 실패:", error);
        return [];
    }
}

export const getCategories = async (sectionId: string) => {
    try {
        const res = await axios.get<Category[]>(`http://localhost:8080/api/categories/by-section/${sectionId}`);
        return res.data;
    } catch (error) {
        console.error("카테고리 가져오기 실패:", error);
        return [];
    }
}

export const getEsgData = async (sectionId: string, categoryId: string) => {
    try {
        const res = await axios.get<ESGData[]>(`http://localhost:8080/api/esg-data`);
        return res.data;
    } catch (error) {
        console.error("ESG 데이터 가져오기 실패:", error);
        return null;
    }
}
