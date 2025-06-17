import { Unit } from "@/lib/interface";
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
  unit: Unit;
  categoryName: string;
  description: string;
  esgData: ESGData;
}

// Make sure ESGDataDTO is defined elsewhere in your codebase.
