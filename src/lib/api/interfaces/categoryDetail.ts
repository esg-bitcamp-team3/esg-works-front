import { ESGNumber } from "./esgNumber";

export interface Section {
  sectionId: string;
  sectionName: string;
}

export interface Unit {
  unitId: string;
  unitName: string;
  type: string;
}

export interface CategoryDetail {
  categoryId: string;
  section: Section;
  unit: Unit;
  categoryName: string;
  description: string;
  esgNumber?: ESGNumber[];
}

export interface Unit {
  unitId: string;
  unitName: string;
  type: string; // e.g., "number", "percentage", "currency"
}
