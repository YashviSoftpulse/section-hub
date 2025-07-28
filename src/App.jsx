import React from "react";
import { PolarisProvider } from "./components";
import { BrowserRouter } from "react-router-dom";
import { Link } from "@tanstack/react-router";
import { NavMenu } from "@shopify/app-bridge-react";

function App() {
  return (
    <BrowserRouter>
      <PolarisProvider>
        <>
          <NavMenu>
            <Link to={`/dashboard${window.location.search}`} rel="home">
              Dashboard
            </Link>
            <br></br>
            <Link to={`/sectionLibrary${window.location.search}`}>
              Section Library
            </Link>{" "}
            <Link to={`/page-builder${window.location.search}`}>
              Page Builder
            </Link>{" "}
            {/* <Link to={`/ai-builder${window.location.search}`}>AI Section Builder </Link> */}
            <Link to={`/plans${window.location.search}`}>Plans</Link>{" "}
            <Link to={`/helpGuide${window.location.search}`}>Help Guide </Link>
          </NavMenu>
        </>
      </PolarisProvider>
    </BrowserRouter>
  );
}

export default App;
