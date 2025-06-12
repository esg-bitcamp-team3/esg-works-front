import { Input, InputGroup, Box } from "@chakra-ui/react";
import { TbSearch } from "react-icons/tb";
import React from "react";

interface SearchBarProps {
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({ keyword, setKeyword }: SearchBarProps) => (
  <Input
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    placeholder="검색"
    borderRadius="2xl"
  />
);
export default SearchBar;
