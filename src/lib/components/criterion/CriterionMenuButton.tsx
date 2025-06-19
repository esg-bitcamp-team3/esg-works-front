"use client";

import { Button, Portal, Menu, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { Criterion } from "@/lib/interface";
import { useRouter } from "next/navigation";
import { deleteCriterion } from "@/lib/api/delete";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuArrowRight } from "react-icons/lu";

export default function CriterionMenuButton({
  criterionId,
}: {
  criterionId: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  // 삭제 기능 추가
  const handleDelete = async () => {
    try {
      if (!window.confirm("정말로 삭제하시겠습니까?")) return;
      await deleteCriterion(criterionId);
      if (selected === criterionId) setSelected(null);
      alert("삭제 완료!");
      window.location.reload();
    } catch (err) {
      console.error("삭제 에러:", err);
      alert("삭제에 실패했어요 😢");
    }
  };
  return (
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
              onClick={() => {
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
              onClick={() => {
                handleDelete();
              }}
            >
              {"삭제"}
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
