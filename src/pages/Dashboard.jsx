// import {
//   Page,
//   Layout,
//   Card,
//   DataTable,
//   Button,
//   InlineStack,
//   Text,
//   BlockStack,
//   InlineGrid,
//   MediaCard,
//   Icon,
//   Divider,
//   Pagination,
//   Banner,
//   Image,
//   Grid,
//   VideoThumbnail,
//   SkeletonTabs,
//   SkeletonBodyText,
//   IndexTable,
//   LegacyCard,
//   Tooltip,
//   Box,
//   Collapsible,
//   Bleed,
//   Spinner,
//   Thumbnail,
//   CalloutCard,
// } from "@shopify/polaris";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   capitalizeFirstLetter,
//   fetchData,
//   fetchJsonData,
//   getApiURL,
//   MyEncryption,
// } from "../action";
// import {
//   CaretDownIcon,
//   CaretUpIcon,
//   DeleteIcon,
//   EditIcon,
//   XIcon,
// } from "@shopify/polaris-icons";
// import moment from "moment";
// import { ConfirmationModal } from "../components";
// import { Link, useNavigate } from "@tanstack/react-router";
// import { useQuery } from "@tanstack/react-query";

// function MyLibrary() {
//   const [dashboardData, setDashboardData] = useState([]);
//   const [trackTabChange, setTrackTabChange] = useState(false);
//   const [openSteps, setOpenSteps] = useState(false);
//   const [deleteId, setDeleteId] = useState();
//   const [deleteTemplateModal, setDeleteTemplateModal] = useState(false);
//   const [templateDeleteLoader, setTemplateDeleteLoader] = useState(false);
//   const [selectedPage, setSelectedPage] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [currentTemplatePage, setCurrentTemplatePage] = useState(1);
//   const [appStatus, setAppStatus] = useState();
//   const [showBanner, setShowBanner] = useState(false);
//   const [showThemeBanner, setShowThemeBanner] = useState(true);
//   const lazyContentRefs = useRef([]);
//   const rowsPerPage = 10;
//   const encryptor = new MyEncryption();
//   const navigate = useNavigate();
//   const urlParams = new URLSearchParams(window.location.search);
//   const SHOP = urlParams.get("shop");
//   const params = {};

//   const { data: appStatusData, isPending: isLoading } = useQuery({
//     queryKey: ["app_status"],
//     queryFn: async () => {
//       const response = await fetchJsonData(getApiURL("/app_status"));
//       return response.json();
//     },
//     staleTime: 0,
//     refetchOnMount: true,
//   });

//   const { data: dahboardApiData, isPending: isDashboardApiCall } = useQuery({
//     queryKey: ["dashboard"],
//     queryFn: async () => {
//       const response = await fetchJsonData(getApiURL("/dashboard"));
//       return response.json();
//     },
//     staleTime: 0,
//     refetchOnMount: true,
//   });

//   for (const [key, value] of urlParams.entries()) {
//     params[key] = value;
//   }
//   const addToRefs = (el) => {
//     if (el && !lazyContentRefs.current.includes(el)) {
//       lazyContentRefs.current.push(el);
//     }
//   };

//   useEffect(() => {
//     if (!lazyContentRefs.current.length) return;
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add("loaded");
//           observer.unobserve(entry.target);
//         }
//       });
//     });
//     lazyContentRefs.current.forEach((ref) => {
//       if (ref) observer.observe(ref);
//     });
//     return () => {
//       observer.disconnect();
//     };
//   }, [appStatus, showBanner, dashboardData]);

//   useEffect(() => {
//     if (trackTabChange) {
//       const handleVisibilityChange = () => {
//         if (!document.hidden) {
//           GetAnalytics();
//         }
//       };
//       document.addEventListener("visibilitychange", handleVisibilityChange);
//       return () => {
//         document.removeEventListener(
//           "visibilitychange",
//           handleVisibilityChange
//         );
//       };
//     }
//   }, [trackTabChange]);

//   useEffect(() => {
//     const dismissedAt = localStorage.getItem("orderBannerDismissedAt");
//     if (
//       !dismissedAt ||
//       new Date() - new Date(dismissedAt) > 7 * 24 * 60 * 60 * 1000
//     ) {
//       setShowBanner(true);
//     }
//   }, []);

//   const handleBannerButtonClick = () => {
//     setAppStatus((prev) => ({
//       ...prev,
//       extension_banner: { ...prev.extension_banner, status: true },
//     }));
//     setTrackTabChange(true);
//   };

//   const handleDismiss = () => {
//     localStorage.setItem("orderBannerDismissedAt", new Date().toISOString());
//     setShowBanner(false);
//   };

//   useEffect(() => {
//     if (appStatusData) {
//       setAppStatus(appStatusData);
//     }
//   }, [appStatusData]);

//   useEffect(() => {
//     if (dahboardApiData) {
//       setDashboardData(dahboardApiData);
//     }
//   }, [dahboardApiData]);

//   const deleteTemplate = async () => {
//     setTemplateDeleteLoader(true);
//     const formdata = new FormData();
//     formdata.append("id", deleteId);
//     formdata.append("shop", SHOP);
//     formdata.append("theme", encryptor.encode(selectedPage?.theme_id, 42));
//     const response = await fetchData(getApiURL("/delete_template"), formdata);
//     setTemplateDeleteLoader(false);
//     if (response?.status === true) {
//       setDeleteTemplateModal(false);
//       setDashboardData((prev) => ({
//         ...prev,
//         templates: prev.templates.filter((obj) => obj.uid !== deleteId),
//       }));
//     }
//     shopify.toast.show(response?.message, { duration: 3000 });
//   };

//   const totalRows = dashboardData?.sections?.length;
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = Array.isArray(dashboardData?.sections)
//     ? dashboardData.sections.slice(indexOfFirstRow, indexOfLastRow)
//     : [];

//   const rows = currentRows.map((row, id) => (
//     <IndexTable.Row id={id} key={id}>
//       <IndexTable.Cell>
//         <div
//           style={{
//             maxWidth: "300px",
//             whiteSpace: "normal",
//             wordWrap: "break-word",
//           }}
//         >
//           {row?.name}
//         </div>
//       </IndexTable.Cell>
//       <IndexTable.Cell>
//         <div
//           style={{
//             maxWidth: "200px",
//             whiteSpace: "normal",
//             wordWrap: "break-word",
//           }}
//         >
//           {moment(row?.created_at, "YYYY-MM-DD").format("Do MMM, YYYY")}
//         </div>
//       </IndexTable.Cell>
//       <IndexTable.Cell>
//         <div
//           style={{
//             maxWidth: "300px",
//             whiteSpace: "normal",
//             wordWrap: "break-word",
//           }}
//         >
//           {row?.theme_name}
//         </div>
//       </IndexTable.Cell>
//       <IndexTable.Cell>
//         <InlineStack align="end">
//           <Tooltip content="Click to Edit" dismissOnMouseOut width="wide">
//             <Button onClick={() => window.open(row?.edit)} icon={EditIcon} />
//           </Tooltip>
//         </InlineStack>
//       </IndexTable.Cell>
//     </IndexTable.Row>
//   ));

//   const totalTemplateRows = dashboardData?.templates?.length;
//   const templateIndexOfLastRow = currentTemplatePage * rowsPerPage;
//   const templateIndexOfFirstRow = templateIndexOfLastRow - rowsPerPage;
//   const currentTemplateRows = Array.isArray(dashboardData?.templates)
//     ? dashboardData?.templates.slice(
//         templateIndexOfFirstRow,
//         templateIndexOfLastRow
//       )
//     : [];

