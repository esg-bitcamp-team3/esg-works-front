"use client";

import {
  Box,
  Button,
  CloseButton,
  Drawer,
  HStack,
  Kbd,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdOutlineDensitySmall } from "react-icons/md";
interface SubBarTabProps {
  label: string;
  icon: React.ElementType;
  onOpenChange: (open: boolean) => void;
}
const SubBarTab = ({ label, icon: Icon, onOpenChange }: SubBarTabProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer.Root
      size="xs"
      open={isOpen}
      onOpenChange={(details) => {
        setIsOpen(details.open);
        onOpenChange(details.open); // 🔥 Subbar에게 상태 알림
      }}
    >
      <Drawer.Trigger asChild>
        {/* 서브바 ==================== */}
        <Button variant="ghost" color="#2F6EEA" onClick={() => setIsOpen(true)}>
          <Icon size={20} />
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Positioner>
          <Drawer.Content boxShadow="none" padding={5}>
            <Drawer.Header>
              <Drawer.Title>
                <HStack>
                  <Icon size={30} color="#2F6EEA" />
                  <Text fontSize="30px" color="#2F6EEA">
                    {label}
                  </Text>
                </HStack>
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Box padding={4} textAlign="center">
                <Text fontSize="lg" mb={4}>
                  <Button>
                    <MdOutlineDensitySmall />
                  </Button>
                </Text>
              </Box>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Drawer.ActionTrigger>
              <Button>Save</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default SubBarTab;
