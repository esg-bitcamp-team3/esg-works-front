import { Table } from "@chakra-ui/react";
import ContentDetail from "./ContentDetail";
import subCategory from "@/lib/data/gri";
import { Category } from "@/lib/interface";
import { useEffect, useState } from "react";
import { getCategoryList } from "@/lib/api/get";

type SubCategoryKey = keyof typeof subCategory;

interface Props {
  no: string;
  year: string;
}

const TableContent = ({ no, year }: Props) => {
  const categoryNo = no as SubCategoryKey;
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataList = await getCategoryList(no);
        setCategoryList(dataList || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [no]);

  return (
    <Table.ScrollArea borderWidth="1px" maxH="xl" borderRadius="md">
      <Table.Root minW={"lg"} size="lg" variant="outline" showColumnBorder>
        <Table.Body>
          {Object.entries(subCategory[categoryNo] || {}).map(([key, value]) => (
            <Table.Row key={key}>
              <Table.Cell
                padding={2}
                justifyContent="center"
                textAlign="center"
              >
                <ContentDetail
                  row={value}
                  categoriesList={categoryList.filter((category) =>
                    category.categoryId.startsWith(no + key)
                  )}
                  year={year}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default TableContent;
