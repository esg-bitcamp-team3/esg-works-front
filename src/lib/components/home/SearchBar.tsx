// export default function SearchBar({
//   keyword,
//   setKeyword,
// }: {
//   keyword: string;
//   setKeyword: (v: string) => void;
// }) {
//   return (
//     <input
//       type="text"
//       value={keyword}
//       onChange={(e) => setKeyword(e.target.value)}
//       placeholder="검색"
//       style={{ borderRadius: "10px", padding: "0.5rem", width: "300px" }}
//     />
//   );
// }

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

// export default function SearchBar({ keyword, setKeyword }: SearchBarProps) {
//   return (
//     <InputGroup
//       startElement={
//         <Box pl="3" display="flex" alignItems="center">
//           <TbSearch />
//         </Box>
//       }
//       alignItems="start"
//       w="2xl"
//     >
//       <Input
//         placeholder="검색"
//         borderRadius="2xl"
//         size="lg"
//         p="2"
//         value={keyword}
//         onChange={(e) => setKeyword(e.target.value)}
//       />
//     </InputGroup>
//   );
// }
