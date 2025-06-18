import { InfoTip } from "@/components/ui/toggle-tip";
import { getCategories, searchESGData } from "@/lib/api/get";
import { CategoryDetail } from "@/lib/api/interfaces/categoryDetail";
import { SectionCategoryESGData } from "@/lib/api/interfaces/gri";
import {
  Box,
  Clipboard,
  DataList,
  HStack,
  IconButton,
  Separator,
  Spinner,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import EditableCategory from "./EditableCategory";
import { CategoryInput, patchCategory } from "@/lib/api/patch";
import { toaster } from "@/components/ui/toaster";
import { deleteCategory } from "@/lib/api/delete";

interface CategoryListProps {
  sectionId: string;
}

const EditableCategoryList = ({ sectionId }: CategoryListProps) => {
  const [categoryList, setCategoryList] = useState<CategoryDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateLoading, setUpdateLoading] = useState<string>("");
  const fetchData = async () => {
    try {
      setLoading(true);
      const dataList = await getCategories(sectionId);
      setCategoryList(dataList || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sectionId]);

  const handleCategoryChanges = async (
    categoryId: string,
    value: Partial<CategoryDetail>
  ) => {
    try {
      setUpdateLoading(categoryId);

      const data = await patchCategory(categoryId, {
        categoryName: value.categoryName,
        unitId: value.unit?.unitId,
        description: value.description,
      });

      if (data) {
        const updatedList = categoryList.map((item) =>
          item.categoryId === categoryId ? { ...item, ...value } : item
        );
        setCategoryList(updatedList);
      }
    } catch (error) {
      console.error("Error updating category name:", error);
    } finally {
      setUpdateLoading("");
    }
  };

  const handleCategoryRemove = async (categoryId: string) => {
    try {
      const data = await deleteCategory(categoryId);

      const updatedList = categoryList.filter(
        (item) => item.categoryId !== categoryId
      );
      setCategoryList(updatedList);
      fetchData();
    } catch (error) {
      console.error("Error updating category name:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Table.Row>
          <Table.Cell colSpan={4} textAlign="center" py={4}>
            <Spinner />
          </Table.Cell>
        </Table.Row>
      ) : (
        <>
          {categoryList?.map((item) => (
            <EditableCategory
              loading={updateLoading === item.categoryId}
              key={item.categoryId}
              initialValue={{
                categoryId: item.categoryId,
                categoryName: item.categoryName,
                description: item.description,
                unit: item.unit,
              }}
              onValueCommit={(value) => {
                handleCategoryChanges(item.categoryId, value);
              }}
              onDelete={(categoryId) => {
                handleCategoryRemove(categoryId);
              }}
            />
          ))}
        </>
      )}
    </>
  );
};

export default EditableCategoryList;
