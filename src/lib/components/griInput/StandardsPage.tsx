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
  Tag,
  Image,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDisclosureCriteria, getMyCriteria } from "@/lib/api/get";
import type { Criterion } from "@/lib/interface";
import CriterionMenuButton from "../criterion/CriterionMenuButton";
import CriterionAddModal from "../criterion/CriterionAddModal";
import { MdList, MdOutlineArticle } from "react-icons/md";
import { LuClipboardList, LuList } from "react-icons/lu";
import { FaDatabase, FaEarthAmericas } from "react-icons/fa6";
import { BiLogoSass } from "react-icons/bi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaTemperatureHigh } from "react-icons/fa";

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

  const getCriterionDetails = (name: string) => {
    const nameLower = name.toLowerCase();

    if (nameLower.includes("gri")) {
      return {
        icon: IoDocumentTextOutline,
        description: "글로벌 지속가능성 보고 이니셔티브 (GRI) 기준",
        tagText: "GRI",
        tagColor: "green",
        logoPath: "/gri.png",
      };
    } else if (nameLower.includes("sasb")) {
      return {
        icon: BiLogoSass,
        description: "지속가능성 회계 기준 위원회 (SASB) 산업별 공시 기준",
        tagText: "SASB",
        tagColor: "purple",
        logoPath: "/sasb.png",
      };
    } else if (nameLower.includes("tcfd")) {
      return {
        icon: FaTemperatureHigh,
        description: "기후 관련 재무정보 공개 태스크포스 (TCFD) 권고안",
        tagText: "TCFD",
        tagColor: "blue",
        logoPath: "/tcfd.png",
      };
    } else {
      return {
        icon: FaEarthAmericas,
        description: "글로벌 지속가능성 공시 기준 (범용 기준, 전 세계 사용)",
        tagText: "ESG",
        tagColor: "gray",
        logoPath: "/globe.svg",
      };
    }
  };

  const fetchCriteria = async () => {
    setLoading(true);
    try {
      const data = await getDisclosureCriteria();
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
            공시 기준 목록
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
        {/* <CriterionAddModal onCriterionAdded={handleCriterionAdded} /> */}
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
                onClick={() =>
                  router.push(`/disclosure-data/${std.criterionId}`)
                }
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
                  <HStack>
                    <Image
                      src={getCriterionDetails(std.criterionName).logoPath}
                      alt={`${
                        getCriterionDetails(std.criterionName).tagText
                      } logo`}
                      width={"20"}
                      objectFit="contain"
                      mr={1}
                    />
                    <VStack
                      alignItems="start"
                      justifyContent="start"
                      alignContent={"center"}
                      width="100%"
                      gap={0}
                    >
                      <Text
                        fontSize="lg"
                        fontWeight={"500"}
                        textAlign="left"
                        cursor="pointer"
                        background="none"
                        border="none"
                        alignItems="start"
                        justifyContent={"start"}
                        ml={4}
                      >
                        {std.criterionName}
                      </Text>
                      <Flex gap={2} alignItems="center" mt={1} ml={4}>
                        <Text fontSize="sm" color="gray.600">
                          {getCriterionDetails(std.criterionName).description}
                        </Text>
                      </Flex>
                    </VStack>
                  </HStack>
                </Tooltip>
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
