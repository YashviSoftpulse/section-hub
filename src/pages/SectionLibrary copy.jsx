import React, { useState, useCallback } from "react";
import moment from "moment";
import { 
  Page,
  Layout,
  Card,
  TextField,
  Button,
  Banner,
  Divider,
  InlineStack,
  BlockStack,
  Text,
  Tooltip,
  Icon,
  Modal
} from "@shopify/polaris";
import { ClipboardMajor, CheckMinor } from "@shopify/polaris-icons";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Toast } from "@shopify/app-bridge/actions";

export default function GenerateWithAI() {
  const app = useAppBridge();
  const queryClient = useQueryClient();

  // helper to fire an App Bridge toast
  const showToast = useCallback((message, isError = false) => {
    const toast = Toast.create(app, {
      message,
      duration: 2000,
      isError,
    });
    toast.dispatch(Toast.Action.SHOW);
  }, [app]);

  const [query, setQuery] = useState("");
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [savingName, setSavingName] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [banner, setBanner] = useState(true);
  const [localHistory, setLocalHistory] = useState([]);
  const today = moment().format("YYYY-MM-DD");

  const groupedByDate = localHistory.reduce((acc, item) => {
    const date = moment(item.createdAt).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    if (acc[date].length < 4) acc[date].push(item);
    return acc;
  }, {});
  const todayRequestCount = groupedByDate[today]?.length || 0;
  const dailyLimitReached = todayRequestCount >= 4;

  // Fetch history
  const { data: history = [] } = useQuery({
    queryKey: ["history"],
    queryFn: () => fetch(`/api/history`).then((r) => {
      if (!r.ok) throw new Error("Failed to fetch history");
      return r.json();
    }),
    onSuccess: setLocalHistory,
  });

  // Generate AI section
  const {
    refetch: generateSection,
    isFetching: isGenerating,
  } = useQuery({
    queryKey: ["generate-section", query],
    enabled: false,
    retry: false,
    queryFn: async () => {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer sk-or-v1-…",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-3n-e4b-it:free",
          messages: [{ role: "user", content: finalPrompt }],
        }),
      });
      if (!res.ok) throw new Error("Failed to generate section");
      const d = await res.json();
      return d.choices[0].message.content;
    },
    onSuccess: (data) => {
      const newItem = {
        id: String(Date.now()),
        prompt: query,
        response: data,
        createdAt: today,
      };
      setLocalHistory((prev) => [newItem, ...prev]);
      setSelectedPrompt(newItem);
      setSelectedResponse(data);
      queryClient.invalidateQueries("history");
      showToast("Section generated successfully.");
    },
    onError: (err) => {
      showToast(err.message || "Error generating section", true);
    },
  });

  // Save section mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!savingName.trim()) {
        throw new Error("Please enter a section name");
      }
      const res = await fetch("/api/save-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query.trim(),
          response: selectedResponse,
          name: savingName.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to save section");
    },
    onSuccess: () => {
      setOpenSaveModal(false);
      setSavingName("");
      queryClient.invalidateQueries("history");
      showToast("Section Added Successfully.");
    },
    onError: (err) => {
      showToast(err.message || "Error saving section", true);
    },
  });

  // Copy code handler
  const [copying, setCopying] = useState(false);
  const copyCode = async () => {
    if (!selectedResponse) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(selectedResponse);
      showToast("Code copied to clipboard");
    } catch {
      showToast("Failed to copy code", true);
    } finally {
      setCopying(false);
    }
  };

  const handleGenerate = () => {
    if (query.trim() && !dailyLimitReached) {
      generateSection();
    }
  };

  return (
    <Page
      title="Generate with AI"
      primaryAction={{
        content: "Save",
        onAction: () => setOpenSaveModal(true),
        loading: saveMutation.isLoading,
        disabled: !selectedResponse,
      }}
    >
      <Layout>
        <Layout.Section>
          {banner && (
            <Banner
              tone="info"
              onDismiss={() => setBanner(false)}
            >
              <strong>Note:</strong> Enjoy up to 4 prompt creations per
              day—check back tomorrow for more!
            </Banner>
          )}
        </Layout.Section>

        <Layout.Section>
          <Layout>
            <Layout.Section variant="oneThird">
              <Card title="History (4/day limit)">
                <BlockStack gap="200">
                  <InlineStack
                    align="space-between"
                    onClick={() => {
                      setSelectedPrompt(null);
                      setSelectedResponse(null);
                      setQuery("");
                    }}
                  >
                    <Button variant="tertiary" fullWidth>
                      New Generate
                    </Button>
                  </InlineStack>
                  <Divider />
                  <BlockStack gap="300">
                    <Text variant="headingMd">History</Text>
                    {Object.entries(groupedByDate).map(
                      ([date, prompts], idx, arr) => (
                        <BlockStack key={date} gap="200">
                          <Text as="h6" variant="headingXs">
                            {moment(date).calendar(null, {
                              sameDay: "[Today]",
                              lastDay: "[Yesterday]",
                              sameElse: "MMMM Do, YYYY",
                            })}
                          </Text>

                          {prompts.map((item) => (
                            <InlineStack
                              key={item.id}
                              align="space-between"
                            >
                              <Button
                                plain
                                fullWidth
                                onClick={() => {
                                  setSelectedPrompt(item);
                                  setSelectedResponse(item.response);
                                  setQuery(item.prompt);
                                }}
                              >
                                {item.prompt}
                              </Button>
                              {selectedPrompt?.id === item.id && (
                                <Icon source={CheckMinor} />
                              )}
                            </InlineStack>
                          ))}

                          {idx < arr.length - 1 && <Divider />}
                        </BlockStack>
                      )
                    )}
                  </BlockStack>
                </BlockStack>
              </Card>
            </Layout.Section>

            <Layout.Section>
              <BlockStack gap="400">
                <Card sectioned>
                  <TextField
                    label="Describe the section you want to generate"
                    value={query}
                    onChange={setQuery}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleGenerate()
                    }
                    connectedRight={
                      <Button
                        primary
                        loading={isGenerating}
                        onClick={handleGenerate}
                        disabled={!query.trim() || dailyLimitReached}
                      >
                        {selectedResponse ? "Regenerate" : "Generate"}
                      </Button>
                    }
                  />
                  {dailyLimitReached && (
                    <Banner status="critical" title="Daily limit reached">
                      You've used all 4 generation requests for today.
                    </Banner>
                  )}
                </Card>

                <Card title="Generated Code" sectioned>
                  <InlineStack align="space-between">
                    <Text variant="headingMd">Code</Text>
                    <Tooltip content="Copy code">
                      <Button
                        icon={copying ? undefined : ClipboardMajor}
                        loading={copying}
                        onClick={copyCode}
                      />
                    </Tooltip>
                  </InlineStack>
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      background: "#f6f6f7",
                      padding: "1rem",
                      borderRadius: "6px",
                      fontFamily: "monospace",
                      maxHeight: "550px",
                      overflow: "auto",
                    }}
                  >
                    {selectedResponse || "// Your generated code will appear here"}
                  </pre>
                </Card>
              </BlockStack>
            </Layout.Section>
          </Layout>
        </Layout.Section>

        <Modal
          open={openSaveModal}
          onClose={() => setOpenSaveModal(false)}
          title="Save Generated Section"
          primaryAction={{
            content: "Save",
            onAction: () => saveMutation.mutate(),
            loading: saveMutation.isLoading,
            disabled: !savingName.trim(),
          }}
        >
          <Modal.Section>
            <TextField
              label="Section Name"
              value={savingName}
              onChange={setSavingName}
              autoComplete="off"
            />
          </Modal.Section>
        </Modal>
      </Layout>
    </Page>
  );
}
