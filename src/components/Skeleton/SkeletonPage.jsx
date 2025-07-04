/* IMPORT REQUIRED MODULES START */
import {
  SkeletonBodyText,
  TextContainer,
  SkeletonDisplayText,
  Card,
  SkeletonThumbnail,
  Grid,
  BlockStack,
  Button,
  InlineStack,
} from "@shopify/polaris";
import React from "react";
/* IMPORT REQUIRED MODULES END */

/* SKELETON PAGE FUNCTIONAL COMPONENT START */
export default function Skeleton_Page() {
  return (
    <BlockStack gap={200}>
      <Grid
        columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}
        // style={{
        //   display: "flex",
        //   flexWrap: "wrap",
        // }}
      >
        <Card>
          <TextContainer>
            <SkeletonDisplayText size="large" />
            <SkeletonThumbnail size="large" />
            <SkeletonBodyText lines={2} />
          </TextContainer>
        </Card>
        <Card>
          <TextContainer>
            <SkeletonDisplayText size="large" />
            <SkeletonThumbnail size="large" />
            <SkeletonBodyText lines={2} />
          </TextContainer>
        </Card>
        <Card>
          <TextContainer>
            <SkeletonDisplayText size="large" />
            <SkeletonThumbnail size="large" />
            <SkeletonBodyText lines={2} />
          </TextContainer>
        </Card>
        <Card>
          <TextContainer>
            <SkeletonDisplayText size="large" />
            <SkeletonThumbnail size="large" />
            <SkeletonBodyText lines={2} />
          </TextContainer>
        </Card>
        <Card>
          <TextContainer>
            <SkeletonDisplayText size="large" />
            <SkeletonThumbnail size="large" />
            <SkeletonBodyText lines={2} />
          </TextContainer>
        </Card>
        <Card>
          <TextContainer>
            <SkeletonDisplayText size="large" />
            <SkeletonThumbnail size="large" />
            <SkeletonBodyText lines={2} />
          </TextContainer>
        </Card>
        <Card>
          <TextContainer>
            <SkeletonDisplayText size="large" />
            <SkeletonThumbnail size="large" />
            <SkeletonBodyText lines={2} />
          </TextContainer>
        </Card>
        <Card>
          <TextContainer>
            <SkeletonDisplayText size="large" />
            <SkeletonThumbnail size="large" />
            <SkeletonBodyText lines={2} />
          </TextContainer>
        </Card>
        <Card>
          <TextContainer>
            <SkeletonDisplayText size="large" />
            <SkeletonThumbnail size="large" />
            <SkeletonBodyText lines={2} />
          </TextContainer>
        </Card>
      </Grid>
    </BlockStack>
  );
}
/* SKELETON PAGE FUNCTIONAL COMPONENT END */
