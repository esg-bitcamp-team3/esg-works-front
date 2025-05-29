import { Accordion, Flex, Heading, Icon, Stack } from "@chakra-ui/react";
import React from "react";

interface Prop {
  Row: React.ReactNode;
}
const ContentDetail = ({ Row }: Prop) => {
  return (
    <Flex w="100%">
      <Accordion.Root collapsible>
        {ite.map((i) => (
          <Accordion.Item key={i.value} value={i.value}>
            <Accordion.ItemTrigger>{Row}</Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>{i.content}</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Flex>
  );
};

export default ContentDetail;

const ite = [
  {
    value: "info",
    title: "Product Info",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec odio vel dui euismod fermentum.",
  },
];
