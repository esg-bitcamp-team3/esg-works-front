import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Menu,
  Popover,
  Portal,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface TableSizeSelectorProps {
  onSelect: (rows: number, cols: number) => void;
  trigger: React.ReactNode;
}
const TableSizeSelector = ({ onSelect, trigger }: TableSizeSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState({ rows: 1, cols: 1 });
  const [isSelecting, setIsSelecting] = useState(true);
  const maxSize = { rows: 10, cols: 10 };

  const handleMouseEnter = ({ row, col }: { row: number; col: number }) => {
    if (isSelecting) {
      setSize({ rows: row + 1, cols: col + 1 });
    }
  };

  const handleClick = () => {
    setIsSelecting(false);
    onSelect(size.rows, size.cols);
    setOpen(false);
  };

  return (
    <Popover.Root
      positioning={{ placement: "right" }}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Popover.Trigger width="100%">{trigger}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Popover.Title fontWeight="medium">
                <Text mb={2} fontWeight="medium" fontSize="sm">
                  {size.rows} x {size.cols} 테이블
                </Text>
              </Popover.Title>

              <Grid templateColumns={`repeat(${maxSize.cols}, 20px)`} gap="2px">
                {Array.from({ length: maxSize.rows }).map((_, rowIndex) => (
                  <React.Fragment key={`row-${rowIndex}`}>
                    {Array.from({ length: maxSize.cols }).map((_, colIndex) => (
                      <Box
                        key={`cell-${rowIndex}-${colIndex}`}
                        width="20px"
                        height="20px"
                        bg={
                          rowIndex < size.rows && colIndex < size.cols
                            ? "blue.300"
                            : "gray.200"
                        }
                        border="1px solid"
                        borderColor={
                          rowIndex < size.rows && colIndex < size.cols
                            ? "blue.400"
                            : "gray.300"
                        }
                        onMouseEnter={() =>
                          handleMouseEnter({ row: rowIndex, col: colIndex })
                        }
                        onClick={handleClick}
                        cursor="pointer"
                      />
                    ))}
                  </React.Fragment>
                ))}
              </Grid>
            </Popover.Body>
            <Popover.Footer>
              <HStack justifyContent="flex-end">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  취소
                </Button>
              </HStack>
            </Popover.Footer>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default TableSizeSelector;
