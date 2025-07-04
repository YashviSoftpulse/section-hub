// import React, { useEffect, useRef, useState } from "react";
// import moment from "moment";
// import {
//   Page,
//   Layout,
//   Card,
//   Banner,
//   Button,
//   TextField,
//   Text,
//   Divider,
//   InlineStack,
//   BlockStack,
//   Tooltip,
//   Icon,
//   Modal,
//   Box
// } from "@shopify/polaris";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { ClipboardIcon, CheckIcon, ViewIcon } from "@shopify/polaris-icons";
// import { useNavigate } from "@tanstack/react-router";

// export default function Generate() {
//   const [query, setQuery] = useState("");
//   const [openSaveModal, setOpenSaveModal] = useState(false);
//   const [savingName, setSavingName] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [selectedPrompt, setSelectedPrompt] = useState(null);
//   const [selectedResponse, setSelectedResponse] = useState(null);
//   const [localHistory, setLocalHistory] = useState([]);
//   const queryClient = useQueryClient();
//   const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [previewHtml, setPreviewHtml] = useState("");
//   const navigate = useNavigate();
//   const [themeList, setThemeList] = useState([]);
//   const [selectedTheme, setSelectedTheme] = useState(null);

//   // Format date labels (Today, Yesterday, or date string)
//   const formatDateLabel = (date) => {
//     const mDate = moment(date);
//     const today = moment();
//     const yesterday = moment().subtract(1, "days");

//     if (mDate.isSame(today, "day")) return "Today";
//     if (mDate.isSame(yesterday, "day")) return "Yesterday";
//     return mDate.format("MMMM Do, YYYY");
//   };

//   const history = [
//     {
//       id: "1",
//       prompt: "Hero banner with image and button",
//       response:
//         "<style>/* style */</style><div>Hero</div>{% schema %}...{% endschema %}",
//       createdAt: moment().toISOString(), // today
//     },
//     {
//       id: "2",
//       prompt: "Testimonial slider",
//       response:
//         "<style>/* slider */</style><div>Testimonials</div>{% schema %}...{% endschema %}",
//       createdAt: moment().subtract(1, "days").toISOString(), // yesterday
//     },
//     {
//       id: "3",
//       prompt: "Newsletter sign-up section",
//       response:
//         "<style>/* signup */</style><div>Newsletter</div>{% schema %}...{% endschema %}",
//       createdAt: moment().subtract(2, "days").toISOString(),
//     },
//     {
//       id: "4",
//       prompt: "Product list with filter",
//       response:
//         "<style>/* filter */</style><div>Products</div>{% schema %}...{% endschema %}",
//       createdAt: moment().subtract(2, "days").toISOString(),
//     },
//   ];

//   const groupedByDate = history.reduce((acc, item) => {
//     const date = moment(item.createdAt).format("YYYY-MM-DD");
//     if (!acc[date]) acc[date] = [];
//     if (acc[date].length < 4) acc[date].push(item);
//     return acc;
//   }, {});

//   // Fetch history on mount
//   const { isLoading: loadingHistory } = useQuery({
//     queryKey: ["history"],
//     queryFn: async () => {
//       const res = await fetch(`/api/history`);
//       if (!res.ok) throw new Error("Failed to fetch history");
//       return res.json();
//     },
//     onSuccess: (data) => {
//       setLocalHistory(data);
//     },
//   });

//   const today = moment().format("YYYY-MM-DD");
//   const todayRequestCount = groupedByDate[today]?.length || 0;
//   const dailyLimitReached = todayRequestCount >= 4;

//   const {
//     data: generatedSection,
//     refetch: generateSection,
//     isFetching: isGenerating,
//   } = useQuery({
//     queryKey: ["generate-section", query],
//     queryFn: async () => {
//       const finalPrompt = query;

