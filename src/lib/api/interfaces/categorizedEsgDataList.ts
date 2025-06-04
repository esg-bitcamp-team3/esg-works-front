import { CategoryDetail } from "./categoryDetail";
import { ESGNumber } from "./esgNumber";

export interface CategorizedESGDataList {
  categories: any;
  categoryDetailDTO: CategoryDetail;
  esgNumberDTOList: ESGNumber[];
}
