"use client";

import { getTemplete } from "@/lib/api/get";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    async function fetchTemplete() {
      try {
        const text = await getTemplete();
        if (text) setData(text);
      } catch (e) {
        console.error("템플릿 가져오기 실패:", e);
      }
    }
    fetchTemplete();
  }, []);
  return (
    <div>
      <Text>hello world</Text>
      <Text>{data}</Text>
    </div>
  );
};
export default Page;
