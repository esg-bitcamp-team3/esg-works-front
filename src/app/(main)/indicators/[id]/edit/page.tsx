"use client";

import CriterionEditPage from "@/lib/components/edit/CriterionEditPage";
import { Box, Flex } from "@chakra-ui/react";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}
const Page = ({ params }: Props) => {
  const { id } = use(params);
  return (
    <Flex direction="column" align="center" justify="center">
      <Box
        width="70vw"
        minHeight="65vh"
        maxHeight="65vh"
        top={24}
        position={"fixed"}
      >
        <CriterionEditPage criterionId={id} />
      </Box>
    </Flex>
  );
};
export default Page;
