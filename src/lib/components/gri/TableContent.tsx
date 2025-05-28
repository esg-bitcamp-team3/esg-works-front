import { Table } from "@chakra-ui/react";
const items = [
  { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
  { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
  { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
  { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
  { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
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
            >
              지표명
            </Table.ColumnHeader>
            <Table.ColumnHeader
              padding={2}
              justifyContent="center"
              textAlign="center"
              width={"60%"}
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
                {item.category}
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
