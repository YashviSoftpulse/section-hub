import React, { useState } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  Bleed,
  IndexTable,
  Thumbnail,
  EmptyState,
  Button,
  Divider,
} from "@shopify/polaris";
import moment from "moment";
import { useIndexResourceState } from "@shopify/polaris";
import { fetchJsonData, getApiURL } from "../action";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { EditIcon } from "@shopify/polaris-icons";

const AIBuilder = () => {
  const navigate = useNavigate();
  const resourceName = { singular: "entry", plural: "entries" };
  const sectionResourceName = { singular: "section", plural: "sections" };
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sort] = useState("desc");
  const [creditsPage, setCreditsPage] = useState(1); // for Credit Usage
  const [aiLibraryPage, setAiLibraryPage] = useState(1);

  const {
    data: usedCreditsData,
    isLoading: isUsedCreditsLoading,
    isError: isUsedCreditsError,
  } = useQuery({
    queryKey: ["usedCredits", page, limit, sort],
    queryFn: async () => {
      const formData = new FormData();
      formData.append("limit", limit.toString());
      formData.append("page", page.toString());
      formData.append("sort", sort);

      const res = await fetchJsonData(getApiURL("/get-used-credits"), formData);
      return res.json();
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  const creditUsageRows = usedCreditsData?.data || [];
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(creditUsageRows);

  const {
    data: aiLibraryData,
    isLoading: isAiLibraryLoading,
    isError: isAiLibraryError,
  } = useQuery({
    queryKey: ["ai-library"],
    queryFn: async () => {
      const res = await fetchJsonData(getApiURL("/ai-library"));
      return res.json();
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  const totalAiLibraryPages = Math.ceil(
    (aiLibraryData?.data?.length || 0) / limit
  );

  const paginatedAiLibraryItems =
    aiLibraryData?.data?.slice(
      (aiLibraryPage - 1) * limit,
      aiLibraryPage * limit
    ) || [];

  const {
    selectedResources: sectionSelectedResources,
    allResourcesSelected: sectionAllResourcesSelected,
    handleSelectionChange: handleSectionSelectionChange,
  } = useIndexResourceState(paginatedAiLibraryItems);

  return (
    <Page
      title="AI Section Builder"
      primaryAction={{
        content: "Generate with AI",
        onAction: () =>
          navigate({ href: `/ai-builder/generate${window.location.search}` }),
      }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="300">
            <Text variant="headingMd" as="h2">
              Your Generated AI Sections
            </Text>
            <Card>
              <Bleed marginInline="400" marginBlock={400}>
                <IndexTable
                  resourceName={sectionResourceName}
                  itemCount={paginatedAiLibraryItems.length || 0}
                  selectedItemsCount={
                    sectionAllResourcesSelected
                      ? "All"
                      : sectionSelectedResources.length
                  }
                  onSelectionChange={handleSectionSelectionChange}
                  headings={[
                    { title: "Image" },
                    { title: "Name" },
                    { title: "Created At" },
                    { title: "Action" },
                  ]}
                  selectable={false}
                  loading={isAiLibraryLoading}
                  pagination={{
                    hasPrevious: aiLibraryPage > 1,
                    onPrevious: () =>  setAiLibraryPage((prev) => Math.max(prev - 1, 1)),
                    hasNext: aiLibraryPage < totalAiLibraryPages,
                    onNext: () => setAiLibraryPage((prev) => prev + 1),
                  }}
                  emptyState={
                    paginatedAiLibraryItems.length === 0 && (
                      <EmptyState
                        heading="AI Sections Not Yet Published"
                        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                      >
                        <p>
                          There’s nothing live in your theme yet. Use the AI
                          builder to create and publish your first section.
                        </p>
                        {/* <Button
                        onClick={() =>
                          navigate({
                            href: `/ai-builder/generate${window.location.search}`,
                          })
                        }
                      >
                        Generate with AI
                      </Button> */}
                      </EmptyState>
                    )
                  }
                >
                  {paginatedAiLibraryItems.map(
                    ({ file_name, theme_name, created_at, edit }, index) => (
                      <IndexTable.Row
                        id={index}
                        key={index}
                        selected={sectionSelectedResources.includes(index)}
                        position={index}
                      >
                        <IndexTable.Cell>
                          <Text variant="bodyMd" as="p">
                            {file_name}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Text variant="bodyMd" as="p">
                            {theme_name}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          {created_at
                            ? moment(created_at).format("D MMM YYYY")
                            : "N/A"}
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Button
                            icon={EditIcon}
                            onClick={() => window.open(edit)}
                          ></Button>
                        </IndexTable.Cell>
                      </IndexTable.Row>
                    )
                  )}
                </IndexTable>
              </Bleed>{" "}
            </Card>
          </BlockStack>
        </Layout.Section>
        <Layout.Section>
          <BlockStack gap="300">
            <Text variant="headingMd">Credit Usage</Text>
            <Card>
              <Bleed marginInline="400" marginBlock={400}>
                <IndexTable
                  resourceName={resourceName}
                  itemCount={creditUsageRows.length}
                  selectedItemsCount={
                    allResourcesSelected ? "All" : selectedResources.length
                  }
                  onSelectionChange={handleSelectionChange}
                  headings={[
                    { title: "Sections" },
                    { title: "Credit Used" },
                    { title: "Created At" },
                  ]}
                  selectable={false}
                  isLoading={isUsedCreditsLoading}
                  pagination={{
                    hasPrevious: creditsPage > 1,
                    onPrevious: () =>
                      setCreditsPage((prev) => Math.max(prev - 1, 1)),
                    hasNext:
                      creditsPage < (usedCreditsData?.meta?.total_pages || 1),
                    onNext: () => setCreditsPage((prev) => prev + 1),
                  }}
                >
                  {creditUsageRows.map(
                    ({ id, file_name, credits_used, date }, index) => (
                      <IndexTable.Row
                        id={id}
                        key={id}
                        selected={selectedResources.includes(id)}
                        position={index}
                      >
                        <IndexTable.Cell>
                          <BlockStack gap="100">
                            {file_name.split(",").map((file, idx, arr) => (
                              <>
                                <Text variant="bodyMd" as="p" key={idx}>
                                  {file.trim()}
                                </Text>
                              </>
                            ))}
                          </BlockStack>
                        </IndexTable.Cell>
                        <IndexTable.Cell>{credits_used}</IndexTable.Cell>
                        <IndexTable.Cell>
                          {moment(date).format("D MMM YYYY")}
                        </IndexTable.Cell>
                      </IndexTable.Row>
                    )
                  )}
                </IndexTable>
              </Bleed>
            </Card>
          </BlockStack>
        </Layout.Section>

        <Layout.Section></Layout.Section>
        <Layout.Section></Layout.Section>
      </Layout>
    </Page>
  );
};

export default AIBuilder;
