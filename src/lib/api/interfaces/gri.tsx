import { Unit } from "@/lib/interface";

export interface SectionCategoryESGData {
  sectionId: string;
  sectionName: string;
  criterionId: string;
  categoryESGDataList: CategoryESGData[];
}

export interface CategoryESGData {
  categoryId: string;
  sectionId: string;
  unit: Unit;
  categoryName: string;
  description: string;
  esgData: ESGData;
}

export interface ESGData {
  esgDataId: string;
  categoryId: string;
  corpId: string;
  year: string;
  value: string;
  updatedAt: string;
  updatedBy: string;
  createdAt: string;
  createdBy: string;
}