//       setSelectedPrompt("");
//       setSelectedResponse("");
//       const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           Authorization:
//             "Bearer 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",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "google/gemma-3n-e4b-it:free",
//           messages: [
//             {
//               role: "user",
//               content: ` ${finalPrompt} You are a Shopify theme expert. You are a Shopify theme expert.
//                 Generate a reusable Shopify section written in Liquid and compatible with any Shopify 2.0 theme (including Dawn, Impulse, and Debut).
//                 The output must:
//                   - Use semantic HTML and neutral class names
//                   - Include a valid schema inside {% schema %} and {% endschema %}
//                   - Use section.settings for all dynamic values
//                   - Include a presets block
//                   - Avoid JavaScript or theme sp- specific classes
//                   - Return only valid Shopify Liquid code
//                   - some related section accepted javascript code
//                   - Do not include any explanations or comments
//                   - The class names should start with the prefix sp- and be related to the section name
//                   - All CSS should be scoped under the parent selector #sp-{{ section.id }}
//                   - Use blocks in the schema if the section requires repeating elements (like testimonials, icons, images, etc.).
//                   - All visible text (titles, buttons, captions) must use section.settings to ensure it's customizable and supports localization.
//                   - Do not use static IDs or global class names. All styles must be scoped using '#sp-{{ section.id }}'.
//                   - Schema must contain only valid JSON. Do not include any Liquid tags or JavaScript inside '{% schema %}'.
//                   - All content must be dynamic using section.settings or block.settings.
//                   - If the section contains repeatable content, use {% for block in section.blocks %} with proper block type and schema.
//                   - Please insert a dummy image in this section as a temporary placeholder. Ex: https://picsum.photos/seed/picsum/200/300
//                   - Embed the dummy video in the designated video section using the standard video block or iframe code.
//                   - Include a presets block with the following structure:
//                     {
//                       "name": "SH: [Descriptive Title Based on instruction]",
//                       "category": "Custom",
//                       "settings": {},
//                       "blocks": []
//                     }
//                   - 
//                   - Final output must contain four parts in this exact order:
//                     1. <style> block
//                     2. HTML content (using dynamic values)
//                     3. <script> (optional)
//                     4. {% schema %} ... {% endschema %}

//                   - 

//                 Output only the complete Liquid + schema code in a single code block.`,
//             },
//           ],
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to generate section");
//       const d = await res.json();
//       return d.choices[0].message.content;
//     },
//     enabled: false,
//     retry: false,
//     onSuccess: (data) => {
//       const newItem = {
//         id: String(Date.now()),
//         prompt: query,
//         response: data,
//         createdAt: moment().format("YYYY-MM-DD"),
//       };

//       setLocalHistory((prev) => [newItem, ...prev]);
//       setSelectedPrompt(newItem);
//       setSelectedResponse(data);
//       setHasGeneratedOnce(true);

//       queryClient.invalidateQueries({ queryKey: ["history"] });
//       queryClient.invalidateQueries({ queryKey: ["used-credits"] });

//       shopify.toast.show("Section generated successfully.", { duration: 2000 });
//     },
//     onError: (error) => {
//       shopify.toast.show(`Error generating section: ${error.message}`, {
//         duration: 3000,
//       });
//     },
//   });

//   const saveMutation = useMutation({
//     mutationFn: async () => {
//       if (!savingName.trim()) {
//         throw new Error("Please enter a section name");
//       }
//       const res = await fetch("/api/save-section", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           prompt: query.trim(),
//           response: generatedSection,
//           name: savingName.trim(),
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to save section");
//       }
//     },
//     onMutate: () => {},
//     onSuccess: () => {
//       setOpenSaveModal(false);
//       setSavingName("");
//       queryClient.invalidateQueries({ queryKey: ["history"] });
//       shopify.toast.show("Section added successfully.", { duration: 2000 });
//     },
//     onError: (error) => {
//       shopify.toast.show(`Save failed: ${error.message}`, { duration: 2000 });
//     },
//   });

