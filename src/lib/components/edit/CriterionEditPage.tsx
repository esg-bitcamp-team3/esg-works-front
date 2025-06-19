import {
  Accordion,
  Box,
  Button,
  Editable,
  Flex,
  HStack,
  IconButton,
  Input,
  Popover,
  Portal,
  Spinner,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { searchGRIData } from "@/lib/api/get";
import { Section } from "@/lib/interface";
import SectionSelector from "../section/SectionSelector";
import CategoryList from "../section/CategoryList";
import EditableCategoryList from "./CategoryList";
import { LuX } from "react-icons/lu";
import { deleteSection } from "@/lib/api/delete";
import { FaRegTrashCan } from "react-icons/fa6";
import { patchSection } from "@/lib/api/patch";

const CriterionEditPage = () => {
  const [criterion, setCriterion] = useState<string>("new");
  const [section, setSection] = useState<Section[]>([]);
  const [sectionId, setSectionId] = useState<string>("");
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [query, setQuery] = useState<string>("");
  const [year, setYear] = useState<string>("2020");
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [updateLoading, setUpdateLoading] = useState<string>("");

  const handleSectionChange = (sectionId: string) => {
    setSectionId(sectionId);
    if (!sectionId) {
      setSection(sectionList);
      return;
    }
    const selectedSection = sectionList.find(
      (item) => item.sectionId === sectionId
    );
    if (selectedSection) {
      setSection([selectedSection]);
    } else {
      setSection([]);
    }
  };

  const handleSectionRemove = async (sectionId: string) => {
    try {
      const data = await deleteSection(sectionId);

      if (data) {
        setSectionList((prev) =>
          prev.filter((item) => item.sectionId !== sectionId)
        );
        setSection((prev) =>
          prev.filter((item) => item.sectionId !== sectionId)
        );
        if (sectionId === value) {
          setValue("");
        }
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      return;
    }
  };

  const handleSectionNameChange = async (
    sectionId: string,
    newName: string
  ) => {
    setSection((prev) =>
      prev.map((section) =>
        section.sectionId === sectionId
          ? { ...section, sectionName: newName }
          : section
      )
    );
  };
  const handleSectionNameUpdate = async (sectionId: string) => {
    try {
      setUpdateLoading(sectionId);
      const sectionToUpdate = section.find(
        (section) => section.sectionId === sectionId
      );

      if (!sectionToUpdate) {
        console.error("Section not found");
        return;
      }
      const data = await patchSection(sectionId, {
        sectionName: sectionToUpdate.sectionName,
      });
    } catch (error) {
      console.error("Error updating section name:", error);
    } finally {
      setUpdateLoading("");
    }
  };

  useEffect(() => {
    setSection(sectionList);
  }, [sectionList]);

  return (
    <Box w="100%" h="100%" pt={4} pb={4} overflow={"auto"}>
      {}
      <HStack justifyContent="space-between" w="100%" alignItems={"center"}>
        <SectionSelector
          sectionList={sectionList}
          setSectionList={setSectionList}
          criterionId={criterion}
          value={sectionId}
          onValueChange={handleSectionChange}
          loading={loading}
          setLoading={setLoading}
        />
      </HStack>
      <Box>
        {loading ? (
          <Box width="100%" p={8} textAlign="center">
            <Spinner />
          </Box>
        ) : (
          <Accordion.Root
            collapsible
            width="100%"
            value={[value]}
            onValueChange={(e) => setValue(e.value[0])}
            borderWidth="1px"
            size={"sm"}
          >
            {section.map((item, index) => (
              <Accordion.Item
                key={index}
                value={item.sectionId}
                overflow="hidden"
                _hover={{ borderColor: "blue.200" }}
                transition="all 0.2s ease"
              >
                <Accordion.ItemTrigger asChild>
                  <Box
                    bg="white"
                    _hover={{ bg: "blue.50" }}
                    _expanded={{
                      bg: "blue.50",
                    }}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    height={"100%"}
                    p={4}
                    onClick={(e) => {
                      value !== item.sectionId
                        ? setValue(item.sectionId)
                        : setValue("");
                      e.stopPropagation();
                    }}
                    cursor="pointer"
                  >
                    {updateLoading === item.sectionId ? (
                      <Spinner size="sm" p={2} m={2} />
                    ) : (
                      <>
                        <Editable.Root
                          defaultValue="Double click to edit"
                          activationMode="dblclick"
                          bg="transparent"
                          value={item.sectionName}
                          onValueChange={(e) =>
                            handleSectionNameChange(item.sectionId, e.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Editable.Preview />
                          <Editable.Input
                            borderWidth={"1px"}
                            borderColor="gray.300"
                            bg="transparent"
                            _focus={{ borderColor: "gray.300" }}
                            onBlur={() =>
                              handleSectionNameUpdate(item.sectionId)
                            }
                          />
                        </Editable.Root>
                        <HStack>
                          <Popover.Root>
                            <Popover.Trigger asChild>
                              <IconButton
                                size={"xs"}
                                aria-label="Remove Section"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <LuX />
                              </IconButton>
                            </Popover.Trigger>
                            <Portal>
                              <Popover.Positioner>
                                <Popover.Content>
                                  <Popover.Arrow />
                                  <Popover.Body>
                                    <Popover.Title fontWeight="medium">
                                      {item.sectionName}을 삭제하시겠습니까?
                                    </Popover.Title>
                                  </Popover.Body>
                                  <Popover.Footer
                                    display="flex"
                                    justifyContent="end"
                                  >
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      colorPalette="red"
                                      onClick={() =>
                                        handleSectionRemove(item.sectionId)
                                      }
                                    >
                                      삭제
                                    </Button>
                                  </Popover.Footer>
                                </Popover.Content>
                              </Popover.Positioner>
                            </Portal>
                          </Popover.Root>
                          <Accordion.ItemIndicator />
                        </HStack>
                      </>
                    )}
                  </Box>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>
                    {value === item.sectionId && (
                      <Table.Root
                        size="sm"
                        showColumnBorder={false}
                        variant={"line"}
                        border={"none"}
                        bg="white"
                      >
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeader
                              width={"30%"}
                              justifyContent={"center"}
                              textAlign={"center"}
                              fontSize={"sm"}
                            >
                              이름
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                              width={"20%"}
                              justifyContent={"center"}
                              textAlign={"center"}
                              fontSize={"sm"}
                            >
                              단위
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                              width={"40%"}
                              justifyContent={"center"}
                              textAlign={"center"}
                              fontSize={"sm"}
                            >
                              설명
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                              width={"10%"}
                              justifyContent={"center"}
                              textAlign={"center"}
                              fontSize={"sm"}
                            >
                              {" "}
                            </Table.ColumnHeader>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          <EditableCategoryList
                            key={item.sectionId}
                            sectionId={item.sectionId}
                          />
                        </Table.Body>
                      </Table.Root>
                    )}
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        )}
      </Box>
    </Box>
  );
};

export default CriterionEditPage;
