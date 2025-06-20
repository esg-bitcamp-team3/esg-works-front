export interface InputCriterion {
  criterionId: string;
  criterionName: string;
}

export interface Criterion {
  criterionId: string;
  criterionName: string;
  corporationId?: string;
}

export interface InputSection {
  sectionName: string;
  criterionId: string;
}

export interface InputCategory {
  categoryName: string;
  description: string;
  unitId: string;
  sectionId: string;
}
