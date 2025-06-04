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
<<<<<<< HEAD:src/lib/api/interfaces/category.ts

export interface Unit {
  unitId: string;
  unitName: string;
  type: string; // e.g., "number", "percentage", "currency"
}
=======
>>>>>>> bafd3eb8ca00f6494d4544c8768f7f58352c6529:src/lib/api/interfaces/categoryDetail.ts
