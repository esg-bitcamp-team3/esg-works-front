import {
  Accordion,
  Badge,
  Box,
  Breadcrumb,
  Button,
  Editable,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  Popover,
  Portal,
  Skeleton,
  Spinner,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import {
  getCriterion,
  getCriterionById,
  getSectionsByCriterion,
  searchGRIData,
} from "@/lib/api/get";
import { Criterion, Section } from "@/lib/interface";
import CategoryList from "../section/CategoryList";
import EditableCategoryList from "./CategoryList";
import { LuList, LuX } from "react-icons/lu";
import { deleteSection } from "@/lib/api/delete";
import { FaRegTrashCan } from "react-icons/fa6";
import { patchSection } from "@/lib/api/patch";
import SectionSelector from "./SectionSelector";
import SectionAddModal from "../section/SectionAddModal";

const CriterionEditPage = ({ criterionId }: { criterionId: string }) => {
  const [criterion, setCriterion] = useState<Criterion>();
  const [criterionLoading, setCriterionLoading] = useState<boolean>(true);
  const [section, setSection] = useState<Section[]>([]);
  const [sectionId, setSectionId] = useState<string>("");
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const [query, setQuery] = useState<string>("");
  const [year, setYear] = useState<string>("2020");
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [updateLoading, setUpdateLoading] = useState<string>("");

  const getSections = async () => {
    try {
      setLoading(true);
      const data = (await getSectionsByCriterion(criterionId)) || [];
      setSectionList(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSections();
  }, [criterionId]);

  const fetchCriterion = async () => {
    try {
      setCriterionLoading(true);
      const data = await getCriterionById(criterionId);
      setCriterion(data || undefined);
    } catch (error) {
      console.error("Error fetching criterion data:", error);
    } finally {
      setCriterionLoading(false);
    }
  };

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

  const handleSectionAdded = () => {
    getSections();
  };

  useEffect(() => {
    fetchCriterion();
  }, [criterionId]);

  useEffect(() => {
    setSection(sectionList);
  }, [sectionList]);

  return (
    <Box w="100%" h="100%" overflow={"auto"}>
      <Flex alignItems="center">
        {criterionLoading ? (
          <Skeleton width="200px" height="20px" borderRadius="md" />
        ) : (
          <Breadcrumb.Root size="md">
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/indicators">평가 기준</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link href={`/indicators/${criterion?.criterionId}`}>
                  {criterion?.criterionName}
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />

              <Breadcrumb.Item>
                <Breadcrumb.CurrentLink>
                  {"세부 항목 수정"}
                </Breadcrumb.CurrentLink>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        )}
      </Flex>
      <Flex
        alignItems="center"
        mb={2}
        borderBottom="2px solid"
        borderColor="gray.200"
        pb={3}
        pt={3}
        justifyContent="space-between"
        width={"100%"}
        position={"sticky"}
      >
        <HStack>
          <Icon as={LuList} fontSize="xl" color="blue.500" />
          <Text fontSize="xl" fontWeight="600" color="blue.500">
            세부 항목
          </Text>
          <Badge
            colorScheme="blue"
            borderRadius="full"
            px={2}
            textAlign={"center"}
            justifyContent={"center"}
            justifyItems={"center"}
            alignItems={"center"}
            alignContent={"center"}
            size={"md"}
            fontSize={"xs"}
          >
            {section.length}
          </Badge>
        </HStack>
        <HStack>
          <SectionSelector
            sectionList={sectionList}
            value={sectionId}
            onValueChange={handleSectionChange}
            loading={loading}
            setLoading={setLoading}
          />
          <SectionAddModal
            criterionId={criterionId}
            onSectionAdded={handleSectionAdded}
          />
        </HStack>
      </Flex>

      <VStack
        align="center"
        width="100%"
        gap={4}
        padding={2}
        overflowY="auto"
        maxH={"60vh"}
      >
        {loading ? (
          <Box width="100%" p={8} textAlign="center">
            <Spinner />
          </Box>
        ) : section.length === 0 ? (
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            height="50vh"
            color="gray.500"
          >
            <Text fontSize="lg">세부 평가 항목이 없습니다.</Text>
            <Text fontSize="sm" mt={2}>
              오른쪽 상단의 추가 버튼을 통해 세부 평가 항목을 생성해 보세요.
            </Text>
          </Flex>
        ) : (
          <Accordion.Root
            collapsible
            width="100%"
            value={[value]}
            onValueChange={(e) => setValue(e.value[0])}
            size={"sm"}
            variant={"subtle"}
          >
            {section.map((item, index) => (
              <Accordion.Item
                key={index}
                value={item.sectionId}
                overflow="hidden"
                transition="all 0.2s ease"
              >
                <Accordion.ItemTrigger asChild>
                  <Box
                    _hover={{ bg: "gray.100" }}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    height={"100%"}
                    p={6}
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
                          ml={4}
                          defaultValue="Double click to edit"
                          activationMode="dblclick"
                          bg="transparent"
                          value={item.sectionName}
                          onValueChange={(e) =>
                            handleSectionNameChange(item.sectionId, e.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Editable.Preview
                            width={"40%"}
                            fontSize={"md"}
                            color="gray.700"
                          />
                          <Editable.Input
                            width={"40%"}
                            borderWidth={"1px"}
                            borderColor="gray.300"
                            bg="white"
                            fontSize={"md"}
                            _focus={{ borderColor: "gray.300" }}
                            onBlur={() =>
                              handleSectionNameUpdate(item.sectionId)
                            }
                          />
                        </Editable.Root>
                        <HStack>
                          <Popover.Root size={"xs"}>
                            <Popover.Trigger asChild>
                              <IconButton
                                size={"xs"}
                                aria-label="Remove Section"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <Icon as={LuX} color="gray.800" />
                              </IconButton>
                            </Popover.Trigger>
                            <Portal>
                              <Popover.Positioner>
                                <Popover.Content p={4}>
                                  <Popover.Arrow />
                                  <Popover.Body>
                                    <Popover.Title fontWeight="medium">
                                      {item.sectionName}
                                      {item.sectionName
                                        .slice(-1)
                                        .match(/[가-힣]/)
                                        ? [
                                            ..."뺚뺛뺜뺝뺞뺟뺠뺡뺢뺣뺤뺥뺦뺧뺨뺩뺪뺫뺬뺭뺮뺯뺰뺱뺲뺳뺴뺵뺶뺷뺸뺹뺺뺻뺼뺽뺾뺿뻀뻁뻂뻃뻄뻅뻆뻇뻈뻉뻊뻋뻌뻍뻎뻏뻐뻑뻒뻓뻔뻕뻖뻗뻘뻙뻚뻛뻜뻝뻞뻟뻠뻡뻢뻣뻤뻥뻦뻧뻨뻩뻪뻫뻬뻭뻮뻯뻰뻱뻲뻳뻴뻵뻶뻷뻸뻹뻺뻻뻼뻽뻾뻿뼀뼁뼂뼃뼄뼅뼆뼇뼈뼉뼊뼋뼌뼍뼎뼏뼐뼑뼒뼓뼔뼕뼖뼗뼘뼙뼚뼛뼜뼝뼞뼟뼠뼡뼢뼣뼤뼥뼦뼧뼨뼩뼪뼫뼬뼭뼮뼯뼰뼱뼲뼳뼴뼵뼶뼷뼸뼹뼺뼻뼼뼽뼾뼿뽀뽁뽂뽃뽄뽅뽆뽇뽈뽉뽊뽋뽌뽍뽎뽏뽐뽑뽒뽓뽔뽕",
                                          ].indexOf(
                                            item.sectionName.slice(-1)
                                          ) !== -1
                                          ? "을"
                                          : "를"
                                        : "을"}{" "}
                                      삭제하시겠습니까?
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
                <Accordion.ItemContent padding={4}>
                  <Accordion.ItemBody bg={"white"} p={0}>
                    {value === item.sectionId && (
                      <Table.Root
                        size="sm"
                        showColumnBorder={false}
                        variant={"line"}
                        border={"none"}
                      >
                        <Table.Header>
                          <Table.Row my={2}>
                            <Table.ColumnHeader
                              width={"30%"}
                              justifyContent={"center"}
                              textAlign={"center"}
                              fontSize={"xs"}
                            >
                              이름
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                              width={"20%"}
                              justifyContent={"center"}
                              textAlign={"center"}
                              fontSize={"xs"}
                            >
                              단위
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                              width={"40%"}
                              justifyContent={"center"}
                              textAlign={"center"}
                              fontSize={"xs"}
                            >
                              설명
                            </Table.ColumnHeader>
                            <Table.ColumnHeader
                              width={"10%"}
                              justifyContent={"center"}
                              textAlign={"center"}
                              fontSize={"xs"}
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
      </VStack>
    </Box>
  );
};

export default CriterionEditPage;
