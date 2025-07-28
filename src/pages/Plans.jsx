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
} from "@shopify/polaris";
import React from "react";

function Plan() {
  return (
    <Page  title="Plans & Pricing">
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

        <Layout.Section>
          <InlineStack gap="400" align="center" wrap={false}>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">
                  Free Plan
                </Text>
                <Text variant="headingXl" as="h2">
                  $0
                  <Text variant="bodyMd" as="span" tone="subdued">
                    {" "}
                    / month
                  </Text>
                </Text>
                <Divider />
                <List>
                  <List.Item>30 Live Sections (Lifetime Access)</List.Item>
                  <List.Item>1 Page Template</List.Item>
                  <List.Item>No Customization</List.Item>
                  <List.Item>No Custom Section</List.Item>
                  <List.Item>Email Support</List.Item>
                </List>
                <Button fullWidth size="large">
                  Choose Plan
                </Button>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">
                  Basic Plan
                </Text>
                <Text variant="headingXl" as="h2">
                  $9
                  <Text variant="bodyMd" as="span" tone="subdued">
                    {" "}
                    / month
                  </Text>
                </Text>
                <Divider />
                <List>
                  <List.Item>All Features in Free +</List.Item>
                  <List.Item>Access to 100+ Pre-made Sections</List.Item>
                  <List.Item>5 Customization Requests</List.Item>
                  <List.Item>5 Page Templates</List.Item>
                  <List.Item>1 Custom Section (made just for you)</List.Item>
                  <List.Item>Email & Chat Support</List.Item>
                </List>
                <Button variant="primary" fullWidth size="large">
                  Choose Plan
                </Button>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">
                  Premium Plan
                </Text>
                <Text variant="headingXl" as="h2">
                  $15
                  <Text variant="bodyMd" as="span" tone="subdued">
                    / month
                  </Text>
                </Text>
                <Divider />
                <List>
                  <List.Item>All Features in Basic +</List.Item>
                  <List.Item>Unlimited Customization Requests</List.Item>
                  <List.Item>Unlimited Page Templates</List.Item>
                  <List.Item>5 Custom Section (made just for you)</List.Item>
                  <List.Item>Priority Support</List.Item>
                </List>
                <Button fullWidth size="large">
                  Choose Plan
                </Button>
              </BlockStack>
            </Card>
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Plan;
