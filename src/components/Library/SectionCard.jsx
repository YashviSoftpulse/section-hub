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
import { useApiData } from "../ApiDataProvider";
import { useNavigate } from "@tanstack/react-router";

function SectionCard({ section, handleViewIconClick, handlePublishClick }) {
  const { planCheck } = useApiData();
  const navigate = useNavigate();
  const currentUserPlan = planCheck?.plan_details?.name.toLowerCase();
  const requiredSectionPlan = section?.plan;
  const showPaidBadge =
    (planCheck?.version === "2" &&
      currentUserPlan === "free" &&
      (requiredSectionPlan === "basic" || requiredSectionPlan === "premium")) ||
    (currentUserPlan === "basic" && requiredSectionPlan === "premium");

  return (
    <Card key={section.id}>
      <InlineStack align="end">
        {showPaidBadge && (
          <Badge size="small" tone="attention">
            Paid
          </Badge>
        )}
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
        <Text variant="headingSm">{section?.name}</Text>
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
              onClick={() =>
                showPaidBadge
                  ? navigate({ href: `/plans${window.location.search}` })
                  : handlePublishClick(section)
              }
              size="medium"
              variant="secondary"
            >
              {showPaidBadge ? (
                <InlineStack gap={150}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 6L7 12L12 6L17 12L21 6V20H3V6Z"
                      fill="#FFD700"
                      stroke="#FFD700"
                      strokeWidth="2"
                    />
                  </svg>
                  <Text variant="bodySm" fontWeight="medium">
                    Upgrade Plan
                  </Text>
                </InlineStack>
              ) : (
                " Add Section"
              )}
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
