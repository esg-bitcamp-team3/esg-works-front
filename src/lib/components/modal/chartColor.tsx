import {
  Box,
  Button,
  CloseButton,
  Drawer,
  HStack,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";

import { CategorizedESGDataList } from "@/lib/api/interfaces/categorizedEsgDataList";

interface ChartSettingsDrawerProps {
  categorizedEsgDataList: CategorizedESGDataList[];
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

const Seperator = () => <Box h="1px" bg="gray.200" my="3" />;

const ChartColor = ({
  categorizedEsgDataList,
  selectedColors,
  setSelectedColors,
  backgroundColor,
  setBackgroundColor,
}: ChartSettingsDrawerProps) => {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button
          variant="outline"
          size="sm"
          color="#2F6EEA"
          backgroundColor="white"
          _hover={{ bg: "gray.300" }}
        >
          <Text fontSize="sm" color="#2F6EEA">
            수정하기
          </Text>
        </Button>
      </Drawer.Trigger>

      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner padding="4">
          <Drawer.Content rounded="md" width="360px">
            <Drawer.Header>
              <Drawer.Title fontSize="lg" fontWeight="bold">
                차트 설정
              </Drawer.Title>
            </Drawer.Header>

            <Drawer.Body display="flex" flexDirection="column" gap="4">
              <Box>
                <Text fontWeight="medium" mb="1">
                  차트 배경
                </Text>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
              </Box>

              <Seperator />

              <Box mb={100}>
                <Text fontWeight="medium" mb="1">
                  차트 색상
                </Text>
                <VStack gap={2} align="stretch">
                  {categorizedEsgDataList.map((category, index) => (
                    <HStack key={category.categoryDetailDTO.categoryId}>
                      <Text w="50%">
                        {category.categoryDetailDTO.categoryName}
                      </Text>
                      <input
                        type="color"
                        value={selectedColors[index] || "#2F6EEA"}
                        onChange={(e) => {
                          const updated = [...selectedColors];
                          updated[index] = e.target.value;
                          setSelectedColors(updated);
                        }}
                      />
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </Drawer.Body>

            <Drawer.Footer display="flex" justifyContent="flex-end" gap="2">
              <Button variant="outline">취소</Button>
              <Button colorScheme="blue">적용</Button>
            </Drawer.Footer>

            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" position="absolute" top="2" right="2" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default ChartColor;
