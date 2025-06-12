import { Input } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";

const SearchInput = ({
  searchCategoryId,
}: {
  searchCategoryId: (s: string) => void;
}) => {
  const [search, setSearch] = useState("");

  // 디바운스된 검색 함수 (300ms 후 실행)
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      searchCategoryId(value);
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    debouncedSearch(val);
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
