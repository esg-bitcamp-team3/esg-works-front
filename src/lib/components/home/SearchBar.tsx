import { Input, InputGroup, Box } from "@chakra-ui/react";
import { TbSearch } from "react-icons/tb";
import React from "react";

interface SearchBarProps {
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
}

const SearchBar = ({ keyword, setKeyword, onSearch }: SearchBarProps) => (
  <Input
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    placeholder="검색"
    borderRadius="2xl"
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        onSearch();
      }
    }}
  />
);
export default SearchBar;
