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
  Tabs,
  TabsContent,
  Flex,
  Skeleton,
  Icon,
  Image,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { PiStar, PiStarFill } from "react-icons/pi";
import { ReportDetail } from "@/lib/api/interfaces/report";
import { deleteInterestReports } from "@/lib/api/delete";
import { postInterestReports } from "@/lib/api/post";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { LuFiles } from "react-icons/lu";

interface TabContentProps {
  value: string;
  children: React.ReactNode;
}
const TabContent = ({ value, children }: TabContentProps) => {
  return (
    <Tabs.Content
      key={value}
      value={value}
      inset="0"
      _open={{
        animationName: "fade-in, scale-in",
        animationDuration: "300ms",
      }}
      height={"auto"}
    >
      {children}
    </Tabs.Content>
  );
};

interface ContentProps {
  visibleItems: ReportDetail[];
  goReport: (id: string) => void;
  clickFavorite: (report: ReportDetail) => void;
  loading: boolean;
}

const ListContent = ({
  visibleItems,
  goReport,
  clickFavorite,
  loading,
}: ContentProps) => {
  if (loading) {
    return (
      <Box w="100%">
        <Skeleton height="50px" mb={4} />
        <Skeleton height="50px" mb={4} />
        <Skeleton height="50px" mb={4} />
      </Box>
    );
  }
  return (
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
            h="66px"
            display="flex"
            alignItems="center"
            px={4}
            onClick={() => goReport(report.id)}
            _hover={{ cursor: "pointer", bg: "gray.100" }}
          >
            <HStack padding={4} gap={4} justifyContent="space-between" w="100%">
              <HStack gap="6">
                {/* <Icon
                  size="sm"
                  marginRight="2"
                  color="gray.600"
                  justifyItems="center"
                  alignItems="center"
                >
                  <LuFiles />
                </Icon> */}

                <Image height="28px" src="word-icon.png" />

                <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                  {report.title}
                </Text>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    clickFavorite(report);
                  }}
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
  );
};

const GridContent = ({
  visibleItems,
  goReport,
  clickFavorite,
  loading,
}: ContentProps) => {
  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={10} w="100%">
        {Array.from({ length: 3 }).map((_, idx) => (
          // <Box
          //   key={idx}
          //   borderRadius="md"
          //   shadow="md"
          //   overflow="hidden"
          //   w="100%"
          //   gap={4}
          // >
          <Skeleton key={idx} height="180px" />
          // </Box>
        ))}
      </SimpleGrid>
    );
  }
  return (
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
            onClick={() => goReport(report.id)}
            _hover={{ cursor: "pointer", bg: "gray.100" }}
          >
            <Box
              bg="blue.100"
              h="160px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Image height="70px" src="word-icon.png" />
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
              <Box
                display="column"
                justifyContent="space-between"
                alignItems="center"
                w="100%"
                gapY="4"
              >
                <HStack justifyContent="space-between">
                  <VStack>
                    <Text
                      truncate
                      width="100%"
                      color="gray.600"
                      fontSize="sm"
                      fontWeight="semibold"
                    >
                      {report.title}
                    </Text>
                    <HStack gapX="1" width="100%">
                      <Text color="gray.500" fontSize="sm">
                        {report.updatedBy.name}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        -
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        {formatted}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* <Button
                    bg={"white"}
                    onClick={() => clickFavorite(report)}
                    boxSize={6}
                  >
                    {report.isInterestedReport ? (
                      <PiStarFill color="#FFB22C" />
                    ) : (
                      <PiStar color="gray" />
                    )}
                  </Button> */}

                  <IconButton
                    aria-label="Star"
                    variant="plain"
                    onClick={() => clickFavorite(report)}
                    size="md"
                    padding="0"
                  >
                    {report.isInterestedReport ? (
                      <PiStarFill color="#FFB22C" />
                    ) : (
                      <PiStar color="gray" />
                    )}
                  </IconButton>
                </HStack>
              </Box>
            </Box>
          </Box>
        );
      })}
    </SimpleGrid>
  );
};

interface ListViewProps {
  filter: "all" | "recent" | "interest";
  filter2: "list" | "layout";
  keyword: string;
}

export default function ListView({ keyword, filter, filter2 }: ListViewProps) {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const [data, setData] = useState<ReportDetail[]>();
  const visibleItems = data?.slice(startRange, endRange);

  const [loading, setLoading] = useState(true);

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
  }, [keyword, filter]);

  const clickFavorite = async (report: ReportDetail) => {
    try {
      if (report.isInterestedReport) {
        await deleteInterestReports(report.id);
      } else {
        await postInterestReports(report.id);
      }
      setData((prev = []) =>
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

  if (data && data.length === 0) {
    return <Text>검색 결과가 없습니다.</Text>;
  }

  return (
    <VStack w="100%" gap={4}>
      <Box w={"100%"} position="relative">
        <Tabs.Root
          value={filter2}
          w="100%"
          defaultValue={"list"}
          // height={"auto"}
        >
          <TabContent value="list">
            <ListContent
              visibleItems={visibleItems || []}
              goReport={goReport}
              clickFavorite={clickFavorite}
              loading={loading}
            />
          </TabContent>
          <TabContent value="layout">
            <GridContent
              visibleItems={visibleItems || []}
              goReport={goReport}
              clickFavorite={clickFavorite}
              loading={loading}
            />
          </TabContent>
        </Tabs.Root>
      </Box>

      {/* pagination =============== */}
      <Box position="fixed" bottom="14" w="100%" justifyItems="center">
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
      </Box>
    </VStack>
  );
}