//   const templateRows = currentTemplateRows?.map((row, id) => (
//     <IndexTable.Row id={id} key={id}>
//       <IndexTable.Cell>
//         <div
//           style={{
//             maxWidth: "280px",
//             whiteSpace: "normal",
//             wordWrap: "break-word",
//           }}
//         >
//           {capitalizeFirstLetter(row?.title)}
//         </div>
//       </IndexTable.Cell>
//       <IndexTable.Cell>
//         <div
//           style={{
//             maxWidth: "200px",
//             whiteSpace: "normal",
//             wordWrap: "break-word",
//           }}
//         >
//           {moment(row?.created_at, "YYYY-MM-DD").format("Do MMM, YYYY")}
//         </div>
//       </IndexTable.Cell>
//       <IndexTable.Cell>
//         <div
//           style={{
//             maxWidth: "300px",
//             whiteSpace: "normal",
//             wordWrap: "break-word",
//           }}
//         >
//           {row?.theme_name}
//         </div>
//       </IndexTable.Cell>
//       <IndexTable.Cell>
//         <div>
//           <InlineStack gap={200} align="end">
//             <Tooltip content="Click to Delete" dismissOnMouseOut width="wide">
//               <Button
//                 tone="critical"
//                 onClick={() => {
//                   setSelectedPage(row);
//                   setDeleteId(row?.uid);
//                   setDeleteTemplateModal(true);
//                 }}
//                 icon={DeleteIcon}
//               />
//             </Tooltip>
//             <Tooltip content="Click to Edit" dismissOnMouseOut width="wide">
//               <Button onClick={() => window.open(row?.edit)} icon={EditIcon} />
//             </Tooltip>
//           </InlineStack>
//         </div>
//       </IndexTable.Cell>
//     </IndexTable.Row>
//   ));

//   const handleNextPage = () => {
//     if (currentPage < Math.ceil(totalRows / rowsPerPage)) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const openChat = () => {
//     if (window.$crisp) {
//       window.$crisp.push(["do", "chat:open"]);
//     }
//   };

//   return (
//     <div className="main-page">
//       <Page
//         title="Dashboard"
//         subtitle="Build faster, sell smarter — unlock beautiful sections, craft standout
//           pages, and elevate your brand."
//       >
//         {isLoading ? (
//           <>
//             <InlineStack align="center" blockAlign="center">
//               <Spinner size="small" />
//             </InlineStack>
//           </>
//         ) : (
//           // <BlockStack gap={300}>
//           //   <Card>
//           //     <SkeletonBodyText />
//           //   </Card>
//           //   <MediaCard title={<SkeletonBodyText />}></MediaCard>
//           //   <DataTable
//           //     columnContentTypes={["text", "text", "text"]}
//           //     headings={[<SkeletonTabs />, <SkeletonTabs />, <SkeletonTabs />]}
//           //     rows={[
//           //       [<SkeletonTabs />, <SkeletonTabs />, <SkeletonTabs />],
//           //       [<SkeletonTabs />, <SkeletonTabs />, <SkeletonTabs />],
//           //       [<SkeletonTabs />, <SkeletonTabs />, <SkeletonTabs />],
//           //     ]}
//           //   />
//           //   <LegacyCard>
//           //     <SkeletonTabs fitted />
//           //   </LegacyCard>
//           //   <LegacyCard>
//           //     <SkeletonTabs fitted />
//           //   </LegacyCard>
//           // </BlockStack>
//           <Layout>
//             {appStatus?.extension_banner?.status === false && (
//               <Layout.Section>
//                 <div className="lazyContent" ref={addToRefs}>
//                   <Banner
//                     title={appStatus?.extension_banner?.title}
//                     tone="warning"
//                     action={{
//                       content: appStatus?.extension_banner?.button?.label,
//                       url: appStatus?.extension_banner?.button?.link,
//                       onAction: handleBannerButtonClick,
//                       target: "_blank",
//                     }}
//                   >
//                     <p>{appStatus?.extension_banner?.desc}</p>
//                   </Banner>
//                 </div>
//               </Layout.Section>
//             )}

//             {showBanner && (
//               <Layout.Section>
//                 <div className="lazyContent" ref={addToRefs}>
//                   <Card>
//                     <BlockStack gap={400}>
//                       <InlineStack align="space-between">
//                         <Text variant="headingMd" as="h6">
//                           Quick Guide
//                         </Text>
//                         <Button
//                           tone="critical"
//                           variant="monochromePlain"
//                           onClick={handleDismiss}
//                           icon={XIcon}
//                         ></Button>
//                       </InlineStack>
//                       <InlineGrid gap={400} columns={2}>
//                         <Card padding={0}>
//                           <BlockStack gap={400}>
//                             <div className="dashboard-video">
//                               <VideoThumbnail
//                                 videoLength={142}
//                                 thumbnailUrl={
//                                   "https://cdn.shopify.com/s/files/1/0896/6049/0015/files/Section_Banner.png?v=1751365256"
//                                 }
//                                 onClick={() =>
//                                   window.open("https://youtu.be/eJC9415VtC4")
//                                 }
//                                 loading={true}
//                               />
//                             </div>
//                             <InlineStack align="space-between">
//                               <Box paddingInline={400}>
//                                 <Text variant="headingMd" as="h6">
//                                   Steps: How to Add Sections
//                                 </Text>
//                               </Box>
//                               <Box paddingInline={400}>
//                                 <Button
//                                   variant="plain"
//                                   onClick={() => setOpenSteps((prev) => !prev)}
//                                   icon={openSteps ? CaretUpIcon : CaretDownIcon}
//                                 />
//                               </Box>
//                             </InlineStack>
//                           </BlockStack>
//                           <Collapsible
//                             open={openSteps}
//                             id="basic-collapsible"
//                             transition={{
//                               duration: "500ms",
//                               timingFunction: "ease-in-out",
//                             }}
//                             expandOnPrint
//                           >
//                             <Box paddingInline={400}>
//                               <ol>
//                                 <BlockStack gap={100}>
//                                   <li>
//                                     Browse our{" "}
//                                     <strong>"Section Library"</strong>
//                                   </li>
//                                   <li>
//                                     Find a suitable section and check its
//                                     preview.
//                                   </li>
//                                   <li>
//                                     Click <strong>"Add Section"</strong> and
//                                     select your theme.
//                                   </li>
//                                   <li>
//                                     Click <strong>"Add to Theme"</strong> to
//                                     complete the process.
//                                   </li>
//                                 </BlockStack>
//                               </ol>
//                             </Box>
//                             <Box padding={400}>
//                               <Button
//                                 variant="primary"
//                                 onClick={() =>
//                                   navigate({
//                                     to: `/sectionLibrary?${new URLSearchParams(
//                                       params
//                                     )}`,
//                                   })
//                                 }
//                               >
//                                 View Sections
//                               </Button>
//                             </Box>
//                           </Collapsible>
//                           {openSteps === false && <Box padding={200}></Box>}
//                         </Card>
//                         <Card padding={0}>
//                           <BlockStack gap={400}>
//                             <div className="dashboard-video">
//                               <VideoThumbnail
//                                 videoLength={100}
//                                 thumbnailUrl={
//                                   "https://cdn.shopify.com/s/files/1/0896/6049/0015/files/pages-banner.png?v=1751365344"
//                                 }
//                                 onClick={() =>
//                                   window.open("https://youtu.be/Dc6bdN4Mbpw")
//                                 }
//                               />
//                             </div>
//                             <InlineStack align="space-between">
//                               <Box paddingInline={400}>
//                                 <Text variant="headingMd" as="h6">
//                                   Steps: How to Create Pages
//                                 </Text>
//                               </Box>
//                               <Box paddingInline={400}>
//                                 <Button
//                                   variant="plain"
//                                   onClick={() => setOpenSteps((prev) => !prev)}
//                                   icon={openSteps ? CaretUpIcon : CaretDownIcon}
//                                 />
//                               </Box>
//                             </InlineStack>
//                           </BlockStack>
//                           <Collapsible
//                             open={openSteps}
//                             id="basic-collapsible"
//                             transition={{
//                               duration: "500ms",
//                               timingFunction: "ease-in-out",
//                             }}
//                             expandOnPrint
//                           >
//                             <Box paddingInline={400}>
//                               <ol>
//                                 <BlockStack gap={100}>
//                                   <li>
//                                     Browse our <strong>"Page Builder"</strong>
//                                   </li>
//                                   <li>
//                                     Click <strong>Create New Page</strong> and
//                                     define a page name.
//                                   </li>
//                                   <li>
//                                     Browse our <strong>Sections</strong> and add
//                                     sections to your page.
//                                   </li>
//                                   <li>
//                                     Click <strong>Save</strong> to publish your
//                                     page to your theme.
//                                   </li>
//                                 </BlockStack>
//                               </ol>
//                             </Box>
//                             <Box padding={400}>
//                               <Button
//                                 variant="primary"
//                                 onClick={() =>
//                                   navigate({
//                                     to: `/page-builder?${new URLSearchParams(
//                                       params
//                                     )}`,
//                                   })
//                                 }
//                               >
//                                 View Pages
//                               </Button>
//                             </Box>
//                           </Collapsible>
//                           {openSteps === false && <Box padding={200}></Box>}
//                         </Card>
//                       </InlineGrid>
//                     </BlockStack>
//                   </Card>
//                 </div>
//               </Layout.Section>
//             )}