//   const handleGenerate = () => {
//     const trimmed = query.trim();
//     if (!trimmed) {
//       shopify.toast.show("Please enter a prompt.", { duration: 2000 });
//       return;
//     }

//     if (!hasGeneratedOnce && dailyLimitReached) {
//       shopify.toast.show(
//         "Daily limit reached: You have used all 4 generation requests for today.",
//         { duration: 3000 }
//       );
//       return;
//     }
//     generateSection();
//   };

//   const handleCopy = async () => {
//     const data = generatedSection || selectedResponse;
//     if (!data) return;
//     try {
//       await navigator.clipboard.writeText(data);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//       shopify.toast.show("Code copied to clipboard.", { duration: 2000 });
//     } catch {
//       shopify.toast.show("Failed to copy code.", { duration: 2000 });
//     }
//   };

//   // Function to process code for preview
//   const processCodeForPreview = (code) => {
//     if (!code) return "";

//     return code
//       .replace(/```liquid/g, "")
//       .replace(/```/g, "")
//       .split("{% schema %}")[0] // remove schema block
//       .replace(/{%[\s\S]*?%}/g, "") // remove all Liquid tags
//       .replace(/{{[\s\S]*?}}/g, "Placeholder"); // replace Liquid variables with placeholders
//   };

//   // Function to extract HTML content from the processed code
//   const extractHtmlContent = (processedCode) => {
//     const styleMatch = processedCode.match(/<style>([\s\S]*?)<\/style>/);
//     const htmlMatch = processedCode.match(/<\/style>([\s\S]*?)(?=<script>|$)/);

//     const styles = styleMatch ? styleMatch[1] : "";
//     const html = htmlMatch ? htmlMatch[1].trim() : processedCode;

//     return { styles, html };
//   };

//   const handlePreview = () => {
//     const data = generatedSection || selectedResponse;
//     if (!data) return;

//     // If we have preview HTML, use it directly
//     if (previewHtml) {
//       setShowPreviewModal(true);
//       return;
//     }

//     // Otherwise, process the Liquid code to create preview HTML
//     const processedCode = processCodeForPreview(data);
//     const { styles, html } = extractHtmlContent(processedCode);

//     const previewContent = `
//       <style>${styles}</style>
//       <div class="preview-container">${html}</div>
//     `;

//     setPreviewHtml(previewContent);
//     setShowPreviewModal(true);
//   };

//  const { data: themeListData, isPending: isThemeListApiCall } = useQuery({
//     queryKey: ["theme_list"],
//     queryFn: async () => {
//       const response = await fetchData(getApiURL("/theme_list"));
//       return response;
//     },
//     staleTime: 0,
//     refetchOnMount: true,
//   });

//   useEffect(() => {
//     if (themeListData) {
//       setThemeList(themeListData.themes_list);
//       const defaultTheme = themeListData.themes_list?.find(
//         (theme) => theme.role === "main"
//       );
//       if (defaultTheme) {
//         setSelectedTheme(defaultTheme.id);
//       }
//     }
//   }, [themeListData]);

