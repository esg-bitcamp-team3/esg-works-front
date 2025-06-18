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
  borderRadius: "xl",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  _hover: {
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
  },
  overflow: "hidden",
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
    <Flex direction="column" gap="3">
      {/* 기준 추가 버튼 */}
      <Flex width="100%" justifyContent="end">
        <CriterionAddModal />
      </Flex>

      {/* 기준 리스트 */}
      <Box
        {...CARD_STYLES}
        p={2}
        width="70vw"
        minHeight="65vh"
        overflowY="auto"
        padding="8"
      >
        <VStack align="center" width="100%">
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
                    <Skeleton height="36px" width="100%" borderRadius="md" />
                  </Box>
                  {idx < (criteria.length > 0 ? criteria.length : 4) - 1 && (
                    <Skeleton
                      height="2px"
                      width="100%"
                      borderRadius="full"
                      my={1}
                    />
                  )}
                </Box>
              ))
            : criteria.map((std, idx) => (
                <Box key={std.criterionId + "-wrapper"} width="100%">
                  <Box
                    display="flex"
                    gap={2}
                    paddingLeft="6"
                    paddingRight="2"
                    width="100%"
                    height="full"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Tooltip
                      showArrow
                      content="해당 기준의 데이터 입력 화면으로 이동"
                      positioning={{ placement: "right" }}
                      contentProps={{ css: { "--tooltip-bg": "gray" } }}
                      openDelay={500}
                      closeDelay={100}
                    >
                      <Text
                        as="button"
                        fontSize="2xl"
                        textAlign="left"
                        cursor="pointer"
                        width="fit-content"
                        paddingTop="3"
                        paddingBottom="3"
                        onClick={() =>
                          router.push(`/criterion/${std.criterionId}`)
                        }
                        _hover={{ color: "blue.700", fontWeight: "bold" }}
                        background="none"
                        border="none"
                      >
                        {std.criterionName}
                      </Text>
                    </Tooltip>

                    <CriterionMenuButton criterionId={std.criterionId} />
                  </Box>
                  {idx < criteria.length - 1 && (
                    <Separator
                      key={std.criterionId + "-separator"}
                      width="100%"
                      borderColor="gray.200"
                      my={1}
                    />
                  )}
                </Box>
              ))}
        </VStack>
      </Box>
    </Flex>
  );
};

export default StandardsPage;