//             <Layout.Section>
//               <div className="lazyContent" ref={addToRefs}>
//                 <BlockStack gap={400}>
//                   <InlineStack align="space-between">
//                     <InlineStack align="start">
//                       <Text variant="headingMd" as="h6">
//                         My Sections
//                       </Text>
//                     </InlineStack>
//                     {dashboardData?.sections?.length > 0 && (
//                       <InlineStack align="end">
//                         <Button
//                           onClick={() =>
//                             navigate({
//                               to: `/sectionLibrary${window.location.search}`,
//                               search: location.search,
//                             })
//                           }
//                         >
//                           View All
//                         </Button>
//                       </InlineStack>
//                     )}
//                   </InlineStack>
//                   <Card>
//                     <Bleed marginInline={400}>
//                       {dashboardData?.sections?.length === 0 ? (
//                         <BlockStack inlineAlign="center">
//                           <img
//                             style={{ maxHeight: "15rem" }}
//                             src="/assets/empty-data.png"
//                           />
//                           <Text as="h2" tone="subdued" variant="bodyMd">
//                             Click{" "}
//                             <Link removeUnderline={true}>
//                               <strong
//                                 onClick={() =>
//                                   navigate({
//                                     to: `/sectionLibrary${window.location.search}`,
//                                   })
//                                 }
//                               >
//                                 Add New Section
//                               </strong>
//                             </Link>{" "}
//                             to start creating beautiful pages by adding
//                             ready-made sections from SectionHub
//                           </Text>
//                         </BlockStack>
//                       ) : (
//                         <BlockStack gap={200}>
//                           <IndexTable
//                             itemCount={rows.length}
//                             loading={isDashboardApiCall}
//                             headings={[
//                               { title: "Section Name" },
//                               { title: "Created Date" },
//                               { title: "Theme Name" },
//                               { title: "Customize", alignment: "end" },
//                             ]}
//                             selectable={false}
//                             // loading={isDashboardApiCall}
//                           >
//                             {rows}
//                           </IndexTable>
//                           <Divider />
//                           <InlineStack align="center">
//                             <Pagination
//                               label={`Showing ${rows.length} of ${
//                                 totalRows || 0
//                               } results`}
//                               hasNext={
//                                 currentPage < Math.ceil(totalRows / rowsPerPage)
//                               }
//                               hasPrevious={currentPage > 1}
//                               onNext={handleNextPage}
//                               onPrevious={handlePreviousPage}
//                             />
//                           </InlineStack>
//                         </BlockStack>
//                       )}
//                     </Bleed>
//                   </Card>
//                 </BlockStack>
//               </div>
//             </Layout.Section>
//             <Layout.Section>
//               {showThemeBanner === true && (
//                 <CalloutCard
//                   title="💡 Need Help Customizing Your Theme?"
//                   illustration={
//                     "https://cdn.shopify.com/s/files/1/0896/6049/0015/files/theme-help-banner.svg?v=1751365401"
//                   }
//                   primaryAction={{
//                     content: "👉 Get in Touch with Us",
//                     onAction: () =>
//                       window.open(
//                         "https://softpulseinfotech.com/shopify-theme-customization?utm_source=shopify_sectionhub_plugin&utm_medium=referral&utm_campaign=custom_work",
//                         "_blank"
//                       ),
//                   }}
//                   onDismiss={() => setShowThemeBanner(false)}
//                 >
//                   <BlockStack gap={100}>
//                     <Text>We're here to help!</Text>
//                       <Text>
//                         If you need advanced theme customization beyond the
//                         ready-made sections,
//                       </Text>
//                       <Text>
//                         our team offers professional theme customization
//                         services.
//                       </Text>
//                   </BlockStack>
//                 </CalloutCard>
//               )}
//             </Layout.Section>
//             <Layout.Section>
//               <div className="lazyContent" ref={addToRefs}>
//                 <BlockStack gap={400}>
//                   <InlineStack align="space-between">
//                     <InlineStack align="start">
//                       <Text variant="headingMd" as="h6">
//                         My Pages
//                       </Text>
//                     </InlineStack>
//                     {dashboardData?.templates?.length > 0 && (
//                       <InlineStack align="end">
//                         <Button
//                           onClick={() =>
//                             navigate({
//                               to: `/page-builder${window.location.search}`,
//                             })
//                           }
//                         >
//                           View All
//                         </Button>
//                       </InlineStack>
//                     )}
//                   </InlineStack>
//                   <Card>
//                     <Bleed marginInline={400}>
//                       {dashboardData?.templates?.length === 0 ? (
//                         <BlockStack inlineAlign="center">
//                           <img
//                             style={{ maxHeight: "15rem" }}
//                             src="/assets/empty-data.png"
//                           />
//                           <Text as="h2" tone="subdued" variant="bodyMd">
//                             Click{" "}
//                             <Link removeUnderline={true}>
//                               <strong
//                                 onClick={() =>
//                                   navigate({
//                                     to: `/page-builder${window.location.search}`,
//                                   })
//                                 }
//                               >
//                                 Create New Page
//                               </strong>
//                             </Link>{" "}
//                             to start building your first page and leave a
//                             lasting impression on your audience.
//                           </Text>
//                         </BlockStack>
//                       ) : (
//                         <BlockStack gap={200}>
//                           <IndexTable
//                             itemCount={templateRows.length}
//                             loading={isDashboardApiCall}
//                             headings={[
//                               { title: "Page Name" },
//                               { title: "Created Date" },
//                               { title: "Theme Name" },
//                               { title: "", alignment: "end" },
//                             ]}
//                             selectable={false}
//                           >
//                             {templateRows}
//                           </IndexTable>
//                           <Divider />
//                           <InlineStack align="center">
//                             <div
//                               className="Polaris-Box"
//                               style={{
//                                 "--pc-box-padding-block-start-xs":
//                                   "var(--p-space-0)",
//                                 "--pc-box-padding-block-end-xs":
//                                   "var(--p-space-0)",
//                                 "--pc-box-padding-inline-start-xs":
//                                   " var(--p-space-300)",
//                                 "--pc-box-padding-inline-end-xs":
//                                   "var(--p-space-300)",
//                               }}
//                             >
//                               <div aria-live="polite">
//                                 <span className="Polaris-Text--root Polaris-Text--subdued">
//                                   Showing {templateRows.length} of{" "}
//                                   {totalTemplateRows || 0} results
//                                 </span>
//                               </div>
//                             </div>
//                           </InlineStack>
//                         </BlockStack>
//                       )}
//                     </Bleed>
//                   </Card>
//                 </BlockStack>
//               </div>
//             </Layout.Section>
//             <Layout.Section>
//               <InlineGrid gap={400} columns={2}>
//                 <Card>
//                   <BlockStack gap={200}>
//                     <InlineStack gap={200}>
//                       <span class="Polaris-Icon dashboard-icon">
//                         <svg
//                           viewBox="0 0 20 20"
//                           class="Polaris-Icon__Svg"
//                           focusable="false"
//                           aria-hidden="true"
//                         >
//                           <path d="M8 7.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path>
//                           <path d="M8.75 9.75a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"></path>
//                           <path
//                             fill-rule="evenodd"
//                             d="M2.5 5.75a2 2 0 0 1 2-2h8.5a2 2 0 0 1 2 2v7.5h2a.75.75 0 0 1 .75.75v1.5a2.25 2.25 0 0 1-2.25 2.25h-7.75a2.75 2.75 0 0 1-2.75-2.75v-4.75h-1.75a.75.75 0 0 1-.75-.75v-3.75Zm5.25 10.5c.69 0 1.25-.56 1.25-1.25v-1a.75.75 0 0 1 .75-.75h3.75v-7.5a.5.5 0 0 0-.5-.5h-6.563a1.982 1.982 0 0 1 .063.5v9.25c0 .69.56 1.25 1.25 1.25Zm2.75-1.5v.25c0 .45-.108.875-.3 1.25h5.3a.75.75 0 0 0 .75-.75v-.75h-5.75Zm-6.5-9a.5.5 0 0 1 .498-.5h.002a.5.5 0 0 1 .5.5v3h-1v-3Z"
//                           ></path>
//                         </svg>
//                       </span>
//                       <Text variant="headingMd" as="h6">
//                         Help & Guidance
//                       </Text>
//                     </InlineStack>
//                     <Text wrap={true}>
//                       Explore our Frequently Asked Questions for quick answers
//                       and helpful guidance!
//                     </Text>
//                     <Link url={`\helpGuide${location.search}`}>
//                       <InlineStack gap={100} align="start">
//                         <span class="Polaris-Icon dashboard-icon">
//                           <svg
//                             viewBox="0 0 20 20"
//                             class="Polaris-Icon__Svg"
//                             focusable="false"
//                             aria-hidden="true"
//                           >
//                             <path d="M11.75 3.5a.75.75 0 0 0 0 1.5h2.19l-4.97 4.97a.75.75 0 1 0 1.06 1.06l4.97-4.97v2.19a.75.75 0 0 0 1.5 0v-4a.75.75 0 0 0-.75-.75h-4Z"></path>
//                             <path d="M15 10.967a.75.75 0 0 0-1.5 0v2.783c0 .69-.56 1.25-1.25 1.25h-6c-.69 0-1.25-.56-1.25-1.25v-6c0-.69.56-1.25 1.25-1.25h2.783a.75.75 0 0 0 0-1.5h-2.783a2.75 2.75 0 0 0-2.75 2.75v6a2.75 2.75 0 0 0 2.75 2.75h6a2.75 2.75 0 0 0 2.75-2.75v-2.783Z"></path>
//                           </svg>
//                         </span>
//                         Visit help guide
//                       </InlineStack>
//                     </Link>
//                   </BlockStack>
//                 </Card>
//                 <Card>
//                   <BlockStack gap={200}>
//                     <InlineStack gap={200}>
//                       <span class="Polaris-Icon dashboard-icon">
//                         <svg
//                           viewBox="0 0 20 20"
//                           class="Polaris-Icon__Svg"
//                           focusable="false"
//                           aria-hidden="true"
//                         >
//                           <path
//                             fill-rule="evenodd"
//                             d="M7 15v-2.291a3 3 0 0 1-2.5-2.959v-1.25a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v1.25a3 3 0 0 1-3 3h-2.461l-3.039 2.25Zm3.534-.75h1.966a4.5 4.5 0 0 0 4.5-4.5v-1.25a4.5 4.5 0 0 0-4.5-4.5h-5a4.5 4.5 0 0 0-4.5 4.5v1.25a4.498 4.498 0 0 0 2.5 4.032v1.218a1.5 1.5 0 0 0 2.393 1.206l2.64-1.956Zm-4.534-6.5a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75Zm.75 2a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
//                           ></path>
//                         </svg>
//                       </span>
//                       <Text variant="headingMd" as="h6">
//                         Need Help? Contact Us
//                       </Text>
//                     </InlineStack>
//                     <Text>
//                       Need assistance? Don't hesitate to contact us with your
//                       questions or support requests!
//                     </Text>
//                     <Link target="_blank" onClick={openChat}>
//                       <InlineStack gap={100}>
//                         <span class="Polaris-Icon dashboard-icon">
//                           <svg
//                             viewBox="0 0 20 20"
//                             class="Polaris-Icon__Svg"
//                             focusable="false"
//                             aria-hidden="true"
//                           >
//                             <path d="M11.75 3.5a.75.75 0 0 0 0 1.5h2.19l-4.97 4.97a.75.75 0 1 0 1.06 1.06l4.97-4.97v2.19a.75.75 0 0 0 1.5 0v-4a.75.75 0 0 0-.75-.75h-4Z"></path>
//                             <path d="M15 10.967a.75.75 0 0 0-1.5 0v2.783c0 .69-.56 1.25-1.25 1.25h-6c-.69 0-1.25-.56-1.25-1.25v-6c0-.69.56-1.25 1.25-1.25h2.783a.75.75 0 0 0 0-1.5h-2.783a2.75 2.75 0 0 0-2.75 2.75v6a2.75 2.75 0 0 0 2.75 2.75h6a2.75 2.75 0 0 0 2.75-2.75v-2.783Z"></path>
//                           </svg>
//                         </span>
//                         contact support
//                       </InlineStack>
//                     </Link>
//                   </BlockStack>
//                 </Card>
//               </InlineGrid>
//             </Layout.Section>

