// import {
//   Page,
//   Layout,
//   Card,
//   IndexTable,
//   useIndexResourceState,
//   Text,
//   BlockStack,
//   InlineStack,
//   Bleed,
// } from "@shopify/polaris";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "@tanstack/react-router";
// import { useState } from "react";
// import { fetchJsonData, getApiURL } from "../action";

// const AIBuilder = () => {
//   const navigate = useNavigate();
//   const resourceName = {
//     singular: "entry",
//     plural: "entries",
//   };
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [sort] = useState("desc");

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["usedCredits", page, limit, sort],
//     queryFn: async () => {
//       const formData = new FormData();
//       formData.append("limit", limit.toString());
//       formData.append("page", page.toString());
//       formData.append("sort", sort);

//       const res = await fetchJsonData(getApiURL("/get-used-credits"), formData);
//       return res.json();
//     },
//     staleTime: 0,
//     refetchOnMount: true,
//   });

//   const rows = data?.data || [];

//   const { selectedResources, allResourcesSelected, handleSelectionChange } =
//     useIndexResourceState(rows);

//   return (
//     <Page
//       title="AI Section Builder"
//       primaryAction={{
//         content: "Generate with AI",
//         onAction: () =>
//           navigate({ to: `/ai-builder/generate${window.location.search}` }),
//       }}
//     >
//       <Layout>
//         <Layout.Section>
//           <Card>
//             <BlockStack gap={300}>
//               <Text variant="headingMd">Credit Usage</Text>
//               {isLoading && <Text>Loading...</Text>}
//               {isError && (
//                 <Text tone="critical">Error loading credit usage.</Text>
//               )}

//               {!isLoading && !isError && (
//                 <Bleed marginInline={400}>
//                   <IndexTable
//                     resourceName={resourceName}
//                     itemCount={rows.length}
//                     selectedItemsCount={
//                       allResourcesSelected ? "All" : selectedResources.length
//                     }
//                     onSelectionChange={handleSelectionChange}
//                     headings={[
//                       { title: "Sections" },
//                       { title: "Credit Used" },
//                       { title: "Created At" },
//                     ]}
//                     selectable={false}
//                   >
//                     {rows.map(({ id, sections, credits_used, date }, index) => (
//                       <IndexTable.Row
//                         id={id}
//                         key={id}
//                         selected={selectedResources.includes(id)}
//                         position={index}
//                       >
//                         <IndexTable.Cell>
//                           <BlockStack gap={100}>
//                             {sections
//                               .split(",")
//                               .map((item) => item.trim())
//                               .map((file, index) => (
//                                 <Text variant="bodyMd" as="p" key={index}>
//                                   {file}
//                                 </Text>
//                               ))}
//                           </BlockStack>
//                         </IndexTable.Cell>
//                         <IndexTable.Cell>{credits_used}</IndexTable.Cell>
//                         <IndexTable.Cell>{date}</IndexTable.Cell>
//                       </IndexTable.Row>
//                     ))}
//                   </IndexTable>
//                 </Bleed>
//               )}
//             </BlockStack>
//           </Card>
//         </Layout.Section>
//       </Layout>
//     </Page>
//   );
// };

// export default AIBuilder;
