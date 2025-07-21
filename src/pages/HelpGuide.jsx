import {
  BlockStack,
  Box,
  Button,
  Card,
  Collapsible,
  InlineGrid,
  InlineStack,
  Layout,
  MediaCard,
  Modal,
  Page,
  Text,
  VideoThumbnail,
} from "@shopify/polaris";
import React, { useState } from "react";
import { CaretDownIcon, CaretUpIcon } from "@shopify/polaris-icons";
import { useNavigate } from "@tanstack/react-router";

function Help() {
  const [openSteps, setOpenSteps] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const SHOP = urlParams.get("shop");
  const params = {};
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  const navigate = useNavigate();
  return (
    <Page title="Help Guide">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap={400}>
              <InlineStack align="space-between">
                <Text variant="headingMd" as="h6">
                  Quick Guide
                </Text>
              </InlineStack>
              <InlineGrid gap={400} columns={2}>
                <Card padding={0}>
                  <BlockStack gap={400}>
                    <div className="dashboard-video">
                      <VideoThumbnail
                        videoLength={142}
                        thumbnailUrl={'https://cdn.shopify.com/s/files/1/0896/6049/0015/files/Section_Banner.png?v=1751365256'}
                        onClick={() =>
                          window.open("https://youtu.be/eJC9415VtC4")
                        }
                      />
                    </div>
                    <InlineStack align="space-between">
                      <Box paddingInline={400}>
                        <Text variant="headingMd" as="h6">
                          Steps: How to Add Sections
                        </Text>
                      </Box>
                      <Box paddingInline={400}>
                        <Button
                          variant="plain"
                          onClick={() => setOpenSteps((prev) => !prev)}
                          icon={openSteps ? CaretUpIcon : CaretDownIcon}
                        />
                      </Box>
                    </InlineStack>
                  </BlockStack>
                  <Collapsible
                    open={openSteps}
                    id="basic-collapsible"
                    transition={{
                      duration: "500ms",
                      timingFunction: "ease-in-out",
                    }}
                    expandOnPrint
                  >
                    <Box paddingInline={400}>
                      <ol>
                        <BlockStack gap={100}>
                          <li>
                            Browse our <strong>"Section Library"</strong>
                          </li>
                          <li>
                            Find a suitable section and check its preview.
                          </li>
                          <li>
                            Click <strong>"Add Section"</strong> and select your
                            theme.
                          </li>
                          <li>
                            Click <strong>"Add to Theme"</strong> to complete
                            the process.
                          </li>
                        </BlockStack>
                      </ol>
                    </Box>
                    <Box padding={400}>
                      <Button
                        variant="primary"
                        onClick={() =>
                          navigate({
                            href: `/sectionLibrary?${new URLSearchParams(
                              params
                            )}`,
                          })
                        }
                      >
                        View Sections
                      </Button>
                    </Box>
                  </Collapsible>
                  {openSteps === false && <Box padding={200}></Box>}
                </Card>
                <Card padding={0}>
                  <BlockStack gap={400}>
                    <div className="dashboard-video">
                      <VideoThumbnail
                        videoLength={100}
                        thumbnailUrl={'https://cdn.shopify.com/s/files/1/0896/6049/0015/files/pages-banner.png?v=1751365344'}
                        onClick={() =>
                          window.open("https://youtu.be/Dc6bdN4Mbpw")
                        }
                      />
                    </div>
                    <InlineStack align="space-between">
                      <Box paddingInline={400}>
                        <Text variant="headingMd" as="h6">
                          Steps: How to Create Pages
                        </Text>
                      </Box>
                      <Box paddingInline={400}>
                        <Button
                          variant="plain"
                          onClick={() => setOpenSteps((prev) => !prev)}
                          icon={openSteps ? CaretUpIcon : CaretDownIcon}
                        />
                      </Box>
                    </InlineStack>
                  </BlockStack>
                  <Collapsible
                    open={openSteps}
                    id="basic-collapsible"
                    transition={{
                      duration: "500ms",
                      timingFunction: "ease-in-out",
                    }}
                    expandOnPrint
                  >
                    <Box paddingInline={400}>
                      <ol>
                        <BlockStack gap={100}>
                          <li>
                            Browse our <strong>"Page Builder"</strong>
                          </li>
                          <li>
                            Click <strong>Create New Page</strong> and define a
                            page name.
                          </li>
                          <li>
                            Browse our <strong>Sections</strong> and add
                            sections to your page.
                          </li>
                          <li>
                            Click <strong>Save</strong> to publish your page to
                            your theme.
                          </li>
                        </BlockStack>
                      </ol>
                    </Box>
                    <Box padding={400}>
                      <Button
                        variant="primary"
                        onClick={() =>
                          navigate({
                            href: `/page-builder?${new URLSearchParams(params)}`,
                          })
                        }
                      >
                        View Pages
                      </Button>
                    </Box>
                  </Collapsible>
                  {openSteps === false && <Box padding={200}></Box>}
                </Card>
              </InlineGrid>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                How can I preview the section?
              </Text>
              <Text>
                To publish of section, Go to the 'Section Library' plugin menu.
                For each section, we have provided a preview option (Eye Icon)
                to see how it looks.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                How do I publish a section?
              </Text>
              <Text>
                To publish a section, go to the 'Section Library' in the plugin
                menu. Find the section you want to publish, click the 'Add
                Section' button on the section card, select the desired theme in
                the popup, and then click 'Add to Theme'.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                How can we customize the content in the section?
              </Text>
              <Text>
                To customize a section's content, go to the plugin dashboard,
                find the section under 'Published Sections' and click the Edit
                icon. This will take you directly to the relevant theme's
                customization page, where you can click 'Add Section'.
                Alternatively, if you remember the theme name, you can open the
                Shopify theme's customization page and click 'Add Section'.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                Is the section mobile and tablet responsive?
              </Text>
              <Text>
                Yes, all sections are fully responsive for both mobile and
                tablet devices.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                Can I add a section to the development theme before implementing
                it on the live site?
              </Text>
              <Text>
                Yes, we provide the option to add a section to any theme in your
                store. You can create a copy of your live theme and add the
                section to this development theme. Once you're satisfied with
                the section's preview, you can publish the development theme to
                live or repeat the process in the live theme.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                Can I use Section Store with any Shopify theme?
              </Text>
              <Text>
                Yes, you can use Section Store with any Shopify theme. Simply
                browse our library, find the section you want, and add it to
                your theme.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                On which page can I use this section?
              </Text>
              <Text>
                You can use this section on the Home page and Pages template.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                How can I find out which Shopify theme the section was added to?
              </Text>
              <Text>
                In the plugin dashboard, we provide a list of sections you've
                published in your theme. The list includes the creation date,
                theme name, and an edit option. Clicking the edit option will
                navigate you to the theme's customization editor.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                Can we add the same section to multiple themes at the same time?
              </Text>
              <Text>No, you need to add each section individually.</Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                How can we remove section files from my Shopify code?
              </Text>
              <Text>
                Locate our section (starting with the 'SH:' prefix) in your
                customize theme and click the delete icon to remove it from your
                theme. If you want to remove code files, open the theme editor,
                locate our section code file (starting with the 'SH-' prefix),
                and delete the code file.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                If I disable a section, will it affect my website’s speed?
              </Text>
              <Text>
                No, if you disable the section from the customize theme then it
                will not load on the website and won't affect the website's
                speed.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                Can I customize the section from your code?
              </Text>
              <Text>
                Yes, if you are a developer or a technical expert, you can
                customize the code of our section.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                Can we migrate a development section to the live theme?
              </Text>
              <Text>
                No, this option is not available. You can either publish the
                development theme or create a new section in the live theme.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                Can we reuse the same section on the same page?
              </Text>
              <Text>
                Yes, you can add the same section multiple times on the same
                page.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={200}>
              <Text variant="headingMd" as="h6">
                I have published added section in the development theme, but
                it’s not visible in the preview?
              </Text>
              <Text>
                Firstly, You have to enable 'SectionHub' from customize theme
                &gt;&gt; "app embed" of development theme. To do this, go to the
                development theme's customization settings, click on the "app
                embed" in the left menu, and toggle 'SectionHub' on. Finally,
                save your changes.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section></Layout.Section>
        <Layout.Section></Layout.Section>
      </Layout>
    </Page>
  );
}

export default Help;
