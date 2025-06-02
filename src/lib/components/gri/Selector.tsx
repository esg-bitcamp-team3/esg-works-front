import { createListCollection, Flex, Portal, Select } from "@chakra-ui/react";

interface Props {
  items: string[];
  text: string;
  selected: (value: string) => void;
}

const Selector = ({ items, text, selected }: Props) => {
  const collection = createListCollection({ items });
  return (
    <Select.Root
      collection={collection}
      size="lg"
      defaultHighlightedValue={text}
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
          <Flex align="center" gap="4" minW="200px">
            <Select.IndicatorGroup position="start">
              <Select.Indicator color="#2F6EEA" />
            </Select.IndicatorGroup>
            <Select.ValueText
              padding={2}
              placeholder={text}
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
            {collection.items.map((framework) => (
              <Select.Item item={framework} key={framework}>
                {framework}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

export default Selector;
