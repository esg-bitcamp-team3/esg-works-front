import { Table } from "@chakra-ui/react";
import { LuTags } from "react-icons/lu";
import ContentDetail from "./ContentDetail";
import subCategory from "@/lib/data/gri";
import { useState } from "react";

type SubCategoryKey = keyof typeof subCategory;

interface Props {
  no: string;
}

const TableContent = ({ no }: Props) => {
  const category = no as SubCategoryKey;
  // const [category, setCategory] = useState<SubCategoryKey>("201");
  return (
    <Table.ScrollArea borderWidth="1px" maxH="xl" borderRadius="md">
      <Table.Root minW={"lg"} size="lg" variant="outline" showColumnBorder>
        <Table.Header>
          <Table.Row bg="rgba(47, 110, 234, 0.1)">
            <Table.ColumnHeader
              padding={2}
              justifyContent="center"
              textAlign="center"
            >
              No.
            </Table.ColumnHeader>
            <Table.ColumnHeader
              padding={2}
              justifyContent="center"
              textAlign="center"
              width={"70%"}
            >
              내용
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(subCategory[category]).map(([key, value]) => (
            // <ContentDetail
            //   Row={
            <Table.Row key={key}>
              <Table.Cell
                padding={2}
                justifyContent="center"
                textAlign="center"
              >
                {no + "-" + key}
              </Table.Cell>
              <Table.Cell
                padding={2}
                justifyContent="center"
                textAlign="center"
              >
                {value}
              </Table.Cell>
            </Table.Row>
            //     }
            //   />
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default TableContent;
