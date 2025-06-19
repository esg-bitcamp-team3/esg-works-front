'use client'

import ReportModal from "@/lib/components/modal/document-modal";
import Sidebar from "@/lib/components/Sidebar";
import { Flex } from "@chakra-ui/react";
import { useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Flex
      bg={"#fafafa"}
      h={"100vh"}
      w={"100vw"}
      justifyContent="center"
      alignItems="center"
    >
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <main
        style={{
          transition: "margin-left 0.3s ease-in-out",
          marginLeft: isExpanded ? "200px" : "60px",
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </main>
      <ReportModal />
    </Flex>
  );
};

export default Layout;