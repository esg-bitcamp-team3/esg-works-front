import { InfoTip } from "@/components/ui/toggle-tip";
import { getCategories, searchESGData } from "@/lib/api/get";
import { CategoryDetail } from "@/lib/api/interfaces/categoryDetail";
import { SectionCategoryESGData } from "@/lib/api/interfaces/gri";
import {
  Icon,
  IconButton,
  Input,
  Spinner,
  Table,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import EditableCategory from "./EditableCategory";
import { CategoryInput, patchCategory } from "@/lib/api/patch";
import { deleteCategory } from "@/lib/api/delete";
import { LuPlus, LuSave } from "react-icons/lu";
import UnitSelector from "./UnitSelector";
import { postCategory } from "@/lib/api/post";
import { InputCategory } from "@/lib/api/interfaces/criterion";

interface CategoryListProps {
  sectionId: string;
}

const EditableCategoryList = ({ sectionId }: CategoryListProps) => {
  const [categoryList, setCategoryList] = useState<CategoryDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateLoading, setUpdateLoading] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<InputCategory>({
    categoryName: "",
    unitId: "",
    description: "",
    sectionId: sectionId,
  });
  const [error, setError] = useState<string | null>(null);

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

  const handleAddCategory = async () => {
    if (!newCategory.categoryName) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!newCategory.unitId) {
      setError("단위를 선택해주세요.");
      return;
    }

    try {
      const response = await postCategory(newCategory);
      if (response) {
        setIsAdding(false);
        setNewCategory({
          categoryName: "",
          unitId: "",
          description: "",
          sectionId: sectionId,
        });
        setError(null);
        fetchData();
      }
    } catch (error) {
      console.error("Error adding new category:", error);
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
      ) : categoryList.length === 0 && !isAdding ? (
        <Table.Row>
          <Table.Cell
            colSpan={4}
            textAlign="center"
            py={4}
            color="gray.500"
            fontSize={"xs"}
          >
            카테고리가 없습니다.
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
      {isAdding && (
        <Table.Row bg="gray.50" border="1px solid" borderColor="gray.200">
          <Table.Cell>
            <Input
              size="sm"
              border="none"
              bg="white"
              placeholder="이름을 입력하세요."
              _focus={{ borderColor: "gray.400" }}
              value={newCategory.categoryName || ""}
              onChange={(e) => {
                setNewCategory({
                  ...newCategory,
                  categoryName: e.target.value,
                });
              }}
            />
          </Table.Cell>
          <Table.Cell justifyContent="center" alignItems="center">
            <UnitSelector
              value={newCategory.unitId || ""}
              onValueChange={(unitValue) => {
                setNewCategory({ ...newCategory, unitId: unitValue.unitId });
              }}
            />
          </Table.Cell>

          <Table.Cell>
            <Textarea
              fontSize="xs"
              color="gray.500"
              textAlign="start"
              border="none"
              bg="white"
              _focus={{ borderColor: "gray.400" }}
              value={newCategory.description || ""}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              placeholder="설명을 입력하세요."
            />
          </Table.Cell>
          <Table.Cell
            textAlign="center"
            justifyContent={"center"}
            alignItems={"center"}
          >
            <IconButton
              variant="plain"
              size="xs"
              onClick={() => {
                handleAddCategory();
              }}
            >
              <Icon as={LuSave} color={"gray.800"} />
            </IconButton>
          </Table.Cell>
        </Table.Row>
      )}
      {isAdding && error && (
        <Table.Row>
          <Table.Cell
            colSpan={4}
            textAlign="center"
            color="red.500"
            fontSize="xs"
          >
            {error}
          </Table.Cell>
        </Table.Row>
      )}
      <Table.Row>
        <Table.Cell colSpan={4} textAlign="center" py={4}>
          <IconButton
            variant={"ghost"}
            size="sm"
            aria-label="Add Category"
            w={"100%"}
            onClick={() => {
              setIsAdding(true);
            }}
          >
            <Icon as={LuPlus} />
          </IconButton>
        </Table.Cell>
      </Table.Row>
    </>
  );
};

export default EditableCategoryList;
