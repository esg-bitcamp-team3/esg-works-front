import {
  Category,
  Criterion,
  DataFilter,
  PartialESGData,
  Section,
  Unit,
} from "../interface";
import { apiClient } from "./client";

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

import { ChartDetail, InteresrtChartDetail } from "./interfaces/chart";

import { CategorizedESGDataList } from "./interfaces/categorizedEsgDataList";
import { CategoryDetail } from "./interfaces/categoryDetail";
import {
  InterestReport,
  Report,
  ReportDetail,
  SortProp,
} from "./interfaces/report";
import { SectionCategoryESGData } from "./interfaces/gri";

// ============================section
export const getSections = async () => {
  try {
    const res = await apiClient.get<Section[]>("/sections");
    return res.data;
  } catch (error) {
    console.error("섹션 가져오기 실패:", error);
    return [];
  }
};

export const getSectionsByCriterion = async (criterionId: string) => {
  try {
    const res = await apiClient.get<Section[]>(
      `/sections/by-criterion/${criterionId}`
    );
    return res.data;
  } catch (error) {
    console.error("섹션 가져오기 실패:", error);
    return [];
  }
};
export const getSearchSectionId = async (sectionId: string) => {
  try {
    const response = await apiClient.get<Section[]>(
      `/sections/search/${sectionId}`
    );
    return response.data;
  } catch (error) {
    console.error("섹션 가져오기 실패:", error);
    return [];
  }
};

// =============================

export const getCategories = async (sectionId?: string) => {
  try {
    if (sectionId) {
      const res = await apiClient.get<CategoryDetail[]>(
        `/categories/by-section/${sectionId}`
      );
      return res.data;
    } else {
      const res = await apiClient.get<CategoryDetail[]>(`/categories`);
      return res.data;
    }
  } catch (error) {
    console.error("카테고리 가져오기 실패:", error);
    return [];
  }
};

export const getCategoriesBySectionStartingWith = async ({
  sectionId,
  startsWith,
}: {
  sectionId: string;
  startsWith?: string;
}) => {
  try {
    const res = await apiClient.get<CategoryDetail[]>(
      `/categories/by-section/${sectionId}`,
      {
        params: {
          startsWith,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("카테고리 가져오기 실패:", error);
    return [];
  }
};

export const searchGRIData = async ({
  year = "2020",
  sectionId = "201",
  categoryName = "",
}: {
  year: string;
  sectionId: string;
  categoryName: string;
}) => {
  try {
    const res = await apiClient.get<SectionCategoryESGData>(`/gri/search`, {
      params: {
        year,
        categoryName,
        sectionId,
      },
    });
    return res.data;
  } catch (error) {
    console.error("데이터 가져오기 실패:", error);
    return null;
  }
};

export const searchESGData = async ({
  year = "2020",
  sectionId = "201",
  categoryName = "",
}: {
  year: string;
  sectionId: string;
  categoryName: string;
}) => {
  try {
    const res = await apiClient.get<SectionCategoryESGData>(`/data/search`, {
      params: {
        year,
        categoryName,
        sectionId,
      },
    });
    return res.data;
  } catch (error) {
    console.error("데이터 가져오기 실패:", error);
    return null;
  }
};

export const getEsgData = async (categoryId: string) => {
  try {
    const res = await apiClient.get<CategorizedESGDataList>(
      `/esg-data/category/${categoryId}`
    );
    console.log("보내는 categoryId:", categoryId);
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
    console.error("차트 가져오기 실패:", error);
    return null;
  }
};

export const getInterestChart = async () => {
  try {
    const res = await apiClient.get<InteresrtChartDetail[]>(
      `/interest-charts/my`
    );
    console.log("Interest Chart data:", res.data);
    return res.data;
  } catch (error) {
    console.error("관심 차트 가져오기 실패:", error);
    return null;
  }
};

export const getChartByType = async (type: string) => {
  try {
    const res = await apiClient.get<ChartDetail[]>(`/charts/my/${type}`);
    console.log("Chart data:", res.data);
    return res.data;
  } catch (error) {
    console.error(`${type}인 차트 가져오기 실패:`, error);
    return null;
  }
};

export const getInterestChartByType = async (type: string) => {
  try {
    const res = await apiClient.get<InteresrtChartDetail[]>(
      `/interest-charts/my/${type}`
    );
    console.log("Interest Chart data:", res.data);
    return res.data;
  } catch (error) {
    console.error(`${type}인 관심 차트 가져오기 실패:`, error);
    return null;
  }
};

export const getCategory = async () => {
  try {
    const res = await apiClient.get<Category[]>("/categories");
    return res.data;
  } catch (error) {
    console.error("카테고리 리스트를 가져오지 못했습니다.");
    return null;
  }
};

// ==========================Report

export const getReports = async (sortProp: SortProp) => {
  try {
    const res = await apiClient.get<ReportDetail[]>("/reports/corp", {
      params: sortProp,
    });
    return res.data;
  } catch (error) {
    console.error("리포트 리스트 가져오기 실패");
    return null;
  }
};

export const getFavoriteReports = async (sortProp: SortProp) => {
  try {
    const res = await apiClient.get<ReportDetail[]>("/reports/interest", {
      params: sortProp,
    });
    return res.data;
  } catch (error) {
    console.error("리포트 리스트 가져오기 실패");
    return null;
  }
};

export const getInterestReports = async () => {
  try {
    const res = await apiClient.get<InterestReport[]>("/interest-reports");
    return res.data;
  } catch (error) {
    console.error("리포트 리스트 가져오기 실패");
    return null;
  }
};

export const getMyCriteria = async () => {
  try {
    const res = await apiClient.get<Criterion[]>(`/criteria/my`);
    return res.data;
  } catch (error) {
    console.error("섹션 기준 가져오기 실패:", error);
    return null;
  }
};

// ============= category
export const searchCategory = async (keyword: string) => {
  try {
    const res = await apiClient.get<Category[]>("/categories/search", {
      params: { keyword },
    });
    return res.data;
  } catch (error) {
    console.error("카테고리 검색 실패");
  }
};

export const getCategoryByName = async (categoryName: string) => {
  try {
    const res = await apiClient.get<Category>("/categories/name", {
      params: { categoryName },
    });
    return res.data;
  } catch (error) {
    console.error("카테고리 검색 실패");
  }
};

//================gri
export const getGri = async (year: string, categoryName: string | null) => {
  try {
    const res = await apiClient.get<SectionCategoryESGData[]>("/gri", {
      params: {
        year,
        ...(categoryName ? { categoryName } : {}), // null이면 제외
      },
    });
    return res.data;
  } catch (error) {
    console.error("카테고리 검색 실패", error);
  }
};

export const getGriBySection = async (
  year: string,
  sectionId: string,
  categoryName: string
) => {
  try {
    const res = await apiClient.get<SectionCategoryESGData[]>("/gri/search", {
      params: {
        year,
        sectionId,
        categoryName,
      },
    });
    return res.data;
  } catch (error) {
    console.error("카테고리 검색 실패", error);
  }
};

export const getGriBySectionSelect = async (
  year: string,
  sectionId: string
) => {
  try {
    const res = await apiClient.get<SectionCategoryESGData>("/gri/search", {
      params: {
        year,
        sectionId,
      },
    });
    return res.data;
  } catch (error) {
    console.error("카테고리 검색 실패", error);
  }
};

export const getAllUnits = async () => {
  try {
    const res = await apiClient.get<Unit[]>(`/units`);
    return res.data;
  } catch (error) {
    console.error("단위 가져오기 실패:", error);
    return [];
  }
};
