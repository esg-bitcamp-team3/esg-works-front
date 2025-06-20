import {
  Box,
  VStack,
  Separator,
  Text,
  Skeleton,
  Flex,
  Badge,
  Icon,
  HStack,
  Breadcrumb,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMyCriteria } from "@/lib/api/get";
import type { Criterion } from "@/lib/interface";
import CriterionMenuButton from "../criterion/CriterionMenuButton";
import CriterionAddModal from "../criterion/CriterionAddModal";
import { MdList, MdOutlineArticle } from "react-icons/md";
import { LuClipboardList, LuList } from "react-icons/lu";
const CARD_STYLES = {
  bg: "white",
  borderRadius: "xl",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  border: "1px solid",
  borderColor: "gray.100",
  overflow: "hidden",
  position: "relative",
};

const StandardsPage = () => {
  const router = useRouter();
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [loading, setLoading] = useState(true);
  const highlightColor = "blue.500";

  const fetchCriteria = async () => {
    setLoading(true);
    try {
      const data = await getMyCriteria();
      if (data) setCriteria(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

  const handleCriterionAdded = () => {
    fetchCriteria();
  };

  const handleCriterionDeleted = () => {
    fetchCriteria();
  };

  return (
    <Box w="100%" h="100%" overflow={"auto"}>
      <Flex
        alignItems="center"
        mb={2}
        borderBottom="2px solid"
        borderColor="gray.200"
        pb={3}
        pt={3}
        justifyContent="space-between"
        width={"100%"}
        position={"sticky"}
      >
        <HStack
          alignItems={"center"}
          justifyContent={"center"}
          alignContent={"center"}
        >
          <Icon as={LuList} size="md" color={highlightColor} />
          <Text fontSize="xl" fontWeight="600" color={highlightColor}>
            평가 기준 목록
          </Text>
          <Badge
            colorScheme="blue"
            borderRadius="full"
            px={2}
            textAlign={"center"}
            justifyContent={"center"}
            justifyItems={"center"}
            alignItems={"center"}
            alignContent={"center"}
            size={"md"}
            fontSize={"xs"}
          >
            {criteria.length}
          </Badge>
        </HStack>
        <CriterionAddModal onCriterionAdded={handleCriterionAdded} />
      </Flex>

      <VStack
        align="center"
        width="100%"
        gap={4}
        padding={2}
        px={4}
        overflowY="auto"
        maxH={"60vh"}
      >
        {loading
          ? Array.from({
              length: criteria.length > 0 ? criteria.length : 4,
            }).map((_, idx) => (
              <Box key={`skeleton-${idx}`} width="100%">
                <Box
                  display="flex"
                  gap={2}
                  paddingLeft="2"
                  paddingRight="2"
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Skeleton height="75px" width="100%" borderRadius="md" />
                </Box>
              </Box>
            ))
          : criteria.map((std, idx) => (
              <HStack
                key={std.criterionId + "-wrapper"}
                width="100%"
                borderRadius="md"
                border={"2px solid rgb(240, 240, 240)"}
                bg="white"
                transition="all 0.2s"
                _hover={{
                  bg: "gray.50",
                  transform: "scale(1.01)",
                }}
                px={4}
                py={6}
                onClick={() => router.push(`/criterion/${std.criterionId}`)}
                justifyContent={"space-between"}
              >
                <Tooltip
                  showArrow
                  content="해당 기준의 데이터 입력 화면으로 이동"
                  positioning={{ placement: "right" }}
                  contentProps={{ css: { "--tooltip-bg": "#4A5568" } }}
                  openDelay={500}
                  closeDelay={100}
                >
                  <Text
                    fontSize="sm"
                    textAlign="left"
                    cursor="pointer"
                    background="none"
                    border="none"
                    alignItems="center"
                    justifyContent={"center"}
                    ml={2}
                  >
                    <Icon
                      as={LuClipboardList}
                      mr={2}
                      color="blue.500"
                      size={"sm"}
                    />
                    {std.criterionName}
                  </Text>
                </Tooltip>

                <CriterionMenuButton
                  criterionId={std.criterionId}
                  onDeleted={handleCriterionDeleted}
                />
              </HStack>
            ))}
      </VStack>

      {!loading && criteria.length === 0 && (
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          height="50vh"
          color="gray.500"
        >
          <Text fontSize="lg">등록된 평가 기준이 없습니다.</Text>
          <Text fontSize="sm" mt={2}>
            오른쪽 상단의 추가 버튼을 통해 새 기준을 생성해 보세요.
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default StandardsPage;
