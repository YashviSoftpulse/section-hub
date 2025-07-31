import {
  Badge,
  BlockStack,
  Button,
  Card,
  Grid,
  InlineStack,
  Layout,
  LegacyStack,
  Modal,
  Pagination,
  RadioButton,
  Text,
  TextField,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import Skeleton_Page from "../Skeleton/SkeletonPage";
import { SearchIcon, ViewIcon } from "@shopify/polaris-icons";
import { fetchData, getApiURL } from "../../action";

function Sections() {
  const [sections, setSections] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState("all");
  const [categories, SetCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [themeList, setThemeList] = useState([]);
  const [themeListModal, setThemeListModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [modalSectionId, setModalSectionId] = useState(null);

  const getListingData = async (currentPage) => {
    setIsLoading(true);

    const formdata = new FormData();
    formdata.append("filter", selected);
    if (searchValue) {
      formdata.append("search", searchValue);
    }
    formdata.append("page", currentPage);

    const response = await fetchData(getApiURL("/listing"), formdata);
    if (response && response.status) {
      setIsLoading(false);
      setSections(response);
      setTotalPages(response.page?.total);
    }
  };

  const countListing = async () => {
    const response = await fetchData(getApiURL("/counts"));
    if (response && response.status) {
      SetCategories(response.total_counts);
    }
  };

  const publishSection = async (id) => {
    const formdata = new FormData();
    formdata.append("asset", modalSectionId);
    formdata.append("theme_id", selectedTheme);
    const publish = await fetchData(getApiURL("/updateShopifyTheme"), formdata);
    if (publish.status === true) {
      setThemeListModal(!themeListModal);
      shopify.toast.show(publish?.message, { duration: 3000 });
    }
    shopify.toast.show(publish?.message, { duration: 3000 , isError:true });
  };

  const ThemeListing = async () => {
    const response = await fetchData(getApiURL("/theme_list"));
    if (response.status) {
      setThemeList(response.themes_list);
      const defaultTheme = response.themes_list.find(
        (theme) => theme.role === "main"
      );
      if (defaultTheme) {
        setSelectedTheme(defaultTheme.id);
      }
    }
  };

  useEffect(() => {
    getListingData(currentPage);
    countListing();
    ThemeListing();
  }, [currentPage, selected]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue !== "") {
        getListingData(currentPage);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const handleCategoryClick = (categoryKey) => {
    setActiveCategory(categoryKey);
    setSelected(categoryKey);
    getListingData(currentPage);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleSearchSubmit = () => {
    getListingData(currentPage);
  };

  const handleViewIconClick = (section) => {
    setSelectedSection(section);
    setIsModalOpen(true);
  };

  const handlePublishClick = (sectionId, sectionName) => {
    setModalSectionId(sectionId);
    setSelectedSection({ name: sectionName });
    setThemeListModal(true);
  };

  const handleSelectChange = (value) => {
    setSelectedTheme(value);
  };

  return isLoading ? (
    <Skeleton_Page />
  ) : (
    <Layout>
      <Layout.Section>
        <Grid columns={{ sm: 3 }}>
          <div className="Polaris-Grid-Cell Polaris-Grid-Cell--cell_6ColumnXs Polaris-Grid-Cell--cell_4ColumnSm Polaris-Grid-Cell--cell_1ColumnMd Polaris-Grid-Cell--cell_3ColumnLg Polaris-Grid-Cell--cell_3ColumnXl layoutSticky">
            <Card>
              <BlockStack gap={300}>
                <TextField
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="Search for a section ..."
                  suffix={<SearchIcon />}
                  onBlur={handleSearchSubmit}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleSearchSubmit();
                    }
                  }}
                />
                <Text variant="headingXs" as="h6">
                  Sections
                </Text>
                <div className="vertical-stack">
                  <LegacyStack vertical>
                    <InlineStack align="space-between">
                      <RadioButton
                        label="All"
                        checked={selected === "all"}
                        id="All"
                        name="category"
                        onChange={() => handleCategoryClick("all")}
                      />
                      <Badge>{categories.sections?.folders}</Badge>
                    </InlineStack>
                    {Object.keys(categories.sections?.sub_details || {})?.map(
                      (key, id) => {
                        const detail = categories.sections?.sub_details[key];
                        return (
                          <InlineStack align="space-between" key={id}>
                            <RadioButton
                              label={`${key}`}
                              checked={activeCategory === key}
                              id={key}
                              name="category"
                              onChange={() => handleCategoryClick(key)}
                            />
                            <Badge>{detail.files}</Badge>
                          </InlineStack>
                        );
                      }
                    )}
                  </LegacyStack>
                </div>
              </BlockStack>
            </Card>
          </div>
          <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 2, lg: 9, xl: 9 }}>
            <Grid
              columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {sections.data
                ?.filter((section) => section.parent_category === "sections")
                .map((section) => {
                  return (
                    <Card key={section.id}>
                      <BlockStack gap={300}>
                        <InlineStack align="space-between">
                          <Text>{section.name}</Text>
                          <Badge tone="success" size="small">
                            {section.type}
                          </Badge>
                        </InlineStack>

                        <img
                          alt=""
                          width="100%"
                          height="100%"
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                            borderRadius: "0.75rem",
                            border: "1px solid #d3d3d3",
                          }}
                          src={section.featured_img}
                        />
                        <div
                          className="Polaris-InlineStack"
                          style={{
                            "--pc-inline-stack-align": "space-between",
                            "--pc-inline-stack-gap-xs": "var(--p-space-100)",
                            "--pc-inline-stack-flex-direction-xs": "row",
                          }}
                        >
                          <Button
                            size="medium"
                            fullWidth
                            onClick={() =>
                              handlePublishClick(section.id, section.name)
                            }
                          >
                            Add Section
                          </Button>

                          <Button
                            size="medium"
                            icon={ViewIcon}
                            onClick={() => handleViewIconClick(section)}
                          ></Button>
                        </div>
                      </BlockStack>
                    </Card>
                  );
                })}
              <Modal
                size="small"
                open={themeListModal}
                onClose={() => setThemeListModal(false)}
                title="Select Theme to Publish"
                primaryAction={{
                  content: "Publish",
                  onAction: () => publishSection(),
                }}
              >
                <Modal.Section>
                  <BlockStack gap={400}>
                    <Text variant="bodyMd" as="p">
                      This will help you identify it easily within the Shopify
                      Theme customizer.
                    </Text>
                    <TextField
                      label={
                        <Text variant="headingSm" as="h6">
                          Name :
                        </Text>
                      }
                      value={selectedSection?.name || ""}
                      readOnly
                    />
                    <BlockStack gap={200}>
                      <Text variant="headingSm" as="h6">
                        Theme 🎨
                      </Text>
                      {themeList.map((theme) => (
                        <RadioButton
                          key={theme.id}
                          label={`${theme.name} (${theme.role})`}
                          checked={selectedTheme === theme.id}
                          id={theme.id}
                          name="theme"
                          onChange={() => handleSelectChange(theme.id)}
                        />
                      ))}
                    </BlockStack>
                  </BlockStack>
                </Modal.Section>
              </Modal>
              <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedSection?.name || "Section Details"}
                fullWidth
              >
                <Modal.Section>
                  {selectedSection && (
                    <div>
                      <img
                        src={selectedSection.preview_img}
                        alt={selectedSection.name}
                        style={{ width: "100%", height: "100%" }}
                      />
                      <p>{selectedSection.description}</p>
                    </div>
                  )}
                </Modal.Section>
              </Modal>
            </Grid>
          </Grid.Cell>
        </Grid>
      </Layout.Section>
      <Layout.Section>
        <InlineStack gap={200} align="center">
          <Pagination
            hasPrevious={sections.page?.previous}
            onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            hasNext={sections.page?.next}
            onNext={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          />
        </InlineStack>
      </Layout.Section>

      <Layout.Section></Layout.Section>
    </Layout>
  );
}

export default Sections;
