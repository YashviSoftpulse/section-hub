import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import "@shopify/polaris/build/esm/styles.css";
import "swiper/swiper-bundle.css";
import "swiper/css";
import { AppProvider, Page } from "@shopify/polaris";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  useNavigate,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import en from "@shopify/polaris/locales/en.json";
import { NavMenu } from "@shopify/app-bridge-react";
import { onINP, onLCP } from "web-vitals";
// import { persistor, store } from "./redux/store.js";
// import { PersistGate } from "redux-persist/integration/react";
// import { Provider } from "react-redux";

onLCP(
  (lcp) => {
    console.log(`Web vitals - LCP in seconds:`, lcp.value / 1000);
    console.log(`Web vitals - LCP details:`, lcp.entries);
    if (lcp.value > 2500) {
      console.warn("Poor LCP detected:", lcp.value);
    }
  },
  { reportAllChanges: true }
);

onINP(
  (inp) => {
    console.log(`Web vitals - INP in seconds:`, inp.value / 1000);
    console.log(`Web vitals - INP details:`, inp.entries);
  },
  { reportAllChanges: true }
);

const FastLink = ({ children, to, rel }) => {
  const navigate = useNavigate();
  return (
    <a
      rel={rel || ""}
      href={to}
      onClick={(e) => {
        e.preventDefault();
        navigate({ to, replace: true });
      }}
    >
      {children}
    </a>
  );
};

const rootRoute = createRootRoute({
  component: () => (
    <>
      <NavMenu>
        <FastLink to={`/dashboard${window.location.search}`} rel="home">
          Dashboard
        </FastLink>
        <FastLink to={`/sectionLibrary${window.location.search}`}>
          Section Library{" "}
        </FastLink>
        <FastLink to={`/page-builder${window.location.search}`}>
          Page Builder
        </FastLink>
        {/* <FastLink to={`/ai-builder${window.location.search}`}>
          AI Builder{" "}
        </FastLink> */}
        <FastLink to={`/helpGuide${window.location.search}`}>
          Help Guide{" "}
        </FastLink>
      </NavMenu>
      <Outlet />
    </>
  ),
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/dashboard`,
  component: lazyRouteComponent(() => import("./pages/Dashboard")),
  preload: true,
  pendingComponent: () => (
    <div className="main-page">
      <Page
        subtitle=" Build faster, sell smarter — unlock beautiful sections, craft standout
          pages, and elevate your brand."
        title="Dashboard"
      ></Page>
    </div>
  ),
});

export const sectionLibraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/sectionLibrary`,
  component: lazyRouteComponent(() => import("./pages/SectionLibrary")),
  preload: true,
  pendingComponent: () => (
    <div className="main-page">
      <Page
        subtitle=" Build faster, sell smarter — unlock beautiful sections, craft standout
          pages, and elevate your brand."
        title="Sections Library"
      ></Page>
    </div>
  ),
});

export const pageBuilderRoutes = createRoute({
  getParentRoute: () => rootRoute,
  path: `/page-builder`,
  component: lazyRouteComponent(() => import("./pages/PageBuilder")),
  preload: true,
  pendingComponent: () => (
    <div className="main-page">
      <Page
        subtitle=" Build faster, sell smarter — unlock beautiful sections, craft standout
          pages, and elevate your brand."
        title="Page Builder"
      ></Page>
    </div>
  ),
});

export const helpGuideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/helpGuide`,
  component: lazyRouteComponent(() => import("./pages/HelpGuide")),
});

export const createPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/page-builder/create`,
  component: lazyRouteComponent(() => import("./pages/page-builder/Create")),
  preload: true,
  pendingComponent: () => (
    <div className="main-page">
      <Page
        subtitle=" Build faster, sell smarter — unlock beautiful sections, craft standout
          pages, and elevate your brand."
        title="Untitled"
      ></Page>
    </div>
  ),
});

// export const aiBuilderRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: `/ai-builder`,
//   component: lazyRouteComponent(() => import("./pages/AIBuilder")),
//   preload: true,
//   pendingComponent: () => (
//     <Page
//       subtitle="Build faster, sell smarter — unlock beautiful sections, craft standout pages, and elevate your brand."
//       title="AI Builder"
//     ></Page>
//   ),
// });

// export const aiBuilderGenerateRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: `/ai-builder/generate`,
//   component: lazyRouteComponent(() =>
//     import("./pages/ai-builder/Generate")
//   ),
//   preload: true,
//   pendingComponent: () => (
//     <Page
//       subtitle="Build faster, sell smarter — unlock beautiful sections, craft standout pages, and elevate your brand."
//       title="AI Builder"
//     ></Page>
//   ),
// });

const routeTree = rootRoute.addChildren([
  indexRoute,
  sectionLibraryRoute,
  pageBuilderRoutes,
  helpGuideRoute,
  createPageRoute,
  // aiBuilderRoute,
  // aiBuilderGenerateRoute,
]);

const router = createRouter({ routeTree });
const queryClient = new QueryClient();
const rootElement = document.getElementById("root");

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <AppProvider i18n={en}>
      <QueryClientProvider client={queryClient}>
        {/* <Provider store={store}> */}
          {/* <PersistGate loading={null} persistor={persistor}> */}
            <RouterProvider router={router} />
          {/* </PersistGate>
        </Provider> */}
      </QueryClientProvider>
    </AppProvider>
  );
}
