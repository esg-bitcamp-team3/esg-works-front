"use client";
import { tokenCheck } from "@/lib/api/auth/auth";
import { User } from "@/lib/interfaces/auth";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Page = () => {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await tokenCheck();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return <Text> test</Text>;
};
export default Page;
