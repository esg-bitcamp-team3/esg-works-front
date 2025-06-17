import { Box, Input, InputGroup } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
}

const SearchBar = ({ query, onQueryChange, onSearch }: SearchBarProps) => {
  return (
    <InputGroup
      startElement={
        <Box display="flex">
          <FaSearch color="#2F6EEA" />
        </Box>
      }
      alignItems="start"
      w="100%"
    >
      <Input
        flex={1}
        bg={"white"}
        borderWidth="1px" // 테두리 두께를 1px로 설정
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSearch();
          }
        }}
        placeholder="검색어를 입력하세요"
        size="sm"
      />
    </InputGroup>
  );
};

export default SearchBar;
