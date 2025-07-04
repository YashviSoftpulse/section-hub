import {
  Badge,
  BlockStack,
  Button,
  Card,
  InlineStack,
  Text,
  Tooltip,
} from "@shopify/polaris";
import { ViewIcon } from "@shopify/polaris-icons";
import React from "react";

function SectionCard({ section, handleViewIconClick, handlePublishClick }) {
  return (
    <Card key={section.id}>
      <InlineStack align="space-between">
        {section?.plan === "paid" && (
          <Badge size="small" tone="attention">
            {section?.plan}
          </Badge>
        )}
        {/* <Badge size="small" tone="info">
          {section.category}
        </Badge> */}
      </InlineStack>
      <img
        alt=""
        width="100%"
        height="100%"
        className="card-img"
        src={section?.featured_img}
        onClick={() => handleViewIconClick(section)}
      />
      <BlockStack gap={100}>
        <InlineStack distribution="equalSpacing">
          <Text variant="headingSm">{section?.name}</Text>
        </InlineStack>
        <BlockStack gap={400}>
          <Text variant="bodySm" breakWord={true}>
            {section?.description}
          </Text>
          <div
            className="Polaris-InlineStack section-card-buttons"
            style={{
              "--pc-inline-stack-align": "space-between",
              "--pc-inline-stack-wrap": "wrap",
              "--pc-inline-stack-flex-direction-xs": "row",
              alignSelf: "auto !important",
            }}
          >
            <Button
              onClick={() => handlePublishClick(section)}
              size="medium"
              variant="secondary"
            >
              Add Section
            </Button>
            <Tooltip content="Preview" dismissOnMouseOut width="wide">
              <Button
                onClick={() => handleViewIconClick(section)}
                size="medium"
                variant="secondary"
                icon={ViewIcon}
              />
            </Tooltip>
          </div>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

export default SectionCard;
