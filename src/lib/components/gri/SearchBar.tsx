import { getCategory } from "@/lib/api/get";
import { Category } from "@/lib/interface";
import { Box, Input, InputGroup, Text, VStack } from "@chakra-ui/react";
import { RefObject, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchProp {
  searching: (categoryId: string) => void;
}

const SearchBar = ({ searching }: SearchProp) => {
  const [search, setSearch] = useState("");
  const [categoryList, setCategoryList] = useState<Category[]>();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCategory();

        if (data) {
          console.log("name", data[0]?.categoryName);
          setCategoryList(data);
        } else {
          console.log("sadfdsaf");
          setCategoryList([]);
        }
      } catch (error) {
        console.log("fetch error", error);
      }
    };
    fetch();
  }, []);

  const filtered = categoryList?.filter((cat) => {
    const name = cat.categoryName ?? "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelect = (cat: Category) => {
    setSearch(cat.categoryName);
    searching(cat.categoryId);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryList]);
  return (
    <Box>
      <InputGroup
        startElement={
          <Box pl="4" display="flex" alignItems="center">
            <FaSearch color="#2F6EEA" />
          </Box>
        }
        alignItems="start"
        w="md"
      >
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          flex={1}
          bg={"white"}
          borderWidth="1px" // 테두리 두께를 1px로 설정
          marginX={4}
        />
      </InputGroup>
      {showSuggestions && (filtered?.length ?? 0) > 0 && (
        <Box
          position="absolute"
          top="100%"
          mt={1}
          w="100%"
          bg="white"
          border="1px solid #e2e8f0"
          borderRadius="md"
          boxShadow="md"
          zIndex={10}
          maxH="200px"
          overflowY="auto"
        >
          <VStack gap={0} align="stretch">
            {filtered?.map((cat) => (
              <Box
                key={cat.categoryId}
                px={4}
                py={2}
                _hover={{ bg: "gray.100", cursor: "pointer" }}
                onClick={() => handleSelect(cat)}
              >
                <Text>{cat.categoryName}</Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