//             <Layout.Section>
//               <Card>
//                 <BlockStack gap={400}>
//                   <Text variant="headingMd" as="h6">
//                     Recommended Apps
//                   </Text>
//                   <Grid>
//                     <Grid.Cell
//                       columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
//                     >
//                       <InlineStack gap={400} wrap={false}>
//                         <BlockStack>
//                           <Image
//                             style={{ borderRadius: "5px" }}
//                             source="https://cdn.shopify.com/app-store/listing_images/65409159476964c185568de9a6844b90/icon/CNfTnYaqtvYCEAE=.png?height=53&quality=90&width=53"
//                           />
//                         </BlockStack>
//                         <InlineGrid gap={100}>
//                           <Text variant="headingMd" as="h6">
//                             Wizio Bundle ‑ Quantity Breaks
//                           </Text>
//                           <Text>
//                             Boost AOV with quantity breaks, volume discounts &
//                             bundles
//                           </Text>
//                           <InlineStack align="start">
//                             <Button
//                               onClick={() =>
//                                 window.open(
//                                   " https://apps.shopify.com/wizio-product-bundle-upsell?utm_source=sections&utm_medium=app",
//                                   "_blank"
//                                 )
//                               }
//                             >
//                               View App
//                             </Button>
//                           </InlineStack>
//                         </InlineGrid>
//                       </InlineStack>
//                     </Grid.Cell>
//                     <Grid.Cell
//                       columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
//                     >
//                       <InlineStack gap={400} wrap={false}>
//                         <BlockStack>
//                           <Image
//                             style={{ borderRadius: "5px" }}
//                             source=" https://cdn.shopify.com/app-store/listing_images/50b71663d97e40f42439a2d725d54eb9/icon/CMHK2bj0lu8CEAE=.jpg?height=53&quality=90&width=53"
//                           />
//                         </BlockStack>
//                         <InlineGrid gap={100}>
//                           <Text variant="headingMd" as="h6">
//                             Ctx: WhatsApp Chat + Marketing
//                           </Text>
//                           <Text>
//                             WhatsApp marketing, chat support & abandoned cart
//                             recovery
//                           </Text>
//                           <InlineStack align="start">
//                             <Button
//                               onClick={() =>
//                                 window.open(
//                                   "https://apps.shopify.com/whatsapp-sharing?utm_source=sections&utm_medium=app",
//                                   "_blank"
//                                 )
//                               }
//                             >
//                               View App
//                             </Button>
//                           </InlineStack>
//                         </InlineGrid>
//                       </InlineStack>
//                     </Grid.Cell>
//                   </Grid>
//                 </BlockStack>
//               </Card>
//             </Layout.Section>
//             <ConfirmationModal
//               isOpen={deleteTemplateModal}
//               setIsOpen={setDeleteTemplateModal}
//               text="This action is irreversible. Deleting this page will permanently erase all its content. Would you like to continue?"
//               title="Confirm Page Deletion"
//               buttonText="Delete"
//               buttonAction={() => deleteTemplate()}
//               destructive={true}
//               loading={templateDeleteLoader}
//             />
//             <Layout.Section></Layout.Section>
//           </Layout>
//         )}
//       </Page>
//     </div>
//   );
// }

