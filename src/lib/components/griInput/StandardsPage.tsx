import { Box, VStack, Separator, Text, Skeleton, Flex } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMyCriteria } from "@/lib/api/get";
import type { Criterion } from "@/lib/interface";
import CriterionMenuButton from "../criterion/CriterionMenuButton";
import CriterionAddModal from "../criterion/CriterionAddModal";

const CARD_STYLES = {
  bg: "white",
  borderRadius: "2xl",
  boxShadow: "xl",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  _hover: {
    boxShadow: "2xl",
    transform: "translateY(-2px)",
  },
  border: "1px solid",
  borderColor: "gray.100",
};

const ITEM_HOVER = {
  bg: "blue.50",
  borderRadius: "lg",
  transition: "all 0.2s ease",
};

const StandardsPage = () => {
  const router = useRouter();
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCriteria()
      .then((data) => {
        if (data) setCriteria(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Flex direction="column" gap="6" width="full" maxWidth="1200px">
      {/* 기준 추가 버튼 */}
      <Flex width="100%" justifyContent="end" px={4}>
        <CriterionAddModal />
      </Flex>

      {/* 기준 리스트 */}
      <Box
        {...CARD_STYLES}
        p={6}
        width="full"
        minHeight="70vh"
        maxHeight="70vh"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "var(--chakra-colors-blue-200)",
            borderRadius: "20px",
          },
        }}
      >
        <VStack align="stretch" width="100%" gap={4}>
          {loading
            ? Array.from({ length: criteria.length > 0 ? criteria.length : 4 }).map(
                (_, idx) => (
                  <Box key={`skeleton-${idx}`} width="100%">
                    <Box
                      display="flex"
                      gap={4}
                      px={4}
                      py={2}
                      width="100%"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Skeleton height="48px" width="100%" borderRadius="lg" />
                    </Box>
                  </Box>
                )
              )
            : criteria.map((std, idx) => (
                <Box
                  key={std.criterionId + "-wrapper"}
                  width="100%"
                  position="relative"
                  _after={
                    idx < criteria.length - 1
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: "-8px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "96%",
                          height: "1px",
                          bg: "gray.100",
                        }
                      : {}
                  }
                >
                  <Box
                    display="flex"
                    gap={4}
                    px={6}
                    py={3}
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                    _hover={ITEM_HOVER}
                    borderRadius="lg"
                  >
                    <Tooltip
                      showArrow
                      content="해당 기준의 데이터 입력 화면으로 이동"
                      positioning={{ placement: "right" }}
                      contentProps={{
                        css: {
                          "--tooltip-bg": "rgba(0, 0, 0, 0.8)",
                          color: "white",
                          fontSize: "sm",
                        },
                      }}
                      openDelay={300}
                      closeDelay={100}
                    >
                      <Text
                        as="button"
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontWeight="medium"
                        textAlign="left"
                        cursor="pointer"
                        width="fit-content"
                        py={2}
                        onClick={() => router.push(`/criterion/${std.criterionId}`)}
                        _hover={{
                          color: "blue.600",
                          transform: "translateX(4px)",
                        }}
                        transition="all 0.2s ease"
                        background="none"
                        border="none"
                      >
                        {std.criterionName}
                      </Text>
                    </Tooltip>

                    <CriterionMenuButton criterionId={std.criterionId} />
                  </Box>
                </Box>
              ))}
        </VStack>
      </Box>
    </Flex>
  );
};

export default StandardsPage;
