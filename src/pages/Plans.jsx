import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  InlineStack,
  Button,
  List,
  Divider,
  Badge,
  Grid,
  SkeletonTabs,
  SkeletonBodyText,
  Box,
} from "@shopify/polaris";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchData, getApiURL } from "../action";
import { useApiData } from "../components/ApiDataProvider";

function Plan() {
  const { planCheck } = useApiData();
  const urlParams = new URLSearchParams(window.location.search);
  const SHOP = urlParams.get("shop");

  const { data: planListing, isPending: isApicalling } = useQuery({
    queryKey: ["planListing"],
    queryFn: async () => {
      const formdata = new FormData();
      formdata.append("shop", SHOP);
      const response = await fetchData(getApiURL("/plan-list"), formdata);
      if (response.status === true) return await response;
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  const { mutate: selectPlan, isPending: isSelectingPlan } = useMutation({
    mutationFn: async (planIndex) => {
      const formData = new FormData();
      formData.append("shop", SHOP);
      formData.append("plan_index", btoa(planIndex.toString()));
      return fetchData(getApiURL("/pricing"), formData);
    },
    onSuccess: (response) => {
      if (response.status === true) {
        if (response.confirmation_url) {
          window.open(response.confirmation_url, "_blank");
        } else {
          shopify.toast.show(response.message, { duration: 3000 });
          window.location.href = `/dashboard${window.location.search}`;
        }
      } else {
        shopify.toast.show(response.message || "An error occurred.", {
          isError: true,
        });
      }
    },
    onError: (error) => {
      shopify.toast.show(error.message, { isError: true });
    },
  });

  return (
    <Page title="Plans & Pricing">
      <Layout>
        <Layout.Section></Layout.Section>
        <Layout.Section>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Text variant="headingXl" as="h1">
              Choose your plan
            </Text>
            <Text variant="bodyLg" as="p">
              Select a plan to get started and upgrade anytime
            </Text>
          </div>
        </Layout.Section>
        <div className="Polaris-Layout__Section plan-card">
          {isApicalling ? (
            <Grid>
              {[1, 2, 3].map((item) => (
                <Grid.Cell
                  key={item}
                  columnSpan={{ xs: 3, sm: 2, md: 2, lg: 4, xl: 4 }}
                >
                  <Card>
                    <BlockStack gap="400">
                      <SkeletonTabs count={2} />
                      <SkeletonTabs count={1} />
                      <SkeletonBodyText lines={2} />
                      <Divider />
                      <SkeletonBodyText lines={3} />
                      <SkeletonBodyText lines={3} />
                    </BlockStack>
                  </Card>
                </Grid.Cell>
              ))}
            </Grid>
          ) : (
            Object.entries(planListing.plans || {}).map(
              ([key, plan], origIndex) => {
                const activePlanName = planCheck?.plan_details?.name;
                const currentPlanName = plan?.name;
                const isActive = activePlanName === currentPlanName;
                const planKey = plan.name.toLowerCase();

                let buttonLabel = "";
                const currentPlan =
                  planCheck?.plan_details?.name?.toLowerCase();

                if (currentPlan === "free" && planKey === "basic")
                  buttonLabel = "Upgrade To Basic";
                else if (currentPlan === "free" && planKey === "premium")
                  buttonLabel = "Upgrade To Premium";
                else if (currentPlan === "basic" && planKey === "premium")
                  buttonLabel = "Upgrade To Premium";
                else if (currentPlan === "basic" && planKey === "free")
                  buttonLabel = "Downgrade To Free";
                else if (currentPlan === "premium" && planKey === "basic")
                  buttonLabel = "Downgrade To Basic";
                else if (currentPlan === "premium" && planKey === "free")
                  buttonLabel = "Downgrade To Free";

                return (
                  <Card>
                    <BlockStack gap="300">
                      <InlineStack align="space-between">
                        <InlineStack gap={200}>
                          <Text variant="bodyLg" as="p">
                            {plan.name} Plan
                          </Text>
                        </InlineStack>
                        {planCheck?.plan_details?.name ===
                          plan.name.charAt(0).toUpperCase() +
                            plan.name.slice(1).toLowerCase() && (
                          <Badge tone="success">Active</Badge>
                        )}
                      </InlineStack>
                      <InlineStack gap={100}>
                        <Text variant="headingLg">
                          {plan.price === 0 ? "Free" : `$${plan.price}`}
                        </Text>
                        {key === "basic" && <Text> /month</Text>}
                        {key === "premium" && <Text> /month</Text>}
                      </InlineStack>

                      <Divider />
                      <BlockStack gap={500}>
                        <List>
                          {Object.entries(plan?.content || {})?.map(
                            ([index, content]) => {
                              return (
                                <List.Item key={index}>{content}</List.Item>
                              );
                            }
                          )}
                        </List>
                        {console.log("origIndex", origIndex)}

                        {!isActive && (
                          <Button
                            variant="primary"
                            onClick={() => selectPlan(origIndex)}
                          >
                            {buttonLabel}
                          </Button>
                        )}
                      </BlockStack>
                    </BlockStack>
                  </Card>
                );
              }
            )
          )}
        </div>
      </Layout>
    </Page>
  );
}

export default Plan;
