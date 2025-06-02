export interface Section {
  sectionId: string;
  sectionName: string;
  criterionId: string;
}

export interface SectionList {
  sectionNum: string;
  sectionList: Section[];
}

export interface Unit {
  unitId: string;
  unitName: string;
  type: string;
}
export interface Category {
  categoryId: string;
  unit: Unit;
  categoryName: string;
  description: string;
}
export interface CategoryList {
  categoryList: Category[];
}

export interface ESGData {
  categoryId: string;
  corpId: string;
  year: string;
  updatedAt: string; // ISO 문자열 (예: "2024-06-01")
  updatedBy: string;
  createdAt: string;
  createdBy: string;
}
