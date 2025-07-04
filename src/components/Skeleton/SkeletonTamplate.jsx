import {
  Card,
  EmptyState,
  Grid,
  Page,
  SkeletonBodyText,
  SkeletonPage,
  TextContainer,
} from "@shopify/polaris";
import React from "react";

function SkeletonTamplate() {
  return (
    <SkeletonPage fullWidth>
      <Grid columns={{ sm: 3 }}>
        <div className="Polaris-Grid-Cell Polaris-Grid-Cell--cell_6ColumnXs Polaris-Grid-Cell--cell_4ColumnSm Polaris-Grid-Cell--cell_1ColumnMd Polaris-Grid-Cell--cell_3ColumnLg Polaris-Grid-Cell--cell_3ColumnXl ">
          <Card>
            <TextContainer>
              <SkeletonBodyText lines={2} />
              <SkeletonBodyText lines={2} />
              <SkeletonBodyText lines={2} />
              <SkeletonBodyText lines={2} />
              <SkeletonBodyText lines={2} />
              <SkeletonBodyText lines={2} />
              <SkeletonBodyText lines={2} />
              <SkeletonBodyText lines={2} />
            </TextContainer>
          </Card>
        </div>
        <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 2, lg: 9, xl: 9 }}>
          <Card>
            <EmptyState />
          </Card>
        </Grid.Cell>
      </Grid>
    </SkeletonPage>
  );
}

export default SkeletonTamplate;
