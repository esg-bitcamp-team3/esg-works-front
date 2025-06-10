import { Editable, Input } from "@chakra-ui/react";

const EditableTitle = ({
  title,
  onChange,
}: {
  title: string;
  onChange: (newTitle: string) => void;
}) => {
  return (
    <Editable.Root
      textAlign="center"
      defaultValue={title}
      onValueChange={(e) => onChange(e.value)}
      textStyle="xl"
      fontWeight="bold"
      size="lg"
      width={"auto"}
      maxW="md"
    >
      <Editable.Preview
        px={4}
        css={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: "48px",
          fontSize: "xl",
          fontWeight: "bold",
          textAlign: "start",
          justifyContent: "center",
          alignItems: "start",
        }}
      />
      <Editable.Input
        px={4}
        placeholder="제목을 입력하세요"
        css={{
          display: "block",
          width: "100%",
          height: "48px",
          textAlign: "start",
          fontSize: "xl",
          fontWeight: "bold",
        }}
        _focus={{
          borderColor: "#ddd",
          boxShadow: "0 0 0",
          outline: "none",
          height: "48px",
          backgroundColor: "#fafafa",
          fontSize: "xl",
          fontWeight: "bold",
          textAlign: "start",
        }}
      />
    </Editable.Root>
  );
};

export default EditableTitle;
