import Sidebar from "@/lib/components/Sidebar";
import { Flex } from "@chakra-ui/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex bg={"gray.100"} minHeight="100vh">
      <Sidebar />
      <main>{children}</main>
    </Flex>
  );
};

export default Layout;