// export default MyLibrary;
import {
  Page,
  Layout,
  Card,
  DataTable,
  Button,
  InlineStack,
  Text,
  BlockStack,
  InlineGrid,
  Divider,
  Pagination,
  Banner,
  Image,
  Grid,
  VideoThumbnail,
  IndexTable,
  Tooltip,
  Box,
  Collapsible,
  Bleed,
  Spinner,
  Thumbnail,
  CalloutCard,
} from "@shopify/polaris";
import React, { useEffect, useRef, useState } from "react";
import {
  capitalizeFirstLetter,
  fetchData,
  fetchJsonData,
  getApiURL,
  MyEncryption,
} from "../action";
import {
  CaretDownIcon,
  CaretUpIcon,
  DeleteIcon,
  EditIcon,
  XIcon,
} from "@shopify/polaris-icons";
import moment from "moment";
import { ConfirmationModal } from "../components";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import emptyData from "/assets/empty-data.png";

function MyLibrary() {
  const [dashboardData, setDashboardData] = useState([]);
  const [trackTabChange, setTrackTabChange] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [deleteTemplateModal, setDeleteTemplateModal] = useState(false);
  const [templateDeleteLoader, setTemplateDeleteLoader] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTemplatePage, setCurrentTemplatePage] = useState(1);
  const [appStatus, setAppStatus] = useState();
  const [showBanner, setShowBanner] = useState(false);
  const [showThemeBanner, setShowThemeBanner] = useState(true);
  const lazyContentRefs = useRef([]);
  const rowsPerPage = 10;
  const encryptor = new MyEncryption();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const SHOP = urlParams.get("shop");
  const params = {};
  const [openSteps, setOpenSteps] = useState(false);

  const { data: appStatusData, isPending: isLoading } = useQuery({
    queryKey: ["app_status"],
    queryFn: async () => {
      const response = await fetchJsonData(getApiURL("/app_status"));
      return response.json();
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  const { data: dahboardApiData, isPending: isDashboardApiCall } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await fetchJsonData(getApiURL("/dashboard"));
      return response.json();
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  const addToRefs = (el) => {
    if (el && !lazyContentRefs.current.includes(el)) {
      lazyContentRefs.current.push(el);
    }
  };

  useEffect(() => {
    if (!lazyContentRefs.current.length) return;
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
  }, [appStatus, showBanner, dashboardData]);

  useEffect(() => {
    if (trackTabChange) {
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          GetAnalytics();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [trackTabChange]);

  useEffect(() => {
    const dismissedAt = localStorage.getItem("BannerDismissedAt");
    if (
      !dismissedAt ||
      new Date() - new Date(dismissedAt) > 7 * 24 * 60 * 60 * 1000
    ) {
      setShowBanner(true);
    }
  }, []);

  const handleBannerButtonClick = () => {
    setAppStatus((prev) => ({
      ...prev,
      extension_banner: { ...prev.extension_banner, status: true },
    }));
    setTrackTabChange(true);
  };

  const handleDismiss = () => {
    localStorage.setItem("BannerDismissedAt", new Date().toISOString());
    setShowBanner(false);
  };

  useEffect(() => {
    if (appStatusData) {
      setAppStatus(appStatusData);
    }
  }, [appStatusData]);

  useEffect(() => {
    if (dahboardApiData) {
      setDashboardData(dahboardApiData);
    }
  }, [dahboardApiData]);

  const deleteTemplate = async () => {
    setTemplateDeleteLoader(true);
    const formdata = new FormData();
    formdata.append("id", deleteId);
    formdata.append("shop", SHOP);
    formdata.append("theme", encryptor.encode(selectedPage?.theme_id, 42));
    const response = await fetchData(getApiURL("/delete_template"), formdata);
    setTemplateDeleteLoader(false);
    if (response?.status === true) {
      setDeleteTemplateModal(false);
      setDashboardData((prev) => ({
        ...prev,
        templates: prev.templates.filter((obj) => obj.uid !== deleteId),
      }));
    }
    shopify.toast.show(response?.message, { duration: 3000 });
  };

  const totalRows = dashboardData?.sections?.length;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = Array.isArray(dashboardData?.sections)
    ? dashboardData.sections.slice(indexOfFirstRow, indexOfLastRow)
    : [];

  const rows = currentRows.map((row, id) => (
    <IndexTable.Row id={id} key={id}>
      <IndexTable.Cell>
        <div
          style={{
            maxWidth: "300px",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          {row?.name}
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div
          style={{
            maxWidth: "200px",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          {moment(row?.created_at, "YYYY-MM-DD").format("Do MMM, YYYY")}
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div
          style={{
            maxWidth: "300px",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          {row?.theme_name}
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack align="end">
          <Tooltip content="Click to Edit" dismissOnMouseOut width="wide">
            <Button onClick={() => window.open(row?.edit)} icon={EditIcon} />
          </Tooltip>
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const totalTemplateRows = dashboardData?.templates?.length;
  const templateIndexOfLastRow = currentTemplatePage * rowsPerPage;
  const templateIndexOfFirstRow = templateIndexOfLastRow - rowsPerPage;
  const currentTemplateRows = Array.isArray(dashboardData?.templates)
    ? dashboardData?.templates.slice(
        templateIndexOfFirstRow,
        templateIndexOfLastRow
      )
    : [];

  const templateRows = currentTemplateRows?.map((row, id) => (
    <IndexTable.Row id={id} key={id}>
      <IndexTable.Cell>
        <div
          style={{
            maxWidth: "280px",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          {capitalizeFirstLetter(row?.title)}
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div
          style={{
            maxWidth: "200px",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          {moment(row?.created_at, "YYYY-MM-DD").format("Do MMM, YYYY")}
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div
          style={{
            maxWidth: "300px",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          {row?.theme_name}
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div>
          <InlineStack gap={200} align="end">
            <Tooltip content="Click to Delete" dismissOnMouseOut width="wide">
              <Button
                tone="critical"
                onClick={() => {
                  setSelectedPage(row);
                  setDeleteId(row?.uid);
                  setDeleteTemplateModal(true);
                }}
                icon={DeleteIcon}
              />
            </Tooltip>
            <Tooltip content="Click to Edit" dismissOnMouseOut width="wide">
              <Button onClick={() => window.open(row?.edit)} icon={EditIcon} />
            </Tooltip>
          </InlineStack>
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalRows / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openChat = () => {
    if (window.$crisp) {
      window.$crisp.push(["do", "chat:open"]);
    }
  };

  return (
    <div className="main-page">
      <Page
        title="Dashboard"
        subtitle="Build faster, sell smarter — unlock beautiful sections, craft standout
          pages, and elevate your brand."
      >
        {isLoading ? (
          <>
            <InlineStack align="center" blockAlign="center">
              <Spinner size="small" />
            </InlineStack>
          </>
        ) : (
          // <BlockStack gap={300}>
          //   <Card>
          //     <SkeletonBodyText />
          //   </Card>
          //   <MediaCard title={<SkeletonBodyText />}></MediaCard>
          //   <DataTable
          //     columnContentTypes={["text", "text", "text"]}
          //     headings={[<SkeletonTabs />, <SkeletonTabs />, <SkeletonTabs />]}
          //     rows={[
          //       [<SkeletonTabs />, <SkeletonTabs />, <SkeletonTabs />],
          //       [<SkeletonTabs />, <SkeletonTabs />, <SkeletonTabs />],
          //       [<SkeletonTabs />, <SkeletonTabs />, <SkeletonTabs />],
          //     ]}
          //   />
          //   <LegacyCard>
          //     <SkeletonTabs fitted />
          //   </LegacyCard>
          //   <LegacyCard>
          //     <SkeletonTabs fitted />
          //   </LegacyCard>
          // </BlockStack>
          <Layout>
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

            {showBanner && (
              <Layout.Section>
                <div className="lazyContent" ref={addToRefs}>
                  <Card>
                    <BlockStack gap={400}>
                      <InlineStack align="space-between">
                        <Text variant="headingMd" as="h6">
                          Quick Guide
                        </Text>
                        <Button
                          tone="critical"
                          variant="monochromePlain"
                          onClick={handleDismiss}
                          icon={XIcon}
                        ></Button>
                      </InlineStack>
                      <InlineGrid gap={400} columns={2}>
                        <Card padding={0}>
                          <BlockStack gap={400}>
                            <div className="dashboard-video">
                              <VideoThumbnail
                                videoLength={142}
                                thumbnailUrl={
                                  "https://cdn.shopify.com/s/files/1/0896/6049/0015/files/Section_Banner.png?v=1751365256"
                                }
                                onClick={() =>
                                  window.open("https://youtu.be/eJC9415VtC4")
                                }
                                loading={true}
                              />
                            </div>
                            <InlineStack align="space-between">
                              <Box paddingInline={400}>
                                <Text variant="headingMd" as="h6">
                                  Steps: How to Add Sections
                                </Text>
                              </Box>
                              <Box paddingInline={400}>
                                <Button
                                  variant="plain"
                                  onClick={() => setOpenSteps((prev) => !prev)}
                                  icon={openSteps ? CaretUpIcon : CaretDownIcon}
                                />
                              </Box>
                            </InlineStack>
                          </BlockStack>
                          <Collapsible
                            open={openSteps}
                            id="basic-collapsible"
                            transition={{
                              duration: "500ms",
                              timingFunction: "ease-in-out",
                            }}
                            expandOnPrint
                          >
                            <Box paddingInline={400}>
                              <ol>
                                <BlockStack gap={100}>
                                  <li>
                                    Browse our{" "}
                                    <strong>"Section Library"</strong>
                                  </li>
                                  <li>
                                    Find a suitable section and check its
                                    preview.
                                  </li>
                                  <li>
                                    Click <strong>"Add Section"</strong> and
                                    select your theme.
                                  </li>
                                  <li>
                                    Click <strong>"Add to Theme"</strong> to
                                    complete the process.
                                  </li>
                                </BlockStack>
                              </ol>
                            </Box>
                            <Box padding={400}>
                              <Button
                                variant="primary"
                                onClick={() =>
                                  navigate({
                                    href: `/sectionLibrary${window.location.search}`,
                                   search: location.search,
                                  })
                                }
                              >
                                View Sections
                              </Button>
                            </Box>
                          </Collapsible>
                          {openSteps === false && <Box padding={200}></Box>}
                        </Card>
                        <Card padding={0}>
                          <BlockStack gap={400}>
                            <div className="dashboard-video">
                              <VideoThumbnail
                                videoLength={100}
                                thumbnailUrl={
                                  "https://cdn.shopify.com/s/files/1/0896/6049/0015/files/pages-banner.png?v=1751365344"
                                }
                                onClick={() =>
                                  window.open("https://youtu.be/Dc6bdN4Mbpw")
                                }
                              />
                            </div>
                            <InlineStack align="space-between">
                              <Box paddingInline={400}>
                                <Text variant="headingMd" as="h6">
                                  Steps: How to Create Pages
                                </Text>
                              </Box>
                              <Box paddingInline={400}>
                                <Button
                                  variant="plain"
                                  onClick={() => setOpenSteps((prev) => !prev)}
                                  icon={openSteps ? CaretUpIcon : CaretDownIcon}
                                />
                              </Box>
                            </InlineStack>
                          </BlockStack>
                          <Collapsible
                            open={openSteps}
                            id="basic-collapsible"
                            transition={{
                              duration: "500ms",
                              timingFunction: "ease-in-out",
                            }}
                            expandOnPrint
                          >
                            <Box paddingInline={400}>
                              <ol>
                                <BlockStack gap={100}>
                                  <li>
                                    Browse our <strong>"Page Builder"</strong>
                                  </li>
                                  <li>
                                    Click <strong>Create New Page</strong> and
                                    define a page name.
                                  </li>
                                  <li>
                                    Browse our <strong>Sections</strong> and add
                                    sections to your page.
                                  </li>
                                  <li>
                                    Click <strong>Save</strong> to publish your
                                    page to your theme.
                                  </li>
                                </BlockStack>
                              </ol>
                            </Box>
                            <Box padding={400}>
                              <Button
                                variant="primary"
                                onClick={() =>
                                  navigate({
                                    href: `/page-builder${window.location.search}`,
                                    search: location.search,
                                  })
                                }
                              >
                                View Pages
                              </Button>
                            </Box>
                          </Collapsible>
                          {openSteps === false && <Box padding={200}></Box>}
                        </Card>
                      </InlineGrid>
                    </BlockStack>
                  </Card>
                </div>
              </Layout.Section>
            )}

            <Layout.Section>
              <div className="lazyContent" ref={addToRefs}>
                <BlockStack gap={400}>
                  <InlineStack align="space-between">
                    <InlineStack align="start">
                      <Text variant="headingMd" as="h6">
                        My Sections
                      </Text>
                    </InlineStack>
                    {dashboardData?.sections?.length > 0 && (
                      <InlineStack align="end">
                        <Button
                          onClick={() =>{
                          
                            navigate({
                              href: `/sectionLibrary${window.location.search}`,
                              search: location.search,
                            })}
                          }
                        >
                          View All
                        </Button>
                      </InlineStack>
                    )}
                  </InlineStack>
                  <Card>
                    <Bleed marginInline={400}>
                      {dashboardData?.sections?.length === 0 ? (
                        <BlockStack inlineAlign="center">
                          <img style={{ maxHeight: "15rem" }} src={emptyData} />
                          <Text as="h2" tone="subdued" variant="bodyMd">
                            Click{" "}
                            <Link
                              removeUnderline={true}
                              to={`/sectionLibrary${window.location.search}`}
                            >
                              <strong>Add New Section</strong>
                            </Link>{" "}
                            to start creating beautiful pages by adding
                            ready-made sections from SectionHub
                          </Text>
                        </BlockStack>
                      ) : (
                        <BlockStack gap={200}>
                          <IndexTable
                            itemCount={rows.length}
                            loading={isDashboardApiCall}
                            headings={[
                              { title: "Section Name" },
                              { title: "Created Date" },
                              { title: "Theme Name" },
                              { title: "Customize", alignment: "end" },
                            ]}
                            selectable={false}
                            // loading={isDashboardApiCall}
                          >
                            {rows}
                          </IndexTable>
                          <Divider />
                          <InlineStack align="center">
                            <Pagination
                              label={`Showing ${rows.length} of ${
                                totalRows || 0
                              } results`}
                              hasNext={
                                currentPage < Math.ceil(totalRows / rowsPerPage)
                              }
                              hasPrevious={currentPage > 1}
                              onNext={handleNextPage}
                              onPrevious={handlePreviousPage}
                            />
                          </InlineStack>
                        </BlockStack>
                      )}
                    </Bleed>
                  </Card>
                </BlockStack>
              </div>
            </Layout.Section>
            <Layout.Section>
              {showThemeBanner === true && (
                <CalloutCard
                  title="💡 Need Help Customizing Your Theme?"
                  illustration={
                    "https://cdn.shopify.com/s/files/1/0896/6049/0015/files/theme-help-banner.svg?v=1751365401"
                  }
                  primaryAction={{
                    content: "👉 Get in Touch with Us",
                    onAction: () =>
                      window.open(
                        "https://softpulseinfotech.com/shopify-theme-customization?utm_source=shopify_sectionhub_plugin&utm_medium=referral&utm_campaign=custom_work",
                        "_blank"
                      ),
                  }}
                  onDismiss={() => setShowThemeBanner(false)}
                >
                  <BlockStack gap={100}>
                    <Text>We're here to help!</Text>
                    <Text>
                      If you need advanced theme customization beyond the
                      ready-made sections,
                    </Text>
                    <Text>
                      our team offers professional theme customization services.
                    </Text>
                  </BlockStack>
                </CalloutCard>
              )}
            </Layout.Section>
            <Layout.Section>
              <div className="lazyContent" ref={addToRefs}>
                <BlockStack gap={400}>
                  <InlineStack align="space-between">
                    <InlineStack align="start">
                      <Text variant="headingMd" as="h6">
                        My Pages
                      </Text>
                    </InlineStack>
                    {dashboardData?.templates?.length > 0 && (
                      <InlineStack align="end">
                        <Button
                          onClick={() =>
                            navigate({
                              href: `/page-builder${window.location.search}`,
                              search : location.search
                            })
                          }
                        >
                          View All
                        </Button>
                      </InlineStack>
                    )}
                  </InlineStack>
                  <Card>
                    <Bleed marginInline={400}>
                      {dashboardData?.templates?.length === 0 ? (
                        <BlockStack inlineAlign="center">
                          <img style={{ maxHeight: "15rem" }} src={emptyData} />
                          <Text as="h2" tone="subdued" variant="bodyMd">
                            Click{" "}
                            <Link
                              removeUnderline={true}
                              to={`/page-builder${window.location.search}`}
                            >
                              <strong>Create New Page</strong>
                            </Link>{" "}
                            to start building your first page and leave a
                            lasting impression on your audience.
                          </Text>
                        </BlockStack>
                      ) : (
                        <BlockStack gap={200}>
                          <IndexTable
                            itemCount={templateRows.length}
                            loading={isDashboardApiCall}
                            headings={[
                              { title: "Page Name" },
                              { title: "Created Date" },
                              { title: "Theme Name" },
                              { title: "", alignment: "end" },
                            ]}
                            selectable={false}
                          >
                            {templateRows}
                          </IndexTable>
                          <Divider />
                          <InlineStack align="center">
                            <div
                              className="Polaris-Box"
                              style={{
                                "--pc-box-padding-block-start-xs":
                                  "var(--p-space-0)",
                                "--pc-box-padding-block-end-xs":
                                  "var(--p-space-0)",
                                "--pc-box-padding-inline-start-xs":
                                  " var(--p-space-300)",
                                "--pc-box-padding-inline-end-xs":
                                  "var(--p-space-300)",
                              }}
                            >
                              <div aria-live="polite">
                                <span className="Polaris-Text--root Polaris-Text--subdued">
                                  Showing {templateRows.length} of{" "}
                                  {totalTemplateRows || 0} results
                                </span>
                              </div>
                            </div>
                          </InlineStack>
                        </BlockStack>
                      )}
                    </Bleed>
                  </Card>
                </BlockStack>
              </div>
            </Layout.Section>
            <Layout.Section>
              <InlineGrid gap={400} columns={2}>
                <Card>
                  <BlockStack gap={200}>
                    <InlineStack gap={200}>
                      <span class="Polaris-Icon dashboard-icon">
                        <svg
                          viewBox="0 0 20 20"
                          class="Polaris-Icon__Svg"
                          focusable="false"
                          aria-hidden="true"
                        >
                          <path d="M8 7.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path>
                          <path d="M8.75 9.75a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"></path>
                          <path
                            fill-rule="evenodd"
                            d="M2.5 5.75a2 2 0 0 1 2-2h8.5a2 2 0 0 1 2 2v7.5h2a.75.75 0 0 1 .75.75v1.5a2.25 2.25 0 0 1-2.25 2.25h-7.75a2.75 2.75 0 0 1-2.75-2.75v-4.75h-1.75a.75.75 0 0 1-.75-.75v-3.75Zm5.25 10.5c.69 0 1.25-.56 1.25-1.25v-1a.75.75 0 0 1 .75-.75h3.75v-7.5a.5.5 0 0 0-.5-.5h-6.563a1.982 1.982 0 0 1 .063.5v9.25c0 .69.56 1.25 1.25 1.25Zm2.75-1.5v.25c0 .45-.108.875-.3 1.25h5.3a.75.75 0 0 0 .75-.75v-.75h-5.75Zm-6.5-9a.5.5 0 0 1 .498-.5h.002a.5.5 0 0 1 .5.5v3h-1v-3Z"
                          ></path>
                        </svg>
                      </span>
                      <Text variant="headingMd" as="h6">
                        Help & Guidance
                      </Text>
                    </InlineStack>
                    <Text wrap={true}>
                      Explore our Frequently Asked Questions for quick answers
                      and helpful guidance!
                    </Text>
                    <Link to={`/helpGuide${location.search}`}>
                      <InlineStack gap={100} align="start">
                        <span class="Polaris-Icon dashboard-icon">
                          <svg
                            viewBox="0 0 20 20"
                            class="Polaris-Icon__Svg"
                            focusable="false"
                            aria-hidden="true"
                          >
                            <path d="M11.75 3.5a.75.75 0 0 0 0 1.5h2.19l-4.97 4.97a.75.75 0 1 0 1.06 1.06l4.97-4.97v2.19a.75.75 0 0 0 1.5 0v-4a.75.75 0 0 0-.75-.75h-4Z"></path>
                            <path d="M15 10.967a.75.75 0 0 0-1.5 0v2.783c0 .69-.56 1.25-1.25 1.25h-6c-.69 0-1.25-.56-1.25-1.25v-6c0-.69.56-1.25 1.25-1.25h2.783a.75.75 0 0 0 0-1.5h-2.783a2.75 2.75 0 0 0-2.75 2.75v6a2.75 2.75 0 0 0 2.75 2.75h6a2.75 2.75 0 0 0 2.75-2.75v-2.783Z"></path>
                          </svg>
                        </span>
                        Visit help guide
                      </InlineStack>
                    </Link>
                  </BlockStack>
                </Card>
                <Card>
                  <BlockStack gap={200}>
                    <InlineStack gap={200}>
                      <span class="Polaris-Icon dashboard-icon">
                        <svg
                          viewBox="0 0 20 20"
                          class="Polaris-Icon__Svg"
                          focusable="false"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7 15v-2.291a3 3 0 0 1-2.5-2.959v-1.25a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v1.25a3 3 0 0 1-3 3h-2.461l-3.039 2.25Zm3.534-.75h1.966a4.5 4.5 0 0 0 4.5-4.5v-1.25a4.5 4.5 0 0 0-4.5-4.5h-5a4.5 4.5 0 0 0-4.5 4.5v1.25a4.498 4.498 0 0 0 2.5 4.032v1.218a1.5 1.5 0 0 0 2.393 1.206l2.64-1.956Zm-4.534-6.5a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75Zm.75 2a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
                          ></path>
                        </svg>
                      </span>
                      <Text variant="headingMd" as="h6">
                        Need Help? Contact Us
                      </Text>
                    </InlineStack>
                    <Text>
                      Need assistance? Don't hesitate to contact us with your
                      questions or support requests!
                    </Text>
                    <InlineStack align="start">
                      <Button variant="plain" onClick={openChat}>
                        <InlineStack gap={100}>
                          <span class="Polaris-Icon dashboard-icon">
                            <svg
                              viewBox="0 0 20 20"
                              class="Polaris-Icon__Svg"
                              focusable="false"
                              aria-hidden="true"
                            >
                              <path d="M11.75 3.5a.75.75 0 0 0 0 1.5h2.19l-4.97 4.97a.75.75 0 1 0 1.06 1.06l4.97-4.97v2.19a.75.75 0 0 0 1.5 0v-4a.75.75 0 0 0-.75-.75h-4Z"></path>
                              <path d="M15 10.967a.75.75 0 0 0-1.5 0v2.783c0 .69-.56 1.25-1.25 1.25h-6c-.69 0-1.25-.56-1.25-1.25v-6c0-.69.56-1.25 1.25-1.25h2.783a.75.75 0 0 0 0-1.5h-2.783a2.75 2.75 0 0 0-2.75 2.75v6a2.75 2.75 0 0 0 2.75 2.75h6a2.75 2.75 0 0 0 2.75-2.75v-2.783Z"></path>
                            </svg>
                          </span>
                          contact support
                        </InlineStack>
                      </Button>
                    </InlineStack>
                  </BlockStack>
                </Card>
              </InlineGrid>
            </Layout.Section>

            <Layout.Section>
              <Card>
                <BlockStack gap={400}>
                  <Text variant="headingMd" as="h6">
                    Recommended Apps
                  </Text>
                  <Grid>
                    <Grid.Cell
                      columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                    >
                      <InlineStack gap={400} wrap={false}>
                        <BlockStack>
                          <Image
                            style={{ borderRadius: "5px" }}
                            source="https://cdn.shopify.com/app-store/listing_images/65409159476964c185568de9a6844b90/icon/CNfTnYaqtvYCEAE=.png?height=53&quality=90&width=53"
                          />
                        </BlockStack>
                        <InlineGrid gap={100}>
                          <Text variant="headingMd" as="h6">
                            Wizio Bundle ‑ Quantity Breaks
                          </Text>
                          <Text>
                            Boost AOV with quantity breaks, volume discounts &
                            bundles
                          </Text>
                          <InlineStack align="start">
                            <Button
                              onClick={() =>
                                window.open(
                                  " https://apps.shopify.com/wizio-product-bundle-upsell?utm_source=sections&utm_medium=app",
                                  "_blank"
                                )
                              }
                            >
                              View App
                            </Button>
                          </InlineStack>
                        </InlineGrid>
                      </InlineStack>
                    </Grid.Cell>
                    <Grid.Cell
                      columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                    >
                      <InlineStack gap={400} wrap={false}>
                        <BlockStack>
                          <Image
                            style={{ borderRadius: "5px" }}
                            source=" https://cdn.shopify.com/app-store/listing_images/50b71663d97e40f42439a2d725d54eb9/icon/CMHK2bj0lu8CEAE=.jpg?height=53&quality=90&width=53"
                          />
                        </BlockStack>
                        <InlineGrid gap={100}>
                          <Text variant="headingMd" as="h6">
                            Ctx: WhatsApp Chat + Marketing
                          </Text>
                          <Text>
                            WhatsApp marketing, chat support & abandoned cart
                            recovery
                          </Text>
                          <InlineStack align="start">
                            <Button
                              onClick={() =>
                                window.open(
                                  "https://apps.shopify.com/whatsapp-sharing?utm_source=sections&utm_medium=app",
                                  "_blank"
                                )
                              }
                            >
                              View App
                            </Button>
                          </InlineStack>
                        </InlineGrid>
                      </InlineStack>
                    </Grid.Cell>
                  </Grid>
                </BlockStack>
              </Card>
            </Layout.Section>
            <ConfirmationModal
              isOpen={deleteTemplateModal}
              setIsOpen={setDeleteTemplateModal}
              text="This action is irreversible. Deleting this page will permanently erase all its content. Would you like to continue?"
              title="Confirm Page Deletion"
              buttonText="Delete"
              buttonAction={() => deleteTemplate()}
              destructive={true}
              loading={templateDeleteLoader}
            />
            <Layout.Section></Layout.Section>
          </Layout>
        )}
      </Page>
    </div>
  );
}

export default MyLibrary;
