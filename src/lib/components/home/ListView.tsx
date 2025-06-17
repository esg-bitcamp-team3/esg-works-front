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
  Button,
} from "@chakra-ui/react";
import { FaCopy } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { PiStar, PiStarFill } from "react-icons/pi";
import { Report } from "@/lib/api/interfaces/report";
import { deleteInterestReports } from "@/lib/api/delete";
import { postInterestReports } from "@/lib/api/post";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface ListViewProps {
  filter: "all" | "recent" | "interest";
  filter2: "list" | "layout";
  keyword: string;
  searchTrigger: number;
}

export default function ListView({
  keyword,
  filter,
  filter2,
  searchTrigger,
}: ListViewProps) {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const [data, setData] = useState<Report[]>([]);
  const visibleItems = data?.slice(startRange, endRange);

  const [loading, setLoading] = useState(false);
  console.log("data", data);

  const route = useRouter();
  const goReport = (id: string) => {
    route.push(`/editor/${id}`);
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

  const clickFavorite = async (report: Report) => {
    try {
      if (report.isInterestedReport) {
        await deleteInterestReports(report.id);
      } else {
        await postInterestReports(report.id);
      }
      setData((prev) =>
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

  if (loading) {
    return <div>로딩중...</div>;
  }
  if (!data.length) {
    return <div>검색 결과가 없습니다.</div>;
  }
  return (
    <VStack w="100%">
      {filter2 === "list" ? (
        <Stack gap={4} w="100%">
          {visibleItems.map((report) => {
            const date = new Date(report.updatedAt);
            const formatted =
              date.getFullYear() +
              "/" +
              String(date.getMonth() + 1).padStart(2, "0") +
              "/" +
              String(date.getDate()).padStart(2, "0");

            return (
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
                      {report.updatedBy}
                    </Text>
                    <Text color="gray.500" fontSize="sm" ml={4}>
                      {formatted}
                    </Text>
                    <Button
                      backgroundColor={"transparent"}
                      onClick={() => clickFavorite(report)}
                    >
                      {report.isInterestedReport ? (
                        <PiStarFill color="#FFB22C" />
                      ) : (
                        <PiStar color="gray" />
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
          {visibleItems.map((report) => {
            const date = new Date(report.updatedAt);

            const formatted =
              date.getFullYear() +
              "/" +
              String(date.getMonth() + 1).padStart(2, "0") +
              "/" +
              String(date.getDate()).padStart(2, "0");

            return (
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
                  <Box display="flex" justifyContent="flex-end" w="100%">
                    <HStack align="flex-end">
                      <Text color="gray.500" fontSize="sm">
                        {report.updatedBy}
                      </Text>
                      <Text color="gray.500" fontSize="sm" ml={4}>
                        {formatted}
                      </Text>
                      <Button
                        bg={"white"}
                        onClick={() => clickFavorite(report)}
                        boxSize={6}
                      >
                        {report.isInterestedReport ? (
                          <PiStarFill color="#FFB22C" />
                        ) : (
                          <PiStar color="gray" />
                        )}
                      </Button>
                    </HStack>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </SimpleGrid>
      )}
      <Pagination.Root
        count={data?.length}
        pageSize={pageSize}
        page={page}
        onPageChange={(e) => setPage(e.page)}
      >
        <ButtonGroup variant="ghost" size="sm">
          <Pagination.PrevTrigger asChild>
            <IconButton>
              <HiChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton>
              <HiChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </VStack>
  );
}
