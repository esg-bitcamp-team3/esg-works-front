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
  Skeleton,
} from "@chakra-ui/react";
import { FaCopy } from "react-icons/fa6";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { PiStar, PiStarFill } from "react-icons/pi";
import { ReportDetail } from "@/lib/api/interfaces/report";
import { deleteInterestReports } from "@/lib/api/delete";
import { postInterestReports } from "@/lib/api/post";
import { useRouter } from "next/navigation";
import { getFavoriteReports, getReports } from "@/lib/api/get";

interface viewProps {
  filter: string;
  view: string;
  asc: boolean;
}

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
                borderRadius="md"
                shadow="md"
                overflow="hidden"
                w="100%"
              >
                <Box bg="blue.100" h="120px">
                  {/* 이미지 or 썸네일 영역 */}
                  <Text color="gray.700">{report.title}</Text>
                </Box>
                <Box
                  bg="white"
                  px={4}
                  py={2}
                  display="between"
                  justifyContent="space-between"
                  alignItems="center"
                  flexDirection="raw"
                  gap={2}
                >
                  <Box display="flex" justifyContent="flex-end" w="100%">
                    <HStack align="flex-end">
                      <Text color="gray.500" fontSize="sm">
                        {report.updatedBy.name}
                      </Text>
                      <Text color="gray.500" fontSize="sm" ml={4}>
                        {formatted}
                      </Text>
                      <Button
                        bg={"white"}
                        onClick={() => clickFavorite(report, index)}
                        boxSize={6}
                      >
                        {report.isInterestedReport ? (
                          <PiStarFill color="gold" />
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
        count={viewList?.length}
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
};

export default ListView;
