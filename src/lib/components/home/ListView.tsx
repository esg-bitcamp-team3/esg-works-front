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

interface ListViewProps {
  filter: "all" | "recent" | "interest";
  filter2: "list" | "layout";
  keyword: string;
}

interface ReportDTO {
  id: string;
  title: string;
  content: string;
  inInterestedReport: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ListView({ keyword, filter, filter2 }: ListViewProps) {
  const [data, setData] = useState<ReportDTO[]>([]);
  const [loading, setLoading] = useState(false);

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

// interface viewProps {
//   filter1: string;
//   filter2: string;
// }

// const ListView = ({ filter1, filter2 }: viewProps) => {
//   const viewList = listFilter(filter1) || [];

//   const [page, setPage] = useState(1);
//   const pageSize = 6;
//   const startRange = (page - 1) * pageSize;
//   const endRange = startRange + pageSize;
//   const visibleItems = viewList?.slice(startRange, endRange);

//   return (
//     <VStack w={"100%"}>
//       {filter2 === "list" ? (
//         <Stack gap={4} w="100%" h={"100%"}>
//           {visibleItems?.map((report, index) => (
//             <Box
//               key={index}
//               bg="white"
//               shadow="md"
//               borderRadius="md"
//               borderColor="black"
//               w="100%"
//               h="70px"
//               display="flex"
//               alignItems="center"
//               px={4}
//             >
//               <HStack
//                 padding={4}
//                 gap={4}
//                 justifyContent="space-between"
//                 w="100%"
//               >
//                 <HStack>
//                   <FaCopy style={{ marginRight: 8 }} />
//                   <Text>{report.title}</Text>
//                 </HStack>
//                 <VStack>
//                   <Text color="gray.500" fontSize="sm" ml={4}>
//                     createAt : {report.createAt}
//                   </Text>
//                   <Text color="gray.500" fontSize="sm" ml={4}>
//                     updateAt : {report.updateAt}
//                   </Text>
//                 </VStack>
//               </HStack>
//             </Box>
//           ))}
//         </Stack>
//       ) : (
//         <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={10} w="100%">
//           {visibleItems?.map((report, index) => (
//             <Box
//               key={index}
//               borderRadius="md"
//               shadow="md"
//               overflow="hidden"
//               w="100%"
//             >
//               <Box bg="blue.100" h="120px">
//                 {/* 이미지 or 썸네일 영역 */}
//                 <Text color="gray.700">{report.title}</Text>
//               </Box>
//               <Box
//                 bg="white"
//                 px={4}
//                 py={2}
//                 display="between"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 flexDirection="raw"
//                 gap={2}
//               >
//                 <Box display="flex" justifyContent="flex-end" w="100%">
//                   <VStack align="flex-end">
//                     <Text color="gray.500" fontSize="sm">
//                       createAt : {report.createAt}
//                     </Text>
//                     <Text color="gray.500" fontSize="sm" ml={4}>
//                       updateAt : {report.updateAt}
//                     </Text>
//                   </VStack>
//                 </Box>
//               </Box>
//             </Box>
//           ))}
//         </SimpleGrid>
//       )}
//       <Pagination.Root
//         count={viewList?.length}
//         pageSize={pageSize}
//         page={page}
//         onPageChange={(e) => setPage(e.page)}
//       >
//         <ButtonGroup variant="ghost" size="sm">
//           <Pagination.PrevTrigger asChild>
//             <IconButton>
//               <HiChevronLeft />
//             </IconButton>
//           </Pagination.PrevTrigger>

//           <Pagination.Items
//             render={(page) => (
//               <IconButton variant={{ base: "ghost", _selected: "outline" }}>
//                 {page.value}
//               </IconButton>
//             )}
//           />

//           <Pagination.NextTrigger asChild>
//             <IconButton>
//               <HiChevronRight />
//             </IconButton>
//           </Pagination.NextTrigger>
//         </ButtonGroup>
//       </Pagination.Root>
//     </VStack>
//   );
// };

// export default ListView;
