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
      <Flex alignItems="center">
        <Text
          fontSize="3xl"
          fontWeight="bold"
          mb={4}
          textAlign={"start"}
          width="100%"
        >
          평가 항목 리스트
        </Text>
      </Flex>
      <Flex
        alignItems="center"
        mt={6}
        mb={2}
        borderBottom="2px solid"
        borderColor="gray.200"
        pb={3}
        justifyContent="space-between"
        width={"100%"}
        position={"sticky"}
      >
        <HStack>
          <Icon as={LuList} fontSize="2xl" color={highlightColor} />
          <Text fontSize="lg" fontWeight="600" color={highlightColor}>
            목록
          </Text>
          <Badge
            ml={3}
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
                    fontSize="md"
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
                      mr={3}
                      color="blue.500"
                      opacity={0.7}
                      size={"md"}
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
          <Text fontSize="lg">등록된 평가 항목이 없습니다.</Text>
          <Text fontSize="sm" mt={2}>
            오른쪽 상단의 추가 버튼을 통해 새 기준을 생성해 보세요.
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default StandardsPage;
