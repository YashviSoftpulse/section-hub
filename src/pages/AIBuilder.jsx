// import {
//   Page,
//   Layout,
//   Card,
//   IndexTable,
//   useIndexResourceState,
//   Text,
//   BlockStack,
//   InlineStack,
// } from "@shopify/polaris";
// import { useNavigate } from "@tanstack/react-router";

// const dummyRows = [
//   {
//     id: "1",
//     prompt: "Generate product title for red shoes",
//     credit: 2,
//     date: "2025-06-20",
//   },
//   {
//     id: "2",
//     prompt: "Summarize customer review",
//     credit: 1,
//     date: "2025-06-21",
//   },
//   {
//     id: "3",
//     prompt: "Rewrite SEO description for summer collection",
//     credit: 3,
//     date: "2025-06-21",
//   },
//   {
//     id: "4",
//     prompt: "Generate Instagram caption",
//     credit: 1,
//     date: "2025-06-22",
//   },
//   {
//     id: "5",
//     prompt: "Translate product spec to Spanish",
//     credit: 2,
//     date: "2025-06-23",
//   },
// ];

// const AIBuilder = () => {
//   const resourceName = {
//     singular: "entry",
//     plural: "entries",
//   };
//   const navigate = useNavigate();

//   const { selectedResources, allResourcesSelected, handleSelectionChange } =
//     useIndexResourceState(dummyRows);

//   const totalCredit = dummyRows.reduce((sum, row) => sum + row.credit, 0);
//   const uniqueDays = new Set(dummyRows.map(row => row.date)).size;

//   return (
//     <Page
//       title="AI Section Builder"
//       primaryAction={{
//         content: "Generate with AI",
//         onAction:() => navigate({to : `/ai-builder/generate${window.location.search}`}),
//       }}
//     >
//       <Layout>
//         <Layout.Section>
//           <Card>
//             <BlockStack gap={300}>
//               <Text variant="headingMd">Credit Usage</Text>
//               <InlineStack gap={400}>
//                 <Text>Total Credit Used: {totalCredit}</Text>
//                 <Text>Number of Days: {uniqueDays}</Text>
//               </InlineStack>
//               <IndexTable
//                 resourceName={resourceName}
//                 itemCount={dummyRows.length}
//                 selectedItemsCount={
//                   allResourcesSelected ? "All" : selectedResources.length
//                 }
//                 onSelectionChange={handleSelectionChange}
//                 headings={[
               
//                   { title: "Date" },
//                   { title: "Credit Used" },
//                 ]}
//                 selectable={false}
//               >
//                 {dummyRows.map(({ id, prompt, credit, date }, index) => (
//                   <IndexTable.Row
//                     id={id}
//                     key={id}
//                     selected={selectedResources.includes(id)}
//                     position={index}
//                   >
                    
//                     <IndexTable.Cell>{credit}</IndexTable.Cell>
//                     <IndexTable.Cell>{date}</IndexTable.Cell>
//                   </IndexTable.Row>
//                 ))}
//               </IndexTable>
//             </BlockStack>
//           </Card>
//         </Layout.Section>
//       </Layout>
//     </Page>
//   );
// };

// export default AIBuilder;
