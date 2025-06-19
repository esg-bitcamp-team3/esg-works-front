"use client";

import { Button, Portal, Menu, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { Criterion } from "@/lib/interface";
import { useRouter } from "next/navigation";
import { deleteCriterion } from "@/lib/api/delete";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function CriterionMenuButton({
  criterionId,
}: {
  criterionId: string;
}) {
  const router = useRouter();
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  // 삭제 기능 추가
  const handleDelete = async () => {
    try {
      if (!window.confirm("정말로 삭제하시겠습니까?")) return;
      await deleteCriterion(criterionId);
      setCriteria((prev: Criterion[]) =>
        prev.filter((c: Criterion) => c.criterionId !== criterionId)
      );
      if (selected === criterionId) setSelected(null);
      alert("삭제 완료!");
      window.location.reload();
    } catch (err) {
      console.error("삭제 에러:", err);
      alert("삭제에 실패했어요 😢");
    }
  };

  // 메뉴 항목 정의
  const links = [
    {
      title: "수정",
      onClick: (criterionId: string) => {
        router.push(`/criterion/${criterionId}/editor`);
      },
    },
    {
      title: "삭제",
      onClick: () => handleDelete(),
    },
  ];
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
          <Menu.Content>
            {links.map((link) => (
              <Menu.Item
                key={link.title}
                value={link.title}
                onClick={() => link.onClick(criterionId)}
              >
                {link.title}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