//   return (
//     <Page
//       title="AI Section Builder"
//       primaryAction={{
//         content: "Save",
//         onAction: () => setOpenSaveModal(true),
//         loading: themeListData,
//       }}
//       backAction={{
//         onAction: () =>
//           navigate({ to: `/ai-builder${window.location.search}` }),
//       }}
//     >
//       <Layout>
//         <Layout.Section>
//           <Layout>
//             <Layout.Section variant="oneThird">
//               <Card title="History (4/day limit)">
//                 <BlockStack gap={200}>
//                   <BlockStack gap={300}>
//                     <Text>Describe the section you want to generate</Text>
//                     <div className="Polaris-Connected">
//                       <div className="Polaris-Connected__Item Polaris-Connected__Item--primary">
//                         <div className="Polaris-TextField Polaris-TextField--multiline">
//                           <textarea
//                             id="r5"
//                             className="Polaris-TextField__Input"
//                             type="text"
//                             rows="5"
//                             aria-labelledby="r5Label"
//                             aria-invalid="false"
//                             aria-multiline="true"
//                             style={{
//                               height: "110px",
//                               fontSize: "var(--p-text-body-sm-font-size)",
//                             }}
//                             value={query}
//                             onChange={(e) => setQuery(e.target.value)}
//                             onKeyPress={(e) =>
//                               e.key === "Enter" &&
//                               !e.shiftKey &&
//                               handleGenerate()
//                             }
//                           ></textarea>
//                           <div className="Polaris-TextField__Backdrop"></div>
//                           <div
//                             aria-hidden="true"
//                             className="Polaris-TextField__Resizer"
//                           >
//                             <div className="Polaris-TextField__DummyInput">
//                               <br />
//                             </div>
//                             <div className="Polaris-TextField__DummyInput">
//                               <br />
//                               <br />
//                               <br />
//                               <br />
//                               <br />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <Button
//                       variant="primary"
//                       size="large"
//                       onClick={handleGenerate}
//                       loading={isGenerating}
//                       fullWidth
//                     >
//                       {hasGeneratedOnce ? "Regenerate" : "Generate"}
//                     </Button>

//                     {dailyLimitReached && (
//                       <Banner status="critical" title="Daily limit reached">
//                         Daily limit reached: You've used all 4 generation
//                         requests for today.
//                       </Banner>
//                     )}
//                   </BlockStack>

//                   <Divider />

//                   <BlockStack gap={300}>
//                     <Text variant="headingMd">Prompt</Text>

//                     {Object.entries(groupedByDate).map(
//                       ([date, prompts], index, array) => (
//                         <BlockStack gap="200" key={date}>
//                           <Text variant="headingXs" as="h6">
//                             {formatDateLabel(date)}
//                           </Text>
//                           <BlockStack gap="200">
//                             {prompts.map((entry) => (
//                               <InlineStack
//                                 wrap={false}
//                                 align="space-between"
//                                 key={entry.id}
//                               >
//                                 <Button
//                                   textAlign="left"
//                                   tone="subdued"
//                                   fullWidth
//                                   variant={
//                                     selectedPrompt?.id === entry.id
//                                       ? ""
//                                       : "tertiary"
//                                   }
//                                   onClick={() => {
//                                     setSelectedPrompt(entry);
//                                     setSelectedResponse(entry.response);
//                                     setPreviewHtml(entry.previewHtml || "");
//                                     setQuery(entry.prompt);
//                                     setHasGeneratedOnce(true);
//                                   }}
//                                 >
//                                   <Text>{entry.prompt}</Text>
//                                 </Button>
//                                 {selectedPrompt?.id === entry.id && (
//                                   <Icon source={CheckIcon}></Icon>
//                                 )}
//                               </InlineStack>
//                             ))}
//                           </BlockStack>
//                           {index < array.length - 1 && <Divider />}
//                         </BlockStack>
//                       )
//                     )}
//                   </BlockStack>
//                 </BlockStack>
//               </Card>
//             </Layout.Section>

