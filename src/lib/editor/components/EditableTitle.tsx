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
      m={4}
    >
      <Editable.Preview
        css={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minHeight: "48px",
          padding: "8px 0",
          fontSize: "xl",
          fontWeight: "bold",
          textAlign: "start",
          justifyContent: "center",
          alignItems: "start",
          paddingLeft: "10px",
        }}
      />
      <Editable.Input
        placeholder="제목을 입력하세요"
        css={{
          display: "block",
          width: "100%",
          minHeight: "42px",
          padding: "8px 0",
          textAlign: "start",
          fontSize: "xl",
          fontWeight: "bold",
          paddingLeft: "8px",
        }}
        _focus={{
          borderColor: "#ddd",
          boxShadow: "0 0 0",
          outline: "none",
          backgroundColor: "#fafafa",
          fontSize: "xl",
          fontWeight: "bold",
          textAlign: "start",
          paddingLeft: "8px",
        }}
      />
    </Editable.Root>
  );
};

export default EditableTitle;
