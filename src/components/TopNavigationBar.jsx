/* IMPORT REQUIRED MODULES START */
import React from "react";
import { Tabs } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
/* IMPORT REQUIRED MODULES END */

const tabs_ = ["library", "sections"];

const tabs = [
  {
    id: "library",
    content: "Library",
    accessibilityLabel: "Library",
    panelID: "library",
  },
  {
    id: "sections",
    content: "Sections",
    accessibilityLabel: "Sections",
    panelID: "sections",
  },
  {
    id: "help",
    content: "Help",
    accessibilityLabel: "Help",
    panelID: "help",
  },
];
export default () => {
  const location = useLocation();
  const { tab } = useParams();
  const [selected, setSelected] = useState(
    tabs_.indexOf(location.pathname.split("/").pop())
  );
  const navigate = useNavigate();
  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
    if (selectedTabIndex === 0) {
      navigate({
        pathname: "/library",
        search: window.location.search,
      });
    } else if (selectedTabIndex === 1) {
      navigate({ pathname: "/sections", search: window.location.search });
    } else if (selectedTabIndex === 2) {
      navigate({ pathname: "/help", search: window.location.search });
    } else {
    }
  }, []);
  return <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />;
};
