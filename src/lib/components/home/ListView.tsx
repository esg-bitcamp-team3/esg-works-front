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
import { listFilter } from "./ListFilter";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { PiStar, PiStarFill } from "react-icons/pi";
import { ReportDetail } from "@/lib/api/interfaces/report";
import { deleteInterestReports } from "@/lib/api/delete";
import { postInterestReports } from "@/lib/api/post";

interface viewProps {
  filter1: string;
  filter2: string;
  asc: boolean;
}

const ListView = ({ filter1, filter2, asc }: viewProps) => {
  const viewList = listFilter(filter1, asc) || [];

  const [page, setPage] = useState(1);
  const pageSize = 6;
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;
  const visibleItems = viewList?.slice(startRange, endRange);

  const [localList, setLocalList] = useState<ReportDetail[]>(viewList);

  useEffect(() => {
    setLocalList(viewList); // filter1, asc 변경 시 업데이트
  }, [viewList]);

  const clickFavorite = async (report: ReportDetail, index: number) => {
    try {
      if (report.isInterestedReport) {
        await deleteInterestReports(report.id);
      } else {
        await postInterestReports(report.id);
      }
      const newList = [...localList];
      newList[startRange + index].isInterestedReport =
        !report.isInterestedReport;
      setLocalList(newList);
    } catch (error) {
      console.log("즐겨찾기 실패", error);
    }
  };

  return (
    <VStack w={"100%"}>
      {filter2 === "list" ? (
        <Stack gap={4} w="100%" h={"100%"}>
          {localList?.map((report, index) => {
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
                  <HStack>
                    <Text color="gray.500" fontSize="sm" ml={4}>
                      {report.updatedBy.name}
                    </Text>
                    <Text color="gray.500" fontSize="sm" ml={4}>
                      {formatted}
                    </Text>
                    <Button
                      bg={"white"}
                      onClick={() => clickFavorite(report, index)}
                    >
                      {report.isInterestedReport ? (
                        <PiStarFill color="gold" size={20} />
                      ) : (
                        <PiStar color="black" size={20} />
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
