import { Section } from "./section";

export interface Category {
  categoryId: string;
  section: Section;
  unit: Unit;
  categoryName: string;
  description: string;
}

export interface Unit {
  unitId: string;
  unitName: string;
  type: string; // e.g., "number", "percentage", "currency"
}