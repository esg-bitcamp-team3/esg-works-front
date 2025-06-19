import { Input, InputGroup, Box } from "@chakra-ui/react";
import { TbSearch } from "react-icons/tb";
import React, { useState } from "react";

// interface SearchBarProps {
//   onSearch: (keyword: string) => void;
// }

interface SearchBarProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  onSearch: (keyword: string) => void;
}

const SearchBar = ({ keyword, setKeyword, onSearch }: SearchBarProps) => {
  return (
    <Input
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      placeholder="검색"
      borderColor="white"
      bg="white"
      _focus={{ borderColor: "white" }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSearch(keyword);
        }
      }}
    />
  );
};
export default SearchBar;
