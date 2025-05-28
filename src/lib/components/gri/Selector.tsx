import { createListCollection, Flex, Portal, Select } from "@chakra-ui/react";

interface Framework {
  label: string;
  value: string;
}

interface Props {
  items: Framework[];
  text: string;
}

const Selector = ({ items, text }: Props) => {
  const collection = createListCollection({ items });
  return (
    <Select.Root
      collection={collection}
      size="lg"
      defaultHighlightedValue={text}
    >
      <Select.HiddenSelect />

      <Select.Control>
        <Select.Trigger>
          <Flex align="center" gap="4" minW="200px">
            <Select.IndicatorGroup position="start">
              <Select.Indicator color="#2F6EEA" />
            </Select.IndicatorGroup>
            <Select.ValueText
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
              <Select.Item item={framework} key={framework.value}>
                {framework.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

export default Selector;
