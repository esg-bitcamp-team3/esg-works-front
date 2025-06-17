import { Input } from "@chakra-ui/react";
import { useCallback, useState } from "react";

const SearchInput = ({
  searchCategoryId,
}: {
  searchCategoryId: (s: string) => void;
}) => {
  const [search, setSearch] = useState("");



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
  };

  return (
    <Input
      value={search}
      onChange={handleChange}
      flex={1}
      bg={"white"}
      borderWidth="1px"
      marginX={12}
    />
  );
};
export default SearchInput;
