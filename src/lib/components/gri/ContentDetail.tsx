import { Accordion, Flex } from "@chakra-ui/react";
import React from "react";
import DynamicInputForm from "./InputForm";
import { Category } from "@/lib/interface";

interface Prop {
  row: string;
  categoriesList: Category[];
  year: string;
}
const ContentDetail = ({ row, categoriesList, year }: Prop) => {
  return (
    <Flex w="100%">
      <Accordion.Root collapsible variant={"plain"}>
        <Accordion.Item value={"content"}>
          <Accordion.ItemTrigger p={2}>{row}</Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody p={2}>
              {categoriesList.map((category) => (
                <DynamicInputForm category={category} year={year} />
              ))}
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </Flex>
  );
};

export default ContentDetail;