//             <Layout.Section>
//               <BlockStack gap={400}>
//                 <Card title="Generated Code" sectioned>
//                   <div
//                     class="Polaris-InlineStack"
//                     style={{
//                       "--pc-inline-stack-align": "space-between",
//                       "--pc-inline-stack-wrap": "wrap",
//                       "--pc-inline-stack-flex-direction-xs": "row",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Text variant="headingMd">Code</Text>
//                     <div
//                       class="Polaris-InlineStack"
//                       style={{
//                         "--pc-inline-stack-wrap": "wrap",
//                         "--pc-inline-stack-gap-xs": "var(--p-space-200)",
//                         "--pc-inline-stack-flex-direction-xs": "row",
//                         alignItems: "baseline",
//                       }}
//                     >
//                       <Tooltip content={copied ? "Copied!" : "Copy code"}>
//                         <Button
//                           icon={!copied ? ClipboardIcon : CheckIcon}
//                           onClick={handleCopy}
//                         />
//                       </Tooltip>
//                       {generatedSection && (
//                         <Button icon={ViewIcon} onClick={handlePreview}>
//                           Preview
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                   <pre
//                     style={{
//                       whiteSpace: "pre-wrap",
//                       wordBreak: "break-word",
//                       background: "#f6f6f7",
//                       padding: "1rem",
//                       borderRadius: "6px",
//                       fontFamily: "monospace",
//                       overflow: "scroll",
//                       maxHeight: "550px",
//                       height: "100%",
//                       scrollbarWidth: "thin",
//                     }}
//                   >
//                     {(generatedSection || "")
//                       .replace("```liquid", "")
//                       .replace("```", "") || selectedResponse}
//                   </pre>
//                 </Card>
//               </BlockStack>
//             </Layout.Section>
//           </Layout>
//         </Layout.Section>
//       </Layout>

//       <Modal
//         open={openSaveModal}
//         onClose={() => setOpenSaveModal(false)}
//         title="Save Generated Section"
//         primaryAction={{
//           content: "Save",
//           onAction: () => saveMutation.mutate(),
//           loading: saveMutation.isLoading,
//           disabled: saveMutation.isLoading || !savingName.trim(),
//         }}
//       >
//         <Modal.Section>
//           <TextField
//             label="Section Name"
//             value={savingName}
//             onChange={setSavingName}
//             disabled={saveMutation.isLoading}
//           />

//           <Text variant="headingSm" as="h6">
//             Theme List
//           </Text>

//           {themeList?.map((theme) => (
//             <Box key={theme.id}>
//               <RadioButton
//                 key={theme.id}
//                 label={
//                   <span
//                     className="Polaris-Text--root Polaris-Text--bodyMd"
//                     style={{
//                       display: "inline-block",
//                       paddingTop: "0.3rem",
//                       maxWidth: "200px",
//                       whiteSpace: "normal",
//                       wordWrap: "break-word",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                     }}
//                   >
//                     {theme.name}{" "}
//                     {theme.role === "main" && (
//                       <Badge variant="headingSm" tone="success">
//                         Live
//                       </Badge>
//                     )}
//                   </span>
//                 }
//                 checked={selectedTheme === theme.id}
//                 id={theme.id}
//                 name="theme"
//                 onChange={() => handleSelectChange(theme.id)}
//               />
//             </Box>
//           ))}
//         </Modal.Section>
//       </Modal>

//       {showPreviewModal && (
//         <Modal
//           open={showPreviewModal}
//           onClose={() => setShowPreviewModal(false)}
//           title="Generated Section Preview"
//         >
//           <Modal.Section>
//             <div
//               style={{
//                 padding: "20px",
//                 backgroundColor: "white",
//                 maxWidth: "800px",
//                 margin: "0 auto",
//               }}
//             >
//               {previewHtml ? (
//                 <div
//                   dangerouslySetInnerHTML={{ __html: previewHtml }}
//                   style={{
//                     border: "1px solid #ddd",
//                     borderRadius: "8px",
//                     padding: "20px",
//                     backgroundColor: "white",
//                   }}
//                 />
//               ) : (
//                 <div
//                   style={{
//                     whiteSpace: "pre-wrap",
//                     wordBreak: "break-word",
//                     background: "#f6f6f7",
//                     padding: "1rem",
//                     borderRadius: "6px",
//                     fontFamily: "monospace",
//                     overflow: "scroll",
//                     maxHeight: "550px",
//                     height: "100%",
//                     scrollbarWidth: "thin",
//                   }}
//                 >
//                   {generatedSection}
//                 </div>
//               )}
//             </div>
//           </Modal.Section>
//         </Modal>
//       )}
//     </Page>
//   );
// }
