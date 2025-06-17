import {
  ButtonGroup,
  IconButton,
  Box,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Pagination,
} from "@chakra-ui/react";
import { FaCopy } from "react-icons/fa6";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useState, useEffect } from "react";
import axios from "axios";
import ReportCard from "./ReportCard";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { getFavoriteReports, getReports } from "@/lib/api/get";

interface ListViewProps {
  filter: "all" | "recent" | "interest";
  filter2: "list" | "layout";
  keyword: string;
  searchTrigger: number;
}

interface ReportDTO {
  id: string;
  title: string;
  content: string;
  inInterestedReport: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ListView({
  keyword,
  filter,
  filter2,
  searchTrigger,
}: ListViewProps) {
  const [data, setData] = useState<ReportDTO[]>([]);
  const [loading, setLoading] = useState(false);
const ListView = ({ filter, view, asc }: viewProps) => {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const [viewList, setViewList] = useState<ReportDetail[]>([]);
  const visibleItems = viewList?.slice(startRange, endRange);

  const [isLoading, setIsLoading] = useState(true);

  const route = useRouter();
  const goReport = (id: string) => {
    route.push(`/editor/${id}`);
  };

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      let data: ReportDetail[] = [];
      if (filter === "all") {
        data =
          (await getReports({
            sortField: "createdAt",
            direction: asc ? "ASC" : "DESC",
          })) || [];
      } else if (filter === "recent") {
        data =
          (await getReports({
            sortField: "updatedAt",
            direction: asc ? "ASC" : "DESC",
          })) || [];
      } else if (filter === "favorite") {
        data =
          (await getFavoriteReports({
            sortField: "updatedAt",
            direction: asc ? "ASC" : "DESC",
          })) || [];
      }
      setViewList(data || []);
    } catch (error) {
      console.log("fetching error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/reports/search", {
        params: { keyword, filter },
      })
      .then((res) => setData(res.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [searchTrigger, filter]);

  if (loading) {
    return <div>로딩중...</div>;
  }
  if (!data.length) {
    return <div>검색 결과가 없습니다.</div>;
  }
    fetchReports();
  }, [filter, asc]);

  const clickFavorite = async (report: ReportDetail, index: number) => {
    try {
      if (report.isInterestedReport) {
        await deleteInterestReports(report.id);
      } else {
        await postInterestReports(report.id);
      }
      setViewList((prev) =>
        prev.map((item) =>
          item.id === report.id
            ? { ...item, isInterestedReport: !item.isInterestedReport }
            : item
        )
      );
    } catch (error) {
      console.log("즐겨찾기 실패", error);
    }
  };

  if (isLoading) {
    return (
      <Box w="100%">
        <Skeleton height="40px" mb={4} />
        <Skeleton height="40px" mb={4} />
        <Skeleton height="40px" mb={4} />
      </Box>
    );
  }

  return (
    <VStack w="100%">
      {filter2 === "list" ? (
        <Stack gap={4} w="100%">
          {data.map((report) => (
            // ReportCard 컴포넌트가 있으면 아래처럼 사용
            // <ReportCard key={report.id} report={report} />
            <Box
              key={report.id}
              bg="white"
              shadow="md"
              borderRadius="md"
              borderColor="black"
              w="100%"
              h="70px"
              display="flex"
              alignItems="center"
              px={4}
            >
              <HStack
                padding={4}
                gap={4}
                justifyContent="space-between"
                w="100%"
              >
                <HStack>
                  <FaCopy style={{ marginRight: 8 }} />
                  <Text>{report.title}</Text>
                </HStack>
                <VStack>
                  <Text color="gray.500" fontSize="sm">
                    createdAt : {report.createdAt}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    updatedAt : {report.updatedAt}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
    <VStack w={"100%"}>
      {view === "list" ? (
        <Stack gap={4} w="100%" h={"100%"}>
          {visibleItems?.map((report, index) => {
            const date = new Date(report.updatedAt);
            const formatted =
              date.getFullYear() +
              "/" +
              String(date.getMonth() + 1).padStart(2, "0") +
              "/" +
              String(date.getDate()).padStart(2, "0");
            return (
              <Box
                key={index}
                bg="white"
                shadow="md"
                borderRadius="md"
                borderColor="black"
                w="100%"
                h="70px"
                display="flex"
                alignItems="center"
                px={4}
                _hover={{ bg: "gray.100" }}
              >
                <HStack
                  padding={4}
                  gap={4}
                  justifyContent="space-between"
                  w="100%"
                >
                  <HStack onClick={() => goReport(report.id)} cursor="pointer">
                    <FaCopy style={{ marginRight: 8 }} />
                    <Text>{report.title}</Text>
                  </HStack>
                  <HStack>
                    <Text color="gray.500" fontSize="sm" ml={4}>
                      {report.updatedBy.name}
                    </Text>
                    <Text color="gray.500" fontSize="sm" ml={4}>
                      {formatted}
                    </Text>
                    <Button
                      backgroundColor={"transparent"}
                      onClick={() => clickFavorite(report, index)}
                    >
                      {report.isInterestedReport ? (
                        <PiStarFill color="gold" size={20} />
                      ) : (
                        <PiStar color="gray.200" size={20} />
                      )}
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            );
          })}
        </Stack>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={10} w="100%">
          {data.map((report) => (
            <Box
              key={report.id}
              borderRadius="md"
              shadow="md"
              overflow="hidden"
              w="100%"
            >
              <Box bg="blue.100" h="120px">
                <Text color="gray.700">{report.title}</Text>
              </Box>
              <Box
                bg="white"
                px={4}
                py={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
              >
                <VStack align="flex-end">
                  <Text color="gray.500" fontSize="sm">
                    createdAt : {report.createdAt}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    updatedAt : {report.updatedAt}
                  </Text>
                </VStack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
}
