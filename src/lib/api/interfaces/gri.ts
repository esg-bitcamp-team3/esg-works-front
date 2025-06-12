import { ESGData } from "./esgData";

export interface SectionCategoryESGData {
  sectionId: string;
  sectionName: string;
  criterionId: string;
  categoryESGDataList: CategoryESGData[];
}

export interface CategoryESGData {
  categoryId: string;
  sectionId: string;
  unitId: string;
  categoryName: string;
  description: string;
  esgData: ESGData;
}

export interface GriParam {
  year: string;
  sectionId?: string;
  categoryName: string;
}
// Make sure ESGDataDTO is defined elsewhere in your codebase.
