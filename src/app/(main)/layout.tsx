import ReportModal from "@/lib/components/modal/document-modal";
import Sidebar from "@/lib/components/Sidebar";
import { Flex } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      bg={"white"}
      h={"100vh"}
      w={"100vw"}
      justifyContent="center"
      alignItems="center"
    >
      <Sidebar />
      <main>{children}</main>
       <ReportModal />
    </Flex>
  );
};

export default Layout;
