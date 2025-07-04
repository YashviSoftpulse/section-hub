import React from "react";
import { IndexTable, Text, Card, LegacyStack } from "@shopify/polaris";

const CreditTracker = () => {
  const entries = [
    { date: "2025-06-01", description: "Hero Banner", used: 2 },
    { date: "2025-06-02", description: "Testimonial Slider", used: 3 },
  ];

  const totalCredits = 50;
  const creditsUsed = entries.reduce((sum, entry) => sum + entry.used, 0);
  const remainingCredits = totalCredits - creditsUsed;

  const resourceName = {
    singular: "credit entry",
    plural: "credit entries",
  };

  const rowMarkup = entries.map(({ date, description, used }, index) => (
    <IndexTable.Row id={index.toString()} key={index} position={index}>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {date}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {description}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {used}
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Card>
      <LegacyStack vertical spacing="extraTight">
        <Text variant="bodyMd">
          <strong>Total Credits:</strong> {totalCredits}
        </Text>
        <Text variant="bodyMd">
          <strong>Credits Used:</strong> {creditsUsed}
        </Text>
        <Text variant="bodyMd">
          <strong>Remaining Credits:</strong> {remainingCredits}
        </Text>
      </LegacyStack>
      <IndexTable
        resourceName={resourceName}
        itemCount={entries.length}
        selectable={false}
        headings={[
          { title: "Date" },
          { title: "Description" },
          { title: "Credits Used" },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  );
};

export default CreditTracker;
