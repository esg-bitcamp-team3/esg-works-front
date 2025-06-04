import { CategoryDetail } from "./categoryDetail";
import { ESGNumber } from "./esgNumber";

export interface CategorizedESGDataList {
  categoryDetailDTO: CategoryDetail;
  esgNumberDTOList: ESGNumber[];
}
