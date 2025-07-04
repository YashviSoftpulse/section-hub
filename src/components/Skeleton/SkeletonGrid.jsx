/* IMPORT REQUIRED MODULES START */
import {
  SkeletonBodyText,
  TextContainer,
  SkeletonDisplayText,
  Card,
  SkeletonThumbnail,
  Grid,
} from "@shopify/polaris";
import React from "react";
/* IMPORT REQUIRED MODULES END */

/* SKELETON PAGE FUNCTIONAL COMPONENT START */
export default function SkeletonGrid() {
  return (
    <Grid>
      <Grid.Cell>
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
      </Grid.Cell>
    </Grid>
  );
}
/* SKELETON PAGE FUNCTIONAL COMPONENT END */
