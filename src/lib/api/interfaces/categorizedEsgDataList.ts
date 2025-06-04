// import { CategoryDetail } from "./categoryDetail";
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
}

export interface CategorizedESGDataList {
  categoryDetailDTO: CategoryDetail;
  esgNumberDTOList: ESGNumber[];
}
