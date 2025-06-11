import {
  createListCollection,
  Flex,
  HStack,
  Portal,
  Select,
  Span,
  Stack,
  Text,
} from "@chakra-ui/react";

interface Item {
  label: string;
  value: string;
}

interface Props {
  items: Item[];
  text: string;
  selected: (value: string) => void;
  width?: string;
}

const Selector = ({ items, text, selected, width }: Props) => {
  const collection = createListCollection({
    items: items.map((item) => item.value),
  });

  return (
    <HStack gap={4}>
      <Text whiteSpace="nowrap" width="fit-content">
        {text}
      </Text>
      <Select.Root
        collection={collection}
        size={"md"}
        // defaultHighlightedValue={text}
        onValueChange={(details) => {
          const value = Array.isArray(details.value)
            ? details.value[0]
            : details.value;
          selected(value);
        }}
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Flex align="center" gap="4" minW={width || "170px"}>
              <Select.IndicatorGroup position="start">
                <Select.Indicator color="#2F6EEA" />
              </Select.IndicatorGroup>
              <Select.ValueText
                padding={2}
                placeholder={items[0].value}
                style={{
                  fontSize: "md",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
            </Flex>
          </Select.Trigger>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content>
              {items.map((item) => (
                <Select.Item key={item.value} item={item.value}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </HStack>
  );
};

export default Selector;
