import { CategoryDetail, Unit } from "./categoryDetail";
import { ESGNumber } from "./esgNumber";

export interface CategorizedESGDataList {
  categoryName: string;
  categories: any;
  categoryDetailDTO: CategoryDetail;
  esgNumberDTOList: ESGNumber[];
  unitDTO: Unit;
}
