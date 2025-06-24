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
  text?: string;
  value: string;
  onValueChange: (value: string) => void;
  width?: string;
}

const Selector = ({ items, text, value, onValueChange, width }: Props) => {
  const collection = createListCollection({
    items: items.map((item) => ({
      value: item.value,
      label: item.label,
    })),
  });

  return (
    <Select.Root
      collection={collection}
      size={"sm"}
      value={[value]}
      onValueChange={(e) => onValueChange(e.value[0])}
      width={"160px"}
      bg="white"
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Flex align="center" gap="4" minW={width || "170px"}>
            <Select.IndicatorGroup position="start">
              <Select.Indicator color="#2F6EEA" />
            </Select.IndicatorGroup>
            <Select.ValueText
              style={{
                fontSize: "md",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {items.find((item) => item.value === value)?.label || value}
            </Select.ValueText>
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
  );
};

export default Selector;
