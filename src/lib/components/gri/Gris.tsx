import { Accordion, Box, Span, Icon } from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import TableContent from "./TableContent";

const Gri = () => {
  return (
    <Accordion.Root collapsible width="100%">
      {items.map((item, index) => (
        <Accordion.Item
          key={index}
          value={item.value}
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="lg"
          mb={4}
          overflow="hidden"
          _hover={{ borderColor: "blue.200" }}
          transition="all 0.2s ease"
        >
          <Accordion.ItemTrigger
            p={6}
            bg="white"
            _hover={{ bg: "blue.50" }}
            _expanded={{
              bg: "blue.50",
              borderBottomWidth: "1px",
              borderColor: "gray.200",
            }}
          >
            <Span flex="1" fontSize="lg" fontWeight="semibold" color="gray.700">
              {item.title}
            </Span>
            <Icon
              as={FaChevronDown}
              transform="auto"
              transition="transform 0.2s ease"
              _expanded={{ transform: "rotate(180deg)" }}
              color="blue.500"
            />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Box p={6} bg="white" borderTop="none">
              {item.content}
            </Box>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};
const items = [
  {
    value: "economic",
    title: "GRI 201: 경제성과",
    content: <TableContent />,
  },
  {
    value: "environmental",
    title: "GRI 202",
    content: <TableContent />,
  },
  {
    value: "social",
    title: "GRI 203",
    content: <TableContent />,
  },
];
export default Gri;
