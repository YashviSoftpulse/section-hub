import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BlockStack,
  Icon,
  Layout,
  Modal,
  Page,
  RadioButton,
  Select,
  Text,
  TextField,
  Pagination,
  Spinner,
  Banner,
  List,
  Button,
  InlineGrid,
  InlineStack,
  Badge,
  Box,
  Card,
  Divider,
  Checkbox,
} from "@shopify/polaris";
import { SectionCard, Skeleton_Page } from "../components";
import { fetchData, getApiURL, MyEncryption } from "../action";
import { DesktopIcon, MobileIcon, XIcon } from "@shopify/polaris-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Nodata from "/assets/nodata.svg";
// import { setSections } from "../redux/action";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [themeList, setThemeList] = useState([]);
  const [themeListModal, setThemeListModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [modalSectionId, setModalSectionId] = useState(null);
  const [sort, setSort] = useState("newArrival");
  const [IsMobileView, setIsMobileView] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [appStatus, setAppStatus] = useState();
  const [preview, setPreview] = useState(null);
  const [trackTabChange, setTrackTabChange] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  const encryptor = new MyEncryption();
  const SHOP = urlParams.get("shop");
  const nodomainShop = SHOP?.replace(".myshopify.com", "");
  const [filterCounts, setFilterCounts] = useState({});
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [sectionsData, setSectionsData] = useState([]);
  const iframeRef = useRef(null);

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
    "Back to top",
    "Compare",
  ];

  const { data: listingApiData, isLoading: isListingApiCall } = useQuery({
    queryKey: ["listing", sort],
    queryFn: async () => {
      const formdata = new FormData();
      formdata.append("filter", "all");
      formdata.append("sort", sort);
      formdata.append("type", "sections");
      const response = await fetchData(getApiURL("/listing"), formdata);
      return response;
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  const handleBannerButtonClick = () => {
    setAppStatus((prev) => ({
      ...prev,
      extension_banner: { ...prev.extension_banner, status: true },
    }));
    setTrackTabChange(true);
  };

  useEffect(() => {
    if (trackTabChange) {
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          GetAnalytics();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      off;
      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [trackTabChange]);

  useEffect(() => {
    if (!lazyContentRefs.current?.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("loaded");
          observer.unobserve(entry.target);
        }
      });
    });

    lazyContentRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [appStatus, filteredSections, preview]);

  const lazyContentRefs = useRef([]);
  const addToRefs = (el) => {
    if (el && !lazyContentRefs.current.includes(el)) {
      lazyContentRefs.current.push(el);
    }
  };

  const options = [
    { label: "Old to New", value: "bestSeller" },
    { label: "New to Old", value: "newArrival" },
  ];

  useEffect(() => {
    if (listingApiData) {
      setSectionsData(listingApiData?.data || []);
    }
  }, [listingApiData]);

  const { data: appStatusData, isPending: isApicall } = useQuery({
    queryKey: ["app_status"],
    queryFn: async () => {
      const response = await fetchData(getApiURL("/app_status"));
      return response;
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (appStatusData) {
      setAppStatus(appStatusData);
    }
  }, [appStatusData]);

  const { data: themeListData, isPending: isThemeListApiCall } = useQuery({
    queryKey: ["theme_list"],
    queryFn: async () => {
      const response = await fetchData(getApiURL("/theme_list"));
      return response;
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (themeListData) {
      setThemeList(themeListData.themes_list);
      const defaultTheme = themeListData.themes_list?.find(
        (theme) => theme.role === "main"
      );
      if (defaultTheme) {
        setSelectedTheme(defaultTheme.id);
      }
    }
  }, [themeListData]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    );
  };

  useEffect(() => {
    let filtered = [...sectionsData];

    if (searchTerm) {
      filtered = filtered.filter((section) =>
        section?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilters.length > 0) {
      filtered = filtered.filter((section) =>
        selectedFilters.some((filter) => {
          const name = section?.name?.toLowerCase();
          switch (filter) {
            case "Collection":
              return name.includes("collection") || name.includes("category");
            case "Image":
              return name.includes("image") || name.includes("brand");
            case "Tabs":
              return name.includes("tabs") || name.includes("tab");
            case "Newsletter":
              return name.includes("newsletter") || name.includes("welcome");
            default:
              return name.includes(filter.toLowerCase());
          }
        })
      );
    }

    setFilteredSections(filtered);

    const counts = Filter.reduce((acc, filter) => {
      acc[filter] = sectionsData?.filter((section) => {
        const name = section?.name?.toLowerCase();
        switch (filter) {
          case "Collection":
            return name.includes("collection") || name.includes("category");
          case "Image":
            return name.includes("image") || name.includes("brand");
          case "Tabs":
            return name.includes("tabs") || name.includes("tab");
          case "Newsletter":
            return name.includes("newsletter") || name.includes("welcome");
          default:
            return name.includes(filter.toLowerCase());
        }
      }).length;
      return acc;
    }, {});
    setFilterCounts(counts);

    const hasMatches = selectedFilters.some((filter) => counts[filter] > 0);

    if (searchTerm && filtered.length === 0) {
      setNoResultsFound(true);
    } else if (!hasMatches && filtered.length === 0) {
      setNoResultsFound(true);
    } else {
      setNoResultsFound(false);
    }
  }, [sectionsData, searchTerm, selectedFilters]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const publishSection = async () => {
    setIsPublishing(true);
    setPublishSuccess(null);
    const formdata = new FormData();
    formdata.append("asset", encryptor.encode(modalSectionId, 42));
    formdata.append("theme_id", encryptor.encode(selectedTheme, 42));
    const publish = await fetchData(getApiURL("/updateShopifyTheme"), formdata);

    if (publish.status === true) {
      setPublishSuccess(publish.status);
      setIsPublishing(false);
      setSelectedFilters([]);
      shopify.toast.show("Section Added Successfully.", { duration: 2000 });
    } else {
      setIsPublishing(false);
      shopify.toast.show("Sorry! Process Failed. Please try again later.", {
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    const modalElement = document.querySelector(".Polaris-Modal-Dialog__Modal");

    if (isModalOpen) {
      modalElement.classList.add("section-img-modal");
    }
  }, [isModalOpen, preview]);

  const handleViewIconClick = async (section) => {
    setIsModalOpen(true);
    setPreview(null);
    setIsImageLoading(true);
    setSelectedSection(section);
    const formdatas = new FormData();
    formdatas.append(
      "name",
      encryptor.encode(section?.file_name?.replace(/\.liquid$/, ""), 42)
    );
    const preview = await fetchData(getApiURL(`/section-preview`), formdatas);
    setIsImageLoading(false);
    if (preview.status === true) {
      setPreview(preview);
    }
  };

  const handlePublishClick = (section) => {
    setPublishSuccess(null);
    setModalSectionId(section.id);
    setSelectedSection(section.name);
    setThemeListModal(true);
  };

  const handleSelectChange = (value) => {
    setSelectedTheme(value);
  };

  return (
    <div className="main-page">
      <Page
        title="Sections Library"
        subtitle="
          Build faster, sell smarter — unlock beautiful sections, craft standout
          pages, and elevate your brand."
        primaryAction={
          <Select
            label="Sort by :"
            labelInline
            options={options}
            onChange={(value) => setSort(value)}
            value={sort}
          />
        }
      >
        <Layout>
          {isApicall ? (
            <>
              <InlineStack align="center" blockAlign="center">
                <Spinner size="small" />
              </InlineStack>
            </>
          ) : (
            <>
              {appStatus?.extension_banner?.status === false && (
                <Layout.Section>
                  <div className="lazyContent" ref={addToRefs}>
                    <Banner
                      title={appStatus?.extension_banner?.title}
                      tone="warning"
                      action={{
                        content: appStatus?.extension_banner?.button?.label,
                        url: appStatus?.extension_banner?.button?.link,
                        onAction: handleBannerButtonClick,
                        target: "_blank",
                      }}
                    >
                      <p>{appStatus?.extension_banner?.desc}</p>
                    </Banner>
                  </div>
                </Layout.Section>
              )}
              <Layout.Section>
                <div className="close-btn">
                  <TextField
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search for a section ..."
                    suffix={
                      searchTerm && (
                        <Button
                          variant="plain"
                          onClick={clearSearch}
                          icon={XIcon}
                          marginTop={10}
                        />
                      )
                    }
                  />
                </div>
              </Layout.Section>
              <Layout.Section>
                <div
                  className="Polaris-Grid"
                  style={{
                    "--pc-grid-columns-sm": 3,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    className="Polaris-Grid-Cell Polaris-Grid-Cell--cell_2ColumnXs Polaris-Grid-Cell--cell_1ColumnSm Polaris-Grid-Cell--cell12ColumnMd Polaris-Grid-Cell--cell_3ColumnLg Polaris-Grid-Cell--cell_3ColumnXl"
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
                        <div className=" filter-options">
                          <div
                            className="Polaris-BlockStack"
                            style={{
                              "--pc-block-stack-order": "column",
                              "--pc-block-stack-gap-xs": "var(--p-space-100)",
                              maxHeight: " calc(100vh - 50px)",
                            }}
                          >
                            {Filter.map((filter) => (
                              <Checkbox
                                key={filter}
                                label={`${filter} (${
                                  filterCounts[filter] || 0
                                })`}
                                checked={selectedFilters.includes(filter)}
                                onChange={() => handleFilterChange(filter)}
                              />
                            ))}
                          </div>
                        </div>
                      </BlockStack>
                    </Card>
                  </div>
                  <div
                    className="Polaris-Grid-Cell Polaris-Grid-Cell--cell_4ColumnXs Polaris-Grid-Cell--cell_2ColumnSm Polaris-Grid-Cell--cell_2ColumnMd Polaris-Grid-Cell--cell_9ColumnLg Polaris-Grid-Cell--cell_9ColumnXl"
                    style={
                      isListingApiCall !== false
                        ? { height: "100%" }
                        : {
                            height: "100%",
                            display: "flex",
                          }
                    }
                  >
                    {isListingApiCall ? (
                      <Skeleton_Page />
                    ) : (
                      <>
                        {searchTerm && noResultsFound ? (
                          <div className="notfound">
                            <img src={Nodata} />
                            <Text variant="bodySm">
                              No sections found matching your criteria. Please
                              try a different search term.
                            </Text>
                          </div>
                        ) : (
                          <div
                            className="Polaris-Grid"
                            style={{
                              height: "fit-content",
                              "--pc-grid-columns-xs": 1,
                              "--pc-grid-columns-sm": 2,
                              "--pc-grid-columns-md": 2,
                              "--pc-grid-columns-lg": 2,
                              "--pc-grid-columns-xl": 2,
                            }}
                          >
                            {filteredSections?.map((section, index) => {
                              return (
                                <div
                                  key={index}
                                  className=" section-card lazyContent"
                                  ref={addToRefs}
                                >
                                  <SectionCard
                                    section={section}
                                    handleViewIconClick={handleViewIconClick}
                                    handlePublishClick={handlePublishClick}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Layout.Section>
              <Modal
                size={publishSuccess === true ? "large" : "small"}
                open={themeListModal}
                onClose={() => {
                  if (publishSuccess === true) {
                    setSelectedFilters([]);
                    setThemeListModal(false);
                    setPublishSuccess(null);
                    setIsPublishing(false);
                  }
                  setThemeListModal(false);
                  setIsPublishing(false);
                }}
                title={
                  <Text as="h2" variant="headingMd">
                    {publishSuccess === true
                      ? `${selectedSection} Section`
                      : "Select Shopify Theme to Publish"}
                  </Text>
                }
                primaryAction={
                  publishSuccess === true
                    ? {
                        content: "Customize Section",
                        onAction: () => {
                          window.open(
                            `https://admin.shopify.com/store/${nodomainShop}/themes/${selectedTheme}/editor`,
                            "_blank"
                          );
                        },
                      }
                    : ""
                }
                secondaryActions={{
                  content: publishSuccess === true ? "Close" : "Add to theme",
                  onAction:
                    publishSuccess === true
                      ? () => {
                          setThemeListModal(false),
                            setPublishSuccess(null),
                            setSelectedFilters([]);
                        }
                      : publishSection,
                  loading: isPublishing,
                }}
              >
                <Modal.Section>
                  {publishSuccess === true ? (
                    <BlockStack gap={300}>
                      <InlineGrid gap={100} columns={2}>
                        <BlockStack gap={800}>
                          <BlockStack gap={500}>
                            <InlineStack gap={200}>
                              {/* <Icon source={CheckIcon}></Icon> */}
                              <Text variant="bodyLg" as="h2">
                                Your section has been successfully added and is
                                now ready for customization in your store!
                              </Text>
                            </InlineStack>

                            <List gap="loose" type="number">
                              <List.Item>
                                Go to{" "}
                                <Link
                                  to={`https://admin.shopify.com/store/${nodomainShop}/themes/${selectedTheme}/editor`}
                                  target="blank"
                                >
                                  Theme Customizer
                                </Link>{" "}
                                of Selected Theme
                              </List.Item>
                              <List.Item>
                                Click <b>Add Section</b> Option From Left
                                Sidebar{" "}
                              </List.Item>
                              <List.Item>
                                Choose <b>{selectedSection}</b> Section from
                                Opened List
                              </List.Item>
                            </List>
                            <div>
                              <Button
                                onClick={() => {
                                  setThemeListModal(false);
                                  setPublishSuccess(null);
                                }}
                              >
                                Add More Section
                              </Button>
                            </div>
                          </BlockStack>
                          <BlockStack gap={100}>
                            <Text variant="bodyLg" as="h2">
                              💡 Need Help Customizing Your Theme?
                            </Text>
                            <Text variant="bodyLg" as="h2">
                              👉 We offer expert help beyond ready-made
                              sections.{" "}
                              <Link
                                target="_blank"
                                to="https://softpulseinfotech.com/shopify-theme-customization?utm_source=shopify_sectionhub_plugin&utm_medium=referral&utm_campaign=custom_work"
                                removeUnderline={true}
                              >
                                Get in Touch
                              </Link>
                            </Text>
                          </BlockStack>
                        </BlockStack>
                        <InlineStack gap={400}>
                          <div className="main-sidebar">
                            <div className="main-theme-section">
                              <div className="theme-sections">
                                <div className="section-title">
                                  <h2>
                                    <b>SH: {selectedSection}</b>
                                  </h2>
                                </div>
                                <div className="name-of-section">
                                  <div className="section-name">
                                    <p>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M3.5 6.25c0-1.519 1.231-2.75 2.75-2.75.414 0 .75.336.75.75s-.336.75-.75.75c-.69 0-1.25.56-1.25 1.25 0 .414-.336.75-.75.75s-.75-.336-.75-.75Z" />
                                        <path
                                          fillRule="evenodd"
                                          d="M3.5 9.25c0-.966.784-1.75 1.75-1.75h9.5c.966 0 1.75.784 1.75 1.75v1.5c0 .966-.784 1.75-1.75 1.75h-9.5c-.966 0-1.75-.784-1.75-1.75v-1.5Zm1.75-.25c-.138 0-.25.112-.25.25v1.5c0 .138.112.25.25.25h9.5c.138 0 .25-.112.25-.25v-1.5c0-.138-.112-.25-.25-.25h-9.5Z"
                                        />
                                        <path d="M3.5 13.75c0 1.519 1.231 2.75 2.75 2.75.414 0 .75-.336.75-.75s-.336-.75-.75-.75c-.69 0-1.25-.56-1.25-1.25 0-.414-.336-.75-.75-.75s-.75.336-.75.75Z" />
                                        <path d="M13.75 3.5c1.519 0 2.75 1.231 2.75 2.75 0 .414-.336.75-.75.75s-.75-.336-.75-.75c0-.69-.56-1.25-1.25-1.25-.414 0-.75-.336-.75-.75s.336-.75.75-.75Z" />
                                        <path d="M13.75 16.5c1.519 0 2.75-1.231 2.75-2.75 0-.414-.336-.75-.75-.75s-.75.336-.75.75c0 .69-.56 1.25-1.25 1.25-.414 0-.75.336-.75.75s.336.75.75.75Z" />
                                        <path d="M11.75 4.25c0 .414-.336.75-.75.75h-2c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h2c.414 0 .75.336.75.75Z" />
                                        <path d="M11 16.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-2c-.414 0-.75.336-.75.75s.336.75.75.75h2Z" />
                                      </svg>
                                      ...
                                    </p>
                                    <p>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M3.5 6.25c0-1.519 1.231-2.75 2.75-2.75.414 0 .75.336.75.75s-.336.75-.75.75c-.69 0-1.25.56-1.25 1.25 0 .414-.336.75-.75.75s-.75-.336-.75-.75Z" />
                                        <path
                                          fillRule="evenodd"
                                          d="M3.5 9.25c0-.966.784-1.75 1.75-1.75h9.5c.966 0 1.75.784 1.75 1.75v1.5c0 .966-.784 1.75-1.75 1.75h-9.5c-.966 0-1.75-.784-1.75-1.75v-1.5Zm1.75-.25c-.138 0-.25.112-.25.25v1.5c0 .138.112.25.25.25h9.5c.138 0 .25-.112.25-.25v-1.5c0-.138-.112-.25-.25-.25h-9.5Z"
                                        />
                                        <path d="M3.5 13.75c0 1.519 1.231 2.75 2.75 2.75.414 0 .75-.336.75-.75s-.336-.75-.75-.75c-.69 0-1.25-.56-1.25-1.25 0-.414-.336-.75-.75-.75s-.75.336-.75.75Z" />
                                        <path d="M13.75 3.5c1.519 0 2.75 1.231 2.75 2.75 0 .414-.336.75-.75.75s-.75-.336-.75-.75c0-.69-.56-1.25-1.25-1.25-.414 0-.75-.336-.75-.75s.336-.75.75-.75Z" />
                                        <path d="M13.75 16.5c1.519 0 2.75-1.231 2.75-2.75 0-.414-.336-.75-.75-.75s-.75.336-.75.75c0 .69-.56 1.25-1.25 1.25-.414 0-.75.336-.75.75s.336.75.75.75Z" />
                                        <path d="M11.75 4.25c0 .414-.336.75-.75.75h-2c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h2c.414 0 .75.336.75.75Z" />
                                        <path d="M11 16.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-2c-.414 0-.75.336-.75.75s.336.75.75.75h2Z" />
                                      </svg>
                                      ...
                                    </p>
                                  </div>
                                  <div className="add-section">
                                    <p>
                                      <a href="#">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M6.25 10a.75.75 0 0 1 .75-.75h2.25v-2.25a.75.75 0 0 1 1.5 0v2.25h2.25a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0v-2.25h-2.25a.75.75 0 0 1-.75-.75Z" />
                                          <path
                                            fillRule="evenodd"
                                            d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm0-1.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
                                          />
                                        </svg>
                                        Add Block
                                      </a>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="theme-sections">
                                <div className="section-title">
                                  <h2>Footer</h2>
                                </div>
                                <div className="name-of-section">
                                  <div className="section-name">
                                    <p>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M3.5 5.25c0-.966.784-1.75 1.75-1.75h.5a.75.75 0 0 1 0 1.5h-.5a.25.25 0 0 0-.25.25v.5a.75.75 0 0 1-1.5 0v-.5Z" />
                                        <path
                                          fillRule="evenodd"
                                          d="M3.5 13.25c0-.966.784-1.75 1.75-1.75h9.5c.966 0 1.75.784 1.75 1.75v1.5a1.75 1.75 0 0 1-1.75 1.75h-9.5a1.75 1.75 0 0 1-1.75-1.75v-1.5Zm1.75-.25a.25.25 0 0 0-.25.25v1.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25v-1.5a.25.25 0 0 0-.25-.25h-9.5Z"
                                        />
                                        <path d="M3.5 8.75c0 .966.784 1.75 1.75 1.75h.5a.75.75 0 0 0 0-1.5h-.5a.25.25 0 0 1-.25-.25v-.5a.75.75 0 0 0-1.5 0v.5Z" />
                                        <path d="M14.75 3.5c.966 0 1.75.784 1.75 1.75v.5a.75.75 0 0 1-1.5 0v-.5a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5Z" />
                                        <path d="M14.75 10.5a1.75 1.75 0 0 0 1.75-1.75v-.5a.75.75 0 0 0-1.5 0v.5a.25.25 0 0 1-.25.25h-.5a.75.75 0 0 0 0 1.5h.5Z" />
                                        <path d="M11.75 4.25a.75.75 0 0 1-.75.75h-2a.75.75 0 0 1 0-1.5h2a.75.75 0 0 1 .75.75Z" />
                                        <path d="M11 10.5a.75.75 0 0 0 0-1.5h-2a.75.75 0 0 0 0 1.5h2Z" />
                                      </svg>
                                      Footer
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="theme-setting">
                                <div className="section-title">
                                  <h2>Theme settings</h2>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <img
                              className="popover-image"
                              src="/assets/modalSkeleton.png"
                            />
                          </div>
                        </InlineStack>
                      </InlineGrid>
                    </BlockStack>
                  ) : (
                    <Box>
                      <Box paddingBlockEnd={200}>
                        <Text variant="bodyMd" as="p">
                          This will make it easier for you to identify within
                          the Shopify Theme customizer.
                        </Text>
                      </Box>
                      <Box padding={200}>
                        <TextField
                          label={
                            <Text variant="headingSm" as="h6">
                              Section Name:
                            </Text>
                          }
                          value={selectedSection}
                          readOnly
                        />
                      </Box>
                      <Box paddingBlockEnd={200}>
                        <Text variant="headingSm" as="h6">
                          Theme List
                        </Text>
                      </Box>
                      {themeList?.map((theme) => (
                        <Box key={theme.id}>
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
                            checked={selectedTheme === theme.id}
                            id={theme.id}
                            name="theme"
                            onChange={() => handleSelectChange(theme.id)}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Modal.Section>
              </Modal>

              <Modal
                open={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setIsMobileView(false);
                  setPreview(null);
                }}
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      minWidth: "33.25rem",
                    }}
                  >
                    <Text variant="headingLg" as="span">
                      {selectedSection?.name || "Section Details"}
                    </Text>
                    <div
                      class="Polaris-InlineStack"
                      style={{
                        "--pc-inline-stack-wrap": "wrap",
                        "--pc-inline-stack-gap-xs": "var(--p-space-200)",
                        "--pc-inline-stack-flex-direction-xs": "row",
                        gap: "5px",
                      }}
                    >
                      {/* <InlineStack
                      gap={200}
                      alignment="center"
                      style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        gap:'10px'
                      }}
                    > */}
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
                    </div>
                  </div>
                }
                secondaryActions={{
                  content: (
                    <BlockStack gap={200}>
                      <Text variant="headingSm" as="h6" alignment="center">
                        💡 Need Help Customizing Your Theme?
                      </Text>
                      <Text variant="headingSm" as="h6">
                        👉 We offer expert help beyond ready-made sections.{" "}
                        <Link
                          target="_blank"
                          to="https://softpulseinfotech.com/shopify-theme-customization?utm_source=shopify_sectionhub_plugin&utm_medium=referral&utm_campaign=custom_work"
                          removeUnderline={true}
                        >
                          Get in Touch
                        </Link>
                      </Text>
                    </BlockStack>
                  ),
                  variant: "tertiary",
                  alignment: "center",
                }}
                size="large"
              >
                <Modal.Section>
                  {isImageLoading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20%",
                      }}
                    >
                      <Spinner accessibilityLabel="Loading" size="large" />
                    </div>
                  ) : preview?.type === "html" ? (
                    <div style={{ display: "flex" }}>
                      <iframe
                        title="Section Preview"
                        ref={iframeRef}
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
                  ) : (
                    <BlockStack gap={400}>
                      {preview?.data?.length > 0 && (
                        <Swiper
                          navigation={true}
                          modules={[Navigation]}
                          onSlideChange={(swiper) =>
                            setCurrentSlide(swiper.activeIndex)
                          }
                          onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                          }}
                        >
                          {preview?.data?.map((img, index) => (
                            <SwiperSlide key={index}>
                              <div className="lazyContent" ref={addToRefs}>
                                <img
                                  src={img}
                                  alt={`Section Preview Image ${index + 1}`}
                                  onLoad={() => setIsImageLoading(false)}
                                  fetchPriority="high"
                                />
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      )}
                      {preview?.data?.length > 1 && (
                        <div
                          className="Polaris-InlineStack"
                          style={{
                            "--pc-inline-stack-align": "center",
                            "--pc-inline-stack-wrap": "wrap",
                            "--pc-inline-stack-flex-direction-xs": "row",
                          }}
                        >
                          <Pagination
                            hasPrevious={currentSlide > 0}
                            onPrevious={() => {
                              if (swiperRef.current) {
                                swiperRef.current.slidePrev();
                              }
                            }}
                            hasNext={currentSlide < preview?.data?.length - 1}
                            onNext={() => {
                              if (swiperRef.current) {
                                swiperRef.current.slideNext();
                              }
                            }}
                          />
                        </div>
                      )}
                    </BlockStack>
                  )}
                </Modal.Section>
              </Modal>

              <Layout.Section></Layout.Section>
              <Layout.Section></Layout.Section>
            </>
          )}
        </Layout>
      </Page>
    </div>
  );
}

export default Library;
