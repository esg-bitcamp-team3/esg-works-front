"use client";

import {
  ActionBar,
  Button,
  Checkbox,
  Kbd,
  Portal,
  Table,
  IconButton,
  CloseButton,
} from "@chakra-ui/react";
import { ESGData } from "@/lib/api/interfaces/esgData";

import React, { useEffect } from "react";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { CategorizedESGDataList } from "@/lib/api/interfaces/categorizedEsgDataList";
import { getEsgData } from "@/lib/api/get";

const TableContent = () => {
  const [selection, setSelection] = useState<string[]>([]);
  const [tableItems, setTableItems] = useState(items);
  const [extraColumns, setExtraColumns] = useState<string[]>([]);
  const [editableData, setEditableData] = useState(tableItems);
  const [esgData, setEsgData] = useState<ESGData[]>([]);
  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < tableItems.length;

  const handleAddRow = () => {
    const newColumn = `Column ${extraColumns.length + 1}`;
    setExtraColumns([...extraColumns, newColumn]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEsgData(
          "categoryId",
          ["selected"],
          ["value"],
          ["year"]
        );
        console.log("Fetched ESG Data:", data);
        setEsgData(esgData);
      } catch (error) {
        console.error("Error fetching ESG data:", error);
      }
    };
    fetchData();
  }, []);

  const rows = editableData.map((item, index) => (
    <Table.Row
      key={item.name}
      data-selected={selection.includes(item.name) ? "" : undefined}
    >
      <Table.Cell>
        <Checkbox.Root
          size="sm"
          top="0.5"
          aria-label="Select row"
          checked={selection.includes(item.name)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, item.name]
                : selection.filter((name) => name !== item.name)
            );
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>
        <input
          type="text"
          value={item.name}
          onChange={(e) => {
            const newData = [...editableData];
            newData[index].name = e.target.value;
            setEditableData(newData);
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <input
          type="text"
          value={item.category}
          onChange={(e) => {
            const newData = [...editableData];
            newData[index].category = e.target.value;
            setEditableData(newData);
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <input
          type="number"
          value={item.price}
          onChange={(e) => {
            const newData = [...editableData];
            newData[index].price = parseFloat(e.target.value);
            setEditableData(newData);
          }}
        />
      </Table.Cell>
      {extraColumns.map((_, idx) => (
        <Table.Cell key={`extra-cell-${item.id}-${idx}`}></Table.Cell>
      ))}
    </Table.Row>
  ));

  return (
    <>
      <Table.Root size="md" variant="outline" showColumnBorder h={"20vh"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="6">
              <Checkbox.Root
                size="sm"
                top="0.5"
                aria-label="Select all rows"
                checked={indeterminate ? "indeterminate" : selection.length > 0}
                onCheckedChange={(changes) => {
                  setSelection(
                    changes.checked ? tableItems.map((item) => item.name) : []
                  );
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            <Table.ColumnHeader>2019</Table.ColumnHeader>
            <Table.ColumnHeader>2020</Table.ColumnHeader>
            <Table.ColumnHeader>2021</Table.ColumnHeader>
            <Table.ColumnHeader>2022</Table.ColumnHeader>
            <Table.ColumnHeader>2023</Table.ColumnHeader>

            <Table.ColumnHeader>
              <IconButton
                aria-label="Add row"
                size="sm"
                onClick={handleAddRow}
                variant="ghost"
              >
                <FaPlusCircle />
              </IconButton>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>{rows}</Table.Body>
      </Table.Root>

      <ActionBar.Root open={hasSelection}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>
                {selection.length} selected
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button variant="outline" size="sm">
                Delete <Kbd>⌫</Kbd>
              </Button>
              <Button variant="outline" size="sm">
                Share <Kbd>T</Kbd>
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  );
};

const items = [
  { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
  { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
  { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
  { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
  { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
];

// const [selection, setSelection] = useState<string[]>([])

// return (
//   <Table.Root size="md" variant='outline' showColumnBorder>
//     <Table.Header>
//       <Table.Row>
//         <Table.ColumnHeader>Category ID</Table.ColumnHeader>
//         <Table.ColumnHeader>Year</Table.ColumnHeader>
//       </Table.Row>
//     </Table.Header>
//     <Table.Body>
//       {/* {getEsgData.map((data) => (
//         <Table.Row key={data._id}>
//           <Table.Cell>{data.categoryId}</Table.Cell>
//           <Table.Cell>{data.year}</Table.Cell>
//           <Table.Cell>{data.value}</Table.Cell>
//         </Table.Row>
//       ))} */}
//     </Table.Body>
//   </Table.Root>
// );
// };

export default TableContent;

// {
//   /* {esgData.map((data) => (
//         <Tr key={data._id}>
//           <Td>{data.categoryId}</Td>
//           <Td>{data.corpId}</Td>0
//           <Td>{data.year}</Td>
//           <Td>{data.value}</Td>
//         </Tr>
//       ))} */
// }
