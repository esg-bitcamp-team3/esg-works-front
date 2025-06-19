"use client";

import { Button, Portal, Menu, Icon, Popover, Dialog } from "@chakra-ui/react";
import { useState } from "react";
import { Criterion } from "@/lib/interface";
import { useRouter } from "next/navigation";
import { deleteCriterion } from "@/lib/api/delete";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuArrowRight } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";

export default function CriterionMenuButton({
  criterionId,
  onDeleted,
}: {
  criterionId: string;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // 삭제 기능 추가
  const handleDelete = async () => {
    try {
      await deleteCriterion(criterionId);
      toaster.info({
        title: "삭제 완료",
      });
      if (selected === criterionId) setSelected(null);
      onDeleted();
    } catch (err) {
      console.error("삭제 에러:", err);
    }
  };
  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            height="fit-content"
            width="fit-content"
            justifyContent="center"
            alignItems="center"
            variant="plain"
          >
            <Icon as={BsThreeDotsVertical} boxSize={5} color="gray.500" />
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content padding={2}>
              <Menu.Item
                key={"edit"}
                value={"edit"}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/criteria/${criterionId}/edit`);
                }}
                justifyContent={"space-between"}
              >
                {"수정"}
                <LuArrowRight />
              </Menu.Item>
              <Menu.Item
                key={"delete"}
                value={"delete"}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
              >
                {"삭제"}
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Dialog.Backdrop />
        <Portal>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.CloseTrigger />
              <Dialog.Header></Dialog.Header>
              <Dialog.Body>{"정말 삭제하시겠습니까?"}</Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(false)}
                  >
                    취소
                  </Button>
                </Dialog.ActionTrigger>
                <Dialog.ActionTrigger asChild>
                  <Button
                    colorPalette="red"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                      setOpen(false);
                    }}
                    variant={"outline"}
                  >
                    삭제
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
