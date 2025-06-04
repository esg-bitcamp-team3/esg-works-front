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

export interface PartialESGData {
  categoryId: string;
  corpId: string;
  year: string;
  value: string;
}

export interface DataFilter {
  categoryId: string;
  year: string;
}
