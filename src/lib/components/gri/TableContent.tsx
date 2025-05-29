import { Table } from "@chakra-ui/react";
const items = [
  { id: 1, name: "201-1", price: "직접적인 경제가치 발생과 분배" },
  {
    id: 2,
    name: "201-2",
    price: "기후변화에 따른 재무적 영향 및 기타 리스크와 기회",
  },
  { id: 3, name: "201-3", price: "확정급여형 연금 채무 및 기타 퇴직연금안 " },
  { id: 4, name: "201-4", price: "정부 재정지원" },
];
const TableContent = () => {
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
          {items.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell
                padding={2}
                justifyContent="center"
                textAlign="center"
              >
                {item.name}
              </Table.Cell>
              <Table.Cell
                padding={2}
                justifyContent="center"
                textAlign="center"
              >
                {item.price}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};
export default TableContent;
