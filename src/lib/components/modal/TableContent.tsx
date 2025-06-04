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
  Text,
  Flex,
} from "@chakra-ui/react";
import { ESGData } from "@/lib/api/interfaces/esgData";
import { getEsgData } from "@/lib/api/get";
import React from "react";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";

const TableContent = () => {
  const [selection, setSelection] = useState<string[]>([]);
  const [tableItems, setTableItems] = useState(items);
  const [extraColumns, setExtraColumns] = useState<string[]>([]);
  const [editableData, setEditableData] = useState(tableItems);

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < tableItems.length;

  const handleAddRow = () => {
    const newColumn = `Column ${extraColumns.length + 1}`;
    setExtraColumns([...extraColumns, newColumn]);
  };
  interface Section {
    sectionId: string;
    sectionName: string;
  }
  interface Unit {
    unitId: string;
    unitName: string;
    type: string; // e.g., "number", "percentage", "currency"
  }
  interface Category {
    categoryId: string;
    section: Section;
    unit: Unit;
    categoryName: string;
    description: string;
  }

  interface ESGData {
    categoryId: string;
    corpId: string;
    year: string;
    value: string;
    updatedAt: string;
    updatedBy: string;
    createdAt: string;
    createdBy: string;
  }

  const rows = editableData.map((item, index) => (
    <Table.Row
    // key={data.categoryId}
    // data-selected={selection.includes(item.name) ? "" : undefined}
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
            <Table.ColumnHeader>
              <Table.ColumnHeader
                textAlign="center"
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                borderBottom={"0"}
                padding="0"
              >
                지표
              </Table.ColumnHeader>
            </Table.ColumnHeader>
            {[...Array(5)].map((_, idx) => {
              const year = new Date().getFullYear() - idx;
              return (
                <Table.ColumnHeader key={year} textAlign="center">
                  {year}
                </Table.ColumnHeader>
              );
            })}
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
