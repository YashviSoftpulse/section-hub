import {
  Badge,
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  EmptyState,
  Grid,
  Icon,
  InlineGrid,
  InlineStack,
  Layout,
  Link,
  List,
  Modal,
  Page,
  RadioButton,
  Select,
  Spinner,
  Text,
  TextContainer,
  TextField,
  Tooltip,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchData,
  getApiURL,
  MyEncryption,
  capitalizeFirstLetter,
} from "../../action";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  ArrowLeftIcon,
  DeleteIcon,
  DesktopIcon,
  DragHandleIcon,
  EditIcon,
  MobileIcon,
  PlusCircleIcon,
  XIcon,
} from "@shopify/polaris-icons";
import { ConfirmationModal, SectionCard } from "../../components";
import Nodata from "/assets/nodata.svg";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setPageSections } from "../../redux/action";
import { useNavigate } from "@tanstack/react-router";


function Create() {
  const [themeList, setThemeList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [pageNameError, setPageNameError] = useState(false);
  const pageData = JSON.parse(localStorage.getItem("pageData"));
  const [selectedPageData, setSelectedPageData] = useState(pageData);
  const [isSave, setIsSave] = useState(true);
  const [addSectionModalOpen, setAddSectionModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedSection, setSelectedSection] = useState(
    pageData?.section_used_details || []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [viewingSection, setViewingSection] = useState(null);
  const [sort, setSort] = useState("Old-New");
  const [themeModal, setThemeModal] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [validateModal, setValidateModal] = useState(false);
  const [sectionIdToDelete, setSectionIdToDelete] = useState(null);
  const [title, setTitle] = useState(pageData?.title || "");
  const [internalName, setInternalName] = useState(
    pageData?.internal_title || "Untitled"
  );
  const [loading, setLoading] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const [saveLoader, setSaveLoader] = useState(false);
  const navigate = useNavigate();
  const [discardModal, setIsDiscardModal] = useState(false);
  const handleSortChange = useCallback((value) => setSort(value), []);
  const [IsMobileView, setIsMobileView] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterCounts, setFilterCounts] = useState({});
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const encryptor = new MyEncryption();
  const urlParams = new URLSearchParams(window.location.search);
  const SHOP = urlParams.get("shop");
  const nodomainShop = SHOP?.replace(".myshopify.com", "");
  const dispatch = useDispatch();
  const sectionsData = useSelector((state) => state.sections.pageSections);

  const Filter = [
    "Banner",
    "Video",
    "Image",
    "Slide",
    "Text",
    "Product",
    "Countdown",
    "Accordion",
    "Announcement",
    "Collection",
    "FAQ",
    "Media",
    "Hotspot",
    "Icon",
    "Tabs",
    "Map",
    "Blog",
    "Contact",
    "Marquee",
    "Newsletter",
    "Timeline",
  ];

  const options = [
    { label: "Old-New", value: "Old-New" },
    { label: "New-Old", value: "New-Old" },
  ];

  const ThemeListing = async () => {
    const response = await fetchData(getApiURL(`/theme_list`));
    if (response.status) {
      setThemeList(response.themes_list);
      const liveTheme = response.themes_list.find(
        (theme) => theme.role === "main"
      );
      if (liveTheme) {
        setSelectedTheme(liveTheme);
      }
    }
  };

  useEffect(() => {
    const modalElement = document.querySelector(".Polaris-Modal-Dialog__Modal");

    if (addSectionModalOpen) {
      modalElement.classList.add("section-img-modal");
    }
  }, [addSectionModalOpen, preview]);

  const fetchListingData = async () => {
    const formdata = new FormData();
    formdata.append("filter", "");
    formdata.append("sort", "bestSeller");
    formdata.append("type", "sections");
    formdata.append("page_builder", true);
    const response = await fetchData(getApiURL(`/listing`), formdata);
    if (response.status) {
      dispatch(setPageSections(response.data));
      const today = new Date().toISOString().split("T")[0];
      sessionStorage.setItem("pageApiCallDate", today);
    }
  };

  useEffect(() => {
    const storedDate = sessionStorage.getItem("pageApiCallDate");
    const today = new Date().toISOString().split("T")[0];

    if (!storedDate || storedDate !== today) {
      fetchListingData();
    }
    ThemeListing();
  }, [searchTerm, sort]);

  const handleViewIconClick = async (section) => {
    setViewingSection(section);
    setAddSectionModalOpen(true);
    setImgLoading(true);
    const formdatas = new FormData();
    formdatas.append(
      "name",
      encryptor.encode(section?.file_name?.replace(/\.liquid$/, ""), 42)
    );
    const preview = await fetchData(getApiURL(`/section-preview`), formdatas);
    setImgLoading(false);
    if (preview.status === true) {
      setPreview(preview);
    }
  };
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    let filtered = sectionsData;

    if (searchTerm) {
      filtered = filtered.filter((section) =>
        section?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilters.length > 0) {
      filtered = filtered.filter((section) =>
        selectedFilters.some((filter) =>
          section?.name?.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    if (
      searchTerm === "" &&
      selectedFilters.length === 0 &&
      sort === "Old-New"
    ) {
      filtered = sectionsData;
    }
    const sorted = sort === "New-Old" ? [...filtered].reverse() : filtered;
    setFilteredData(sorted);

    const counts = Filter.reduce((acc, filter) => {
      acc[filter] = sectionsData.filter((section) =>
        section?.name?.toLowerCase().includes(filter.toLowerCase())
      ).length;
      return acc;
    }, {});
    setFilterCounts(counts);

    const hasMatchingFilters = selectedFilters.some(
      (filter) => counts[filter] > 0
    );
    if (searchTerm && filtered.length === 0) {
      setNoResultsFound(true);
      setNoResultsMessage(
        "No sections found matching your search term. Please try a different search term."
      );
    } else if (!hasMatchingFilters && filtered.length === 0) {
      setNoResultsFound(true);
      setNoResultsMessage(
        "No sections found matching your selected filters. Please try different filters."
      );
    } else {
      setNoResultsFound(false);
      setNoResultsMessage("");
    }
  }, [sectionsData, searchTerm, selectedFilters, sort]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, [sort]);

  const handleFilterChange = (filter) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    );
  };

  const handleAddSectionModal = () => {
    setAddSectionModalOpen(!addSectionModalOpen);
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
  };

  const handlePublish = async () => {
    setLoading(true);
    setPublishSuccess(null);
    const formData = new FormData();
    const assets = selectedSection
      .map((section) => `${section.file_name}`)
      .join(",");
    formData.append("assets", encryptor.encode(assets, 42));
    formData.append("theme_id", encryptor.encode(selectedTheme.id, 42));
    formData.append("title", title);
    formData.append("internal_title", internalName);
    const publishPage = await fetchData(
      getApiURL(`/publish_template`),
      formData
    );
    setLoading(false);
    if (publishPage.status === "true") {
      // if (pageData?.uid) {
      //   const data = new FormData();
      //   data.append("id", pageData.uid);
      //   data.append("shop", SHOP)
      //   // data.append("theme", encryptor.encode(selectedPage?.theme_id, 42))
      //   const result = await fetchData(getApiURL("/delete_template"), data);
      // }
      setPublishSuccess(publishPage);
    } else
      shopify.toast.show(publishPage.message, {
        isError: true,
        duration: 2000,
      });
  };

  useEffect(() => {
    if (
      JSON.stringify(selectedPageData?.section_used_details) ===
      JSON.stringify(selectedSection)
    )
      setIsSave(false);
    else setIsSave(true);
  }, [selectedSection]);

  const handleSave = () => {
    if (selectedSection?.length === 0) {
      setValidateModal(true);
      return false;
    }
    setThemeModal(true);
  };
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(selectedSection);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSelectedSection(items);
  };

  const handleDeleteSection = (id) => {
    setSectionIdToDelete(id);
    setActive(!active);
  };

  const handleDiscardChanges = () => {
    setInternalName(selectedPageData?.internal_title || "");
    setTitle(selectedPageData?.title || "");
    setSelectedSection(selectedPageData?.section_used_details || []);
    setIsDiscardModal(false);
    setSelectedFilters({});
  };

  const handlesaveClick = () => {
    if (selectedSection?.length === 0) {
      setValidateModal(true);
      return false;
    }
    setModalOpen(true);
  };

  const handleCreatePage = async () => {
    const regex = /^[A-Za-z0-9 _-]+$/;
    if (
      internalName?.trim() === "" ||
      internalName === null ||
      internalName === undefined
    ) {
      setPageNameError("Page Internal Name is required");
      return false;
    }
    if (!regex.test(internalName)) {
      setPageNameError("Invalid Input");
      return false;
    }
    if (title?.trim() === "" || title === null || title === undefined) {
      setTitleError("Page Title is required");
      return false;
    }
    if (!regex.test(title)) {
      setTitleError("Invalid Input");
      return false;
    }
    setPageNameError(false);
    setTitleError(false);
    setSaveLoader(true);
    const formData = new FormData();
    const assets = selectedSection
      .map((section) => `${section.file_name}`)
      .join(",");
    formData.append("assets", encryptor.encode(assets, 42));
    // formData.append("theme_id", encryptor.encode(selectedTheme.id, 42));
    formData.append("title", title);
    formData.append("unpublished", true);
    if (selectedPageData?.uid) {
      formData.append("uid", selectedPageData.uid);
    }
    formData.append("internal_title", internalName);
    const publishPage = await fetchData(
      getApiURL(`/publish_template`),
      formData
    );
    if (publishPage.status === true) {
      const data = new FormData();
      data.append("type", "My pages");
      const result = await fetchData(getApiURL(`/list_of_templates`), data);
      if (result.status === true) {
        if (selectedPageData?.uid) {
          setSelectedPageData(
            result.data?.filter((obj) => obj.uid === selectedPageData.uid)
          );
        } else {
          setSelectedPageData(result.data[0]);
        }
        // setPageList(result.data);
      }
      setSaveLoader(false);
      setModalOpen(false);
      setIsSave(false);
      setPublishSuccess(publishPage);
      shopify.toast.show("Page Saved Successfully.", { duration: 2000 });
    } else
      shopify.toast.show(publishPage.message, {
        isError: true,
        duration: 2000,
      });
  };

  const handleConfirmDelete = () => {
    handleDeleteSection(sectionIdToDelete);
    setSelectedSection((prevSelectedSections) =>
      prevSelectedSections.filter(
        (section, index) => index !== sectionIdToDelete
      )
    );
    setActive(!active);
  };

  const handleSelectedSection = (section) => {
    const uniqueSection = {
      ...section,
      id: `${section.id}-${Date.now()}`,
    };

    setSelectedSection((prevSelectedSection) => [
      ...prevSelectedSection,
      uniqueSection,
    ]);
    setSelectedFilters([]);
    setSearchTerm("");
    handleAddSectionModal();
  };

  return (
    <Page
   subtitle="
          Build faster, sell smarter — unlock beautiful sections, craft standout
          pages, and elevate your brand."
      title={
        selectedPageData && isSave === false ? (
          <span>
            {internalName || "Untitled"}{" "}
            <Tooltip content="Click to Edit" dismissOnMouseOut width="wide">
              <Button
                onClick={() => handlesaveClick()}
                variant="plain"
                icon={EditIcon}
              />
            </Tooltip>
          </span>
        ) : (
          internalName || "Untitled"
        )
      }
      backAction={{
        onAction: () =>
          navigate({
            to: `/page-builder${window.location.search}`,
          }),
      }}
      secondaryActions={
        isSave &&
        selectedSection?.length > 0 && (
          <Button onClick={() => setIsDiscardModal(true)}>Discard</Button>
        )
      }
      primaryAction={
        isSave
          ? {
              content: "Save",
              onAction: () => handlesaveClick(),
            }
          : {
              content: "Publish",
              onAction: () => handleSave(),
            }
      }
    >
      <Layout>
        <Layout.Section>
          <div className="sticky-grid-column">
            <Grid columns={{ sm: 3 }}>
              <div
                style={{ minWidth: "14.44rem" }}
                className="Polaris-Grid-Cell Polaris-Grid-Cell--cell_6ColumnXs Polaris-Grid-Cell--cell_4ColumnSm Polaris-Grid-Cell--cell_1ColumnMd Polaris-Grid-Cell--cell_3ColumnLg Polaris-Grid-Cell--cell_3ColumnXl "
              >
                <Card>
                  <BlockStack gap={500}>
                    <Text variant="headingXs" as="h6">
                      Sections
                    </Text>
                    <Divider />
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                      <Droppable droppableId="droppable">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            <BlockStack gap={200}>
                              {selectedSection.map((sec, index) => (
                                <Draggable
                                  key={index}
                                  draggableId={index.toString()}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <InlineStack
                                        align="space-between"
                                        gap={200}
                                      >
                                        <InlineStack gap={200}>
                                          <Icon source={DragHandleIcon} />
                                          <Text>{sec.name}</Text>
                                        </InlineStack>
                                        <Tooltip
                                          content="Click to Delete"
                                          dismissOnMouseOut
                                          width="wide"
                                        >
                                          <Button
                                            icon={DeleteIcon}
                                            variant="plain"
                                            tone="critical"
                                            onClick={() =>
                                              handleDeleteSection(index)
                                            }
                                          />
                                        </Tooltip>
                                      </InlineStack>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </BlockStack>
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                    <Button
                      icon={PlusCircleIcon}
                      variant="Plain"
                      tone="info"
                      onClick={handleAddSectionModal}
                    >
                      Add Section
                    </Button>
                  </BlockStack>
                </Card>
              </div>
              <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 2, lg: 9, xl: 9 }}>
                <Card>
                  <BlockStack gap={400}>
                    {selectedSection?.length === 0 ? (
                      <EmptyState
                        heading="No Sections Added"
                        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                        action={{
                          content: "Add Sections",
                          onAction: handleAddSectionModal,
                        }}
                      >
                        <p>
                          To begin building your page, please select and add
                          sections.
                        </p>
                        <p>
                          Sections are essential for customizing and organizing
                          your content.
                        </p>
                      </EmptyState>
                    ) : (
                      <div className="page-img-modal">
                        <BlockStack gap={800}>
                          {/* <InlineStack gap={200} align="center">
                            <Button
                              icon={DesktopIcon}
                              onClick={() => setIsDesktop(true)}
                              pressed={isDesktop ? true : false}
                            />
                            <Button
                              onClick={() => setIsDesktop(false)}
                              pressed={isDesktop ? false : true}
                              icon={MobileIcon}
                            />
                          </InlineStack> */}

                          {selectedSection.map((section, index) => (
                            <img
                              alt={section.name}
                              key={index}
                              width="100%"
                              height="100%"
                              style={{
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                              src={section.page_builder_preview_img[0]}
                            />
                          ))}
                        </BlockStack>
                      </div>
                    )}
                    {selectedSection?.length > 0 && <Divider />}

                    {selectedSection?.length > 0 && (
                      <div style={{ textAlign: "center" }}>
                        <Button
                          icon={PlusCircleIcon}
                          variant="plain"
                          tone="info"
                          onClick={handleAddSectionModal}
                        >
                          Add Section
                        </Button>
                      </div>
                    )}
                  </BlockStack>
                </Card>
              </Grid.Cell>
            </Grid>
          </div>
        </Layout.Section>
        <Layout.Section />
        <Layout.Section />
      </Layout>

      <Modal
        open={addSectionModalOpen}
        onClose={() => {
          handleAddSectionModal(), setIsMobileView(false);
          setViewingSection(null);
          setSelectedFilters([]);
          setSearchTerm("");
        }}
        title={
          viewingSection !== null ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                minWidth: "33.25rem",
              }}
            >
              <InlineStack gap={200}>
                <Button
                  variant="monochromePlain"
                  size="micro"
                  onClick={() => {
                    setViewingSection(null);
                    setIsMobileView(false);
                  }}
                  icon={ArrowLeftIcon}
                />
                <Text>{viewingSection.name}</Text>
              </InlineStack>
              <InlineStack
                gap={200}
                alignment="center"
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <Button
                  onClick={() => setIsMobileView(false)}
                  pressed={IsMobileView ? false : true}
                >
                  <Icon tone="base" source={DesktopIcon} />
                </Button>
                <Button
                  onClick={() => setIsMobileView(true)}
                  pressed={IsMobileView ? true : false}
                >
                  <Icon source={MobileIcon} />
                </Button>
              </InlineStack>
            </div>
          ) : (
            "Add Sections"
          )
        }
        size="large"
      >
        <Modal.Section>
          {viewingSection ? (
            imgLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20%",
                }}
              >
                <Spinner accessibilityLabel="Loading images" size="large" />
              </div>
            ) : (
              <div style={{ display: "flex" }}>
                <iframe
                  title="Section Preview"
                  srcDoc={preview?.data}
                  style={
                    IsMobileView
                      ? {
                          width: "380px",
                          maxWidth: "767px",
                          height: "75vh",
                          border: "none",
                          margin: "0px auto",
                        }
                      : {
                          width: "100%",
                          height: "75vh",
                          border: "none",
                        }
                  }
                />
              </div>
            )
          ) : (
            <BlockStack gap={300}>
              {/* <InlineStack align="space-between"> */}
              <Text variant="headingMd" as="h6">
                Sections
              </Text>

              {/* <InlineStack align="end" gap={200}>
                  <Select
                    label="Sort by"
                    labelInline
                    options={options}
                    onChange={(value) => handleSortChange(value)}
                    value={sort}
                  />
                </InlineStack> */}
              {/* </InlineStack> */}

              <TextField
                fullWidth
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search for a section ..."
                suffix={
                  searchTerm && (
                    <span
                      onClick={clearSearch}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <Icon source={XIcon} onClick={clearSearch} />
                    </span>
                  )
                }
                connectedRight={
                  <Select
                    label={`Sort by : ${sort}`}
                    labelInline
                    options={options}
                    onChange={(value) => handleSortChange(value)}
                    value={sort}
                  />
                }
              />
              <div
                className="Polaris-Grid"
                style={{ alignItems: "flex-start" }}
              >
                <div
                  className="Polaris-Grid-Cell Polaris-Grid-Cell--cell_3ColumnXs Polaris-Grid-Cell--cell_2ColumnSm Polaris-Grid-Cell--cell_15ColumnMd Polaris-Grid-Cell--cell_3ColumnLg Polaris-Grid-Cell--cell_3ColumnXl"
                  style={{
                    position: "sticky",
                    top: "20px",
                  }}
                >
                  <Card>
                    <BlockStack gap={300}>
                      <Text as="h2" variant="headingMd">
                        Filters
                      </Text>
                      <Divider />
                      <div className="modal-filter-options">
                        {Filter.map((filter) => (
                          <Checkbox
                            key={filter}
                            label={
                              <span class="Polaris-Text--root Polaris-Text--bodySm">{`${filter} ${
                                filterCounts[filter] > 0
                                  ? `(${filterCounts[filter]})`
                                  : `(0)`
                              }`}</span>
                            }
                            checked={selectedFilters.includes(filter)}
                            onChange={() => handleFilterChange(filter)}
                          />
                        ))}
                      </div>
                    </BlockStack>
                  </Card>
                </div>
                <div
                  className="Polaris-Grid-Cell Polaris-Grid-Cell--cell_4ColumnXs Polaris-Grid-Cell--cell_2ColumnSm Polaris-Grid-Cell--cell_2ColumnMd Polaris-Grid-Cell--cell_9ColumnLg Polaris-Grid-Cell--cell_9ColumnXl"
                  style={{
                    height: "100%",
                    display: "flex",
                  }}
                >
                  {noResultsFound ? (
                    <div className="notfound-modal">
                      <img src={Nodata} />
                      <Text variant="bodyXs">{noResultsMessage}</Text>
                    </div>
                  ) : (
                    <div
                      className="Polaris-Grid"
                      style={{
                        height: "fit-content",
                        "--pc-grid-columns-xs": 1,
                        "--pc-grid-columns-sm": 1,
                        "--pc-grid-columns-md": 2,
                        "--pc-grid-columns-lg": 2,
                        "--pc-grid-columns-xl": 2,
                      }}
                    >
                      {filteredData.map((section, index) => {
                        return (
                          <div className="section-card" key={index}>
                            <SectionCard
                              key={index}
                              section={section}
                              handleViewIconClick={handleViewIconClick}
                              handlePublishClick={handleSelectedSection}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </BlockStack>
          )}
        </Modal.Section>
      </Modal>
      <Modal
        open={themeModal}
        onClose={() => {
          if (publishSuccess?.status === "true") {
            setThemeModal(false);
            setPublishSuccess(null);
            navigate(`/page-builder${location.search}`);
          }
          setThemeModal(false);
        }}
        title={
          <Text as="h2" variant="headingMd">
            {publishSuccess?.status === "true"
              ? `${capitalizeFirstLetter(internalName)} Page`
              : "Select Shopify Theme to Publish"}
          </Text>
        }
        secondaryActions={
          publishSuccess?.status === "true"
            ? [
                {
                  content: "Close",
                  onAction: () => {
                    setThemeModal(false);
                    setPublishSuccess(null);
                    navigate({ to: `/page-builder${window.location.search}` });
                  },
                },
                ...(selectedTheme.role === "main"
                  ? [
                      {
                        content: "View",
                        onAction: () =>
                          window.open(
                            `https://${SHOP}/pages/${title
                              ?.toLowerCase()
                              ?.replace(/ /g, "-")}`
                          ),
                      },
                    ]
                  : []),
              ]
            : {
                content: "Add to theme",
                onAction: handlePublish,
                loading: loading,
              }
        }
        primaryAction={
          publishSuccess?.status === "true" && [
            {
              content: "Customize Page",
              onAction: () => window.open(publishSuccess.edit, "blank"),
            },
          ]
        }
        size={publishSuccess?.status == "true" ? "large" : "small"}
      >
        <Modal.Section>
          {publishSuccess?.status === "true" ? (
            <BlockStack gap={200}>
              <InlineGrid gap={100} columns={2}>
                <BlockStack gap={500}>
                  <InlineStack gap={200}>
                    {/* <Icon source={CheckIcon}></Icon> */}
                    <Text variant="bodyLg" as="h2">
                      Your Page has been successfully added and is now ready for
                      customization in your store!
                    </Text>
                  </InlineStack>

                  <List gap="loose" type="number">
                    <List.Item>
                      Go to{" "}
                      <Link
                        url={`https://admin.shopify.com/store/${nodomainShop}/themes/${selectedTheme?.id}/editor`}
                        target="blank"
                      >
                        Theme Customizer
                      </Link>{" "}
                      of Selected Theme
                    </List.Item>
                    <List.Item>
                      Select Page{" "}
                      <b>{title?.toLowerCase()?.replace(/ /g, "-")}</b> Option
                      From the Dropdown{" "}
                    </List.Item>
                  </List>
                  <div>
                    <Button
                      onClick={() => {
                        navigate({
                          pathname: "/page-builder",
                          search: window.location.search,
                        });
                      }}
                    >
                      Add More Pages
                    </Button>
                  </div>
                </BlockStack>
                <InlineStack gap={400}>
                  <div className="drop-down-container">
                    <div className="main-drop-down">
                      <div className="drop-down-header">
                        <div className="main-header">
                          <div className="header-content">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M2 8C2 7.21207 2.15519 6.43185 2.45672 5.7039C2.75825 4.97595 3.20021 4.31451 3.75736 3.75736C4.31451 3.20021 4.97595 2.75825 5.7039 2.45672C6.43185 2.15519 7.21207 2 8 2C8.78793 2 9.56815 2.15519 10.2961 2.45672C11.0241 2.75825 11.6855 3.20021 12.2426 3.75736C12.7998 4.31451 13.2417 4.97595 13.5433 5.7039C13.8448 6.43185 14 7.21207 14 8C14 9.5913 13.3679 11.1174 12.2426 12.2426C11.1174 13.3679 9.5913 14 8 14C6.4087 14 4.88258 13.3679 3.75736 12.2426C2.63214 11.1174 2 9.5913 2 8ZM8 3.28571C7.18014 3.28526 6.37435 3.49875 5.66226 3.90508C4.95017 4.31141 4.35643 4.89651 3.93971 5.60257L5.654 7.316C6.05857 7.72057 6.28571 8.27 6.28571 8.84171V9.28571C6.28571 9.39938 6.33087 9.50839 6.41124 9.58876C6.49161 9.66913 6.60062 9.71429 6.71429 9.71429C7.16894 9.71429 7.60498 9.8949 7.92647 10.2164C8.24796 10.5379 8.42857 10.9739 8.42857 11.4286V12.6954C9.26168 12.6192 10.0595 12.3227 10.7403 11.8365C11.4211 11.3503 11.9604 10.6919 12.3029 9.92857H11.4286C11.2581 9.92857 11.0946 9.86084 10.974 9.74028C10.8534 9.61972 10.7857 9.45621 10.7857 9.28571V8.85714C10.7857 8.68665 10.718 8.52313 10.5974 8.40257C10.4769 8.28202 10.3134 8.21429 10.1429 8.21429H8C7.68629 8.2138 7.38058 8.11525 7.12564 7.93242C6.87071 7.7496 6.67932 7.49164 6.57825 7.19466C6.47717 6.89767 6.47148 6.57652 6.56196 6.27614C6.65244 5.97576 6.83457 5.71118 7.08286 5.51943L7.47971 5.21429C7.52045 5.18266 7.55339 5.1421 7.57598 5.09573C7.59857 5.04937 7.61021 4.99843 7.61 4.94686V4.91257C7.61 4.154 8.14143 3.52057 8.852 3.36286C8.57091 3.31152 8.28574 3.2857 8 3.28571ZM10.4643 3.98C10.3164 4.1758 10.1251 4.33461 9.9054 4.44393C9.68572 4.55325 9.44366 4.6101 9.19829 4.61C9.15852 4.60989 9.11912 4.61764 9.08236 4.6328C9.0456 4.64797 9.0122 4.67025 8.98408 4.69837C8.95596 4.72649 8.93368 4.75989 8.91852 4.79665C8.90335 4.83341 8.8956 4.87281 8.89571 4.91257V4.94686C8.89571 5.45 8.66343 5.924 8.26486 6.23171L7.86886 6.53686C7.83335 6.56484 7.80736 6.6031 7.79443 6.64642C7.7815 6.68974 7.78226 6.73599 7.79661 6.77886C7.81096 6.82172 7.8382 6.85911 7.87461 6.88591C7.91101 6.91271 7.95481 6.92761 8 6.92857H10.1429C10.6172 6.92859 11.075 7.10343 11.4285 7.41969C11.7821 7.73595 12.0067 8.17142 12.0594 8.64286H12.6706C12.796 7.73529 12.6541 6.81084 12.2622 5.98268C11.8704 5.15451 11.2456 4.45856 10.4643 3.98ZM3.28571 8C3.28571 7.62029 3.33029 7.25 3.416 6.896L4.74457 8.22457C4.90743 8.38829 5 8.61029 5 8.84171V9.28571C5 9.74037 5.18061 10.1764 5.5021 10.4979C5.82359 10.8194 6.25963 11 6.71429 11C6.82795 11 6.93696 11.0452 7.01733 11.1255C7.0977 11.2059 7.14286 11.3149 7.14286 11.4286V12.6371C6.05951 12.4365 5.08061 11.8629 4.37604 11.0158C3.67147 10.1688 3.28571 9.10177 3.28571 8Z"
                                fill="#202020"
                              />
                            </svg>
                            <p>
                              Default
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M2.30011 5.20009C2.39039 5.13311 2.49627 5.08101 2.61172 5.04677C2.72717 5.01253 2.84992 4.99682 2.97296 5.00053C3.09599 5.00425 3.21691 5.02731 3.3288 5.06842C3.4407 5.10952 3.54138 5.16785 3.62509 5.24008L7.00002 8.14797L10.3749 5.24008C10.544 5.09422 10.7786 5.00806 11.0271 5.00056C11.2756 4.99306 11.5176 5.06483 11.6999 5.20009C11.8823 5.33534 11.99 5.523 11.9993 5.72178C12.0087 5.92056 11.919 6.11418 11.7499 6.26005L7.6875 9.75991C7.59975 9.83564 7.49339 9.89605 7.37509 9.93736C7.25679 9.97868 7.1291 10 7.00002 10C6.87094 10 6.74325 9.97868 6.62495 9.93736C6.50665 9.89605 6.40029 9.83564 6.31253 9.75991L2.25011 6.26005C2.16639 6.18783 2.10126 6.10312 2.05846 6.01076C2.01566 5.91841 1.99602 5.82021 2.00067 5.72178C2.00531 5.62335 2.03414 5.52662 2.08552 5.43711C2.1369 5.34759 2.20982 5.26705 2.30011 5.20009Z"
                                  fill="#8D8D8D"
                                />
                              </svg>
                            </p>
                          </div>
                          <div className="header-content">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.47138 2.64438C6.66591 2.44125 6.9022 2.2791 7.16532 2.16818C7.42844 2.05727 7.71266 2 8 2C8.28734 2 8.57156 2.05727 8.83468 2.16818C9.0978 2.2791 9.33409 2.44125 9.52862 2.64438L13.0862 6.35925C13.6737 6.97276 13.9998 7.77587 14 8.60945V11.5618C14 12.2085 13.7326 12.8286 13.2565 13.2859C12.7804 13.7431 12.1348 14 11.4615 14H9.84615C9.47893 14 9.12675 13.8599 8.86708 13.6105C8.60742 13.3611 8.46154 13.0228 8.46154 12.6701V10.8969H7.53846V12.6701C7.53846 13.0228 7.39258 13.3611 7.13292 13.6105C6.87325 13.8599 6.52107 14 6.15385 14H4.53846C3.86522 14 3.21955 13.7431 2.7435 13.2859C2.26744 12.8286 2 12.2085 2 11.5618V8.60945C2 7.77604 2.32585 6.97189 2.91385 6.35836L6.47138 2.64438ZM8.50954 3.54517C8.4447 3.47746 8.36593 3.42341 8.27823 3.38643C8.19052 3.34946 8.09578 3.33037 8 3.33037C7.90422 3.33037 7.80948 3.34946 7.72177 3.38643C7.63407 3.42341 7.5553 3.47746 7.49046 3.54517L3.93292 7.25915C3.58036 7.6273 3.38466 8.10924 3.38462 8.60945V11.5618C3.38462 12.1736 3.90154 12.6701 4.53846 12.6701H6.15385V10.8969C6.15385 10.5442 6.29972 10.2059 6.55939 9.9565C6.81906 9.70709 7.17124 9.56698 7.53846 9.56698H8.46154C8.82876 9.56698 9.18094 9.70709 9.44061 9.9565C9.70028 10.2059 9.84615 10.5442 9.84615 10.8969V12.6701H11.4615C12.0985 12.6701 12.6154 12.1736 12.6154 11.5618V8.60945C12.6153 8.10924 12.4196 7.6273 12.0671 7.25915L8.50954 3.54428V3.54517Z"
                                fill="#202020"
                              />
                            </svg>
                            <p>
                              Home Page
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M2.30011 5.20009C2.39039 5.13311 2.49627 5.08101 2.61172 5.04677C2.72717 5.01253 2.84992 4.99682 2.97296 5.00053C3.09599 5.00425 3.21691 5.02731 3.3288 5.06842C3.4407 5.10952 3.54138 5.16785 3.62509 5.24008L7.00002 8.14797L10.3749 5.24008C10.544 5.09422 10.7786 5.00806 11.0271 5.00056C11.2756 4.99306 11.5176 5.06483 11.6999 5.20009C11.8823 5.33534 11.99 5.523 11.9993 5.72178C12.0087 5.92056 11.919 6.11418 11.7499 6.26005L7.6875 9.75991C7.59975 9.83564 7.49339 9.89605 7.37509 9.93736C7.25679 9.97868 7.1291 10 7.00002 10C6.87094 10 6.74325 9.97868 6.62495 9.93736C6.50665 9.89605 6.40029 9.83564 6.31253 9.75991L2.25011 6.26005C2.16639 6.18783 2.10126 6.10312 2.05846 6.01076C2.01566 5.91841 1.99602 5.82021 2.00067 5.72178C2.00531 5.62335 2.03414 5.52662 2.08552 5.43711C2.1369 5.34759 2.20982 5.26705 2.30011 5.20009Z"
                                  fill="#8D8D8D"
                                />
                              </svg>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="drop-down-content">
                        <div className="search-bar">
                          <div className="search-input-field">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.1325 11.1096C9.10886 11.8857 7.82871 12.2443 6.55083 12.1128C5.27295 11.9813 4.09262 11.3696 3.24842 10.4013C2.40421 9.43303 1.95907 8.18036 2.00296 6.89648C2.04686 5.6126 2.57651 4.39325 3.48488 3.48488C4.39325 2.57651 5.6126 2.04686 6.89648 2.00296C8.18036 1.95907 9.43303 2.40421 10.4013 3.24842C11.3696 4.09262 11.9813 5.27295 12.1128 6.55083C12.2443 7.82871 11.8857 9.10886 11.1096 10.1325L13.78 12.8029C13.8479 12.8662 13.9024 12.9425 13.9402 13.0273C13.9779 13.1121 13.9983 13.2037 13.9999 13.2965C14.0015 13.3893 13.9845 13.4815 13.9497 13.5676C13.9149 13.6537 13.8632 13.7319 13.7975 13.7975C13.7319 13.8632 13.6537 13.9149 13.5676 13.9497C13.4815 13.9845 13.3893 14.0015 13.2965 13.9999C13.2037 13.9983 13.1121 13.9779 13.0273 13.9402C12.9425 13.9024 12.8662 13.8479 12.8029 13.78L10.1325 11.1096ZM10.7566 7.06953C10.7566 8.04739 10.3681 8.98521 9.67667 9.67667C8.98521 10.3681 8.04739 10.7566 7.06953 10.7566C6.09166 10.7566 5.15384 10.3681 4.46238 9.67667C3.77092 8.98521 3.38247 8.04739 3.38247 7.06953C3.38247 6.09166 3.77092 5.15384 4.46238 4.46238C5.15384 3.77092 6.09166 3.38247 7.06953 3.38247C8.04739 3.38247 8.98521 3.77092 9.67667 4.46238C10.3681 5.15384 10.7566 6.09166 10.7566 7.06953Z"
                                fill="#8A8A8A"
                              />
                            </svg>
                            <input
                              type="text"
                              placeholder="Search online store"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="drop-down-page">
                          <p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.79991 3.30011C9.86689 3.39039 9.91899 3.49627 9.95323 3.61172C9.98747 3.72717 10.0032 3.84992 9.99947 3.97296C9.99575 4.09599 9.97269 4.21691 9.93158 4.3288C9.89048 4.4407 9.83215 4.54138 9.75992 4.62509L6.85203 8.00002L9.75992 11.3749C9.90578 11.544 9.99194 11.7786 9.99944 12.0271C10.0069 12.2756 9.93517 12.5176 9.79991 12.6999C9.66466 12.8823 9.477 12.99 9.27822 12.9993C9.07944 13.0087 8.88582 12.919 8.73995 12.7499L5.24009 8.6875C5.16436 8.59975 5.10395 8.49339 5.06264 8.37509C5.02132 8.25679 5 8.1291 5 8.00002C5 7.87094 5.02132 7.74325 5.06264 7.62495C5.10395 7.50665 5.16436 7.40029 5.24009 7.31253L8.73995 3.25011C8.81217 3.16639 8.89688 3.10126 8.98924 3.05846C9.08159 3.01566 9.17979 2.99602 9.27822 3.00067C9.37665 3.00531 9.47338 3.03414 9.56289 3.08552C9.65241 3.1369 9.73295 3.20982 9.79991 3.30011Z"
                                fill="#202020"
                              />
                            </svg>
                            Pages
                          </p>
                        </div>
                        <div className="drop-down-store">
                          <div className="store-name">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M7.00521 2.65434C7.40464 1.78189 8.59497 1.78189 8.9944 2.65434L10.22 5.32864L13.0407 5.71528C13.9594 5.84202 14.328 7.02121 13.6552 7.68611L11.592 9.72673L12.1095 12.6398C12.2788 13.5894 11.3151 14.3186 10.5004 13.8585L7.9998 12.4442L5.49922 13.8585C4.6845 14.3186 3.72077 13.5894 3.89006 12.6398L4.40764 9.72673L2.34439 7.68611C1.67251 7.02121 2.04019 5.84202 2.95896 5.71528L5.78049 5.32864L7.00521 2.65434ZM7.9998 3.682L6.92233 6.03396C6.84324 6.20661 6.72397 6.35593 6.57537 6.46837C6.42678 6.5808 6.25356 6.65277 6.07146 6.67773L3.59028 7.01845L5.40487 8.81295C5.67557 9.08112 5.79813 9.47234 5.73023 9.85439L5.27438 12.4176L7.47429 11.1741C7.63563 11.0829 7.81626 11.0352 7.9998 11.0352C8.18335 11.0352 8.36398 11.0829 8.52532 11.1741L10.7252 12.4176L10.2694 9.85531C10.2359 9.66709 10.2481 9.47312 10.3049 9.29107C10.3617 9.10902 10.4614 8.94466 10.5947 8.81295L12.4093 7.01845L9.92815 6.67865C9.74596 6.65359 9.57269 6.58148 9.42408 6.46889C9.27548 6.35629 9.15626 6.20678 9.07728 6.03396L7.9998 3.682Z"
                                fill="#303030"
                              />
                            </svg>
                            <div>
                              <p>Default page</p>
                              <span>Assigned to 23 pages</span>
                            </div>
                          </div>
                          <div className="store-name">
                            <svg
                              viewBox="0 0 20 20"
                              height="16"
                              width="16"
                              focusable="false"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3.5 7.25a3.75 3.75 0 0 1 3.75-3.75h5.5a3.75 3.75 0 0 1 3.75 3.75v5.5a3.75 3.75 0 0 1-3.75 3.75h-5.5a3.75 3.75 0 0 1-3.75-3.75v-5.5Zm3.75-2.25a2.25 2.25 0 0 0-2.25 2.25v.5h10v-.5a2.25 2.25 0 0 0-2.25-2.25h-5.5Zm3.75 4.25h-6v3.5a2.25 2.25 0 0 0 2.25 2.25h3.75v-5.75Zm1.5 5.75v-5.75h2.5v3.5a2.25 2.25 0 0 1-2.25 2.25h-.25Z"
                              ></path>
                            </svg>
                            <div>
                              <p style={{ fontWeight: "bold" }}>
                                {title?.toLowerCase()?.replace(/ /g, "-")}
                              </p>
                              <span>Assigned to 0 pages</span>
                            </div>
                          </div>
                          <div className="store-name add-template">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <g clipPath="url(#clip0_2_13)">
                                <path
                                  d="M3.5 7C3.5 6.81435 3.57375 6.6363 3.70503 6.50503C3.8363 6.37375 4.01435 6.3 4.2 6.3H6.3V4.2C6.3 4.01435 6.37375 3.8363 6.50503 3.70503C6.6363 3.57375 6.81435 3.5 7 3.5C7.18565 3.5 7.3637 3.57375 7.49497 3.70503C7.62625 3.8363 7.7 4.01435 7.7 4.2V6.3H9.8C9.98565 6.3 10.1637 6.37375 10.295 6.50503C10.4262 6.6363 10.5 6.81435 10.5 7C10.5 7.18565 10.4262 7.3637 10.295 7.49497C10.1637 7.62625 9.98565 7.7 9.8 7.7H7.7V9.8C7.7 9.98565 7.62625 10.1637 7.49497 10.295C7.3637 10.4262 7.18565 10.5 7 10.5C6.81435 10.5 6.6363 10.4262 6.50503 10.295C6.37375 10.1637 6.3 9.98565 6.3 9.8V7.7H4.2C4.01435 7.7 3.8363 7.62625 3.70503 7.49497C3.57375 7.3637 3.5 7.18565 3.5 7Z"
                                  fill="#2372D9"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M7 13.125C7.80435 13.125 8.60082 12.9666 9.34394 12.6588C10.0871 12.351 10.7623 11.8998 11.331 11.331C11.8998 10.7623 12.351 10.0871 12.6588 9.34394C12.9666 8.60082 13.125 7.80435 13.125 7C13.125 6.19565 12.9666 5.39918 12.6588 4.65606C12.351 3.91294 11.8998 3.23773 11.331 2.66897C10.7623 2.10021 10.0871 1.64905 9.34394 1.34124C8.60082 1.03343 7.80435 0.875 7 0.875C5.37555 0.875 3.81763 1.52031 2.66897 2.66897C1.52031 3.81763 0.875 5.37555 0.875 7C0.875 8.62445 1.52031 10.1824 2.66897 11.331C3.81763 12.4797 5.37555 13.125 7 13.125ZM7 11.8125C8.27635 11.8125 9.50043 11.3055 10.403 10.403C11.3055 9.50043 11.8125 8.27635 11.8125 7C11.8125 5.72365 11.3055 4.49957 10.403 3.59705C9.50043 2.69453 8.27635 2.1875 7 2.1875C5.72365 2.1875 4.49957 2.69453 3.59705 3.59705C2.69453 4.49957 2.1875 5.72365 2.1875 7C2.1875 8.27635 2.69453 9.50043 3.59705 10.403C4.49957 11.3055 5.72365 11.8125 7 11.8125Z"
                                  fill="#2372D9"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_2_13">
                                  <rect width="14" height="14" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                            <div>
                              <p>Create template</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </InlineStack>
              </InlineGrid>
            </BlockStack>
          ) : (
            // <Text>
            //   Your page has been successfully added and is now ready for
            //   customization in your store!
            // </Text>
            <BlockStack>
              {themeList.map((theme) => (
                <Box>
                  <RadioButton
                    key={theme.id}
                    label={
                      <span
                        className="Polaris-Text--root Polaris-Text--bodyMd"
                        style={{
                          display: "inline-block",
                          paddingTop: "0.3rem",
                          maxWidth: "200px",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {theme.name}{" "}
                        {theme.role === "main" && (
                          <Badge variant="headingSm" tone="success">
                            Live
                          </Badge>
                        )}
                      </span>
                    }
                    checked={selectedTheme.id === theme.id}
                    onChange={() => handleThemeSelect(theme)}
                  />
                </Box>
              ))}
            </BlockStack>
          )}
        </Modal.Section>
      </Modal>
      <Modal
        open={active}
        onClose={() => setActive(!active)}
        title="Delete Section"
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {
              setActive(false);
            },
          },
        ]}
        primaryAction={{
          content: "Delete",
          destructive: true,
          onAction: handleConfirmDelete,
        }}
        size="small"
      >
        <Modal.Section>
          <TextContainer>
            <p>Are you sure you want to delete this section ?</p>
          </TextContainer>
        </Modal.Section>
      </Modal>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPageNameError(false);
          setTitleError(false);
          setInternalName(selectedPageData?.internal_title || "");
          setTitle(selectedPageData?.title || "");
        }}
        title="Page Information"
        primaryAction={{
          content: "Save",
          onAction: () => handleCreatePage(),
          loading: saveLoader,
        }}
        size="small"
      >
        <Modal.Section>
          <InlineGrid gap={300}>
            <TextField
              label="Page Internal Name:"
              value={internalName}
              error={internalName == undefined ? false : pageNameError}
              onChange={(value) => {
                setInternalName(value);
                if (value) setPageNameError(false);
              }}
              maxLength={70}
              showCharacterCount={true}
              requiredIndicator={true}
            />
            <TextField
              label="Page Title:"
              value={title}
              error={title == undefined ? false : titleError}
              onChange={(value) => {
                setTitle(value);
                if (value) setTitleError(false);
              }}
              maxLength={70}
              showCharacterCount={true}
              requiredIndicator={true}
            />
          </InlineGrid>
        </Modal.Section>
      </Modal>
      <Modal
        open={validateModal}
        onClose={() => setValidateModal(false)}
        title="Page Creation Incomplete"
        primaryAction={{
          content: "Add Sections",
          onAction: () => {
            setValidateModal(false);
            handleAddSectionModal();
          },
        }}
        secondaryActions={[
          {
            content: "Close",
            onAction: () => setValidateModal(false),
          },
        ]}
        size="small"
      >
        <Modal.Section>
          <Banner tone="warning">
            <Text>
              It looks like you forgot to add any Section to your page. Please
              add at least one Section to continue creating your page.
            </Text>
          </Banner>
        </Modal.Section>
      </Modal>
      <ConfirmationModal
        isOpen={discardModal}
        setIsOpen={setIsDiscardModal}
        title={"Discard all unsaved changes?"}
        text={
          "If you discard changes, you'll delete any edits you made since you last saved."
        }
        buttonText={"Discard changes"}
        buttonAction={() => handleDiscardChanges()}
        destructive={true}
      />
    </Page>
  );
}

export default Create;
