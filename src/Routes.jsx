import {
  Routes as ReactRouterRoutes,
  Route,
  BrowserRouter,
  useLocation,
} from "react-router-dom";
import PageBuilder from "./pages/PageBuilder";
import Create from "./pages/page-builder/Create";
import Editer from "./pages/page-builder/Editer";
import { useMemo } from "react";
import React from "react";
const urlParams = new URLSearchParams(window.location.search);
const SHOP = urlParams.get("shop");
/**
 * File-based routing.
 * @desc File-based routing that uses React Router under the hood.
 * To create a new route create a new .jsx file in `/pages` with a default export.
 *
 * Some examples:
 * * `/pages/index.jsx` matches `/`
 * * `/pages/blog/[id].jsx` matches `/blog/123`
 * * `/pages/[...catchAll].jsx` matches any URL not explicitly matched
 *
 * @param {object} pages value of import.meta.globEager(). See https://vitejs.dev/guide/features.html#glob-import
 *
 * @return {Routes} `<Routes/>` from React Router, with a `<Route/>` for each file in `pages`
 */
export default function Routes({ pages }) {
  const routes = useMemo(() => useRoutes(pages), [pages]);
  const location = useLocation();
  const customRoutes = {};
  const routeComponents = routes.map(({ path, component: Component }) => {
    return <Route key={path} path={`${path}`} element={<Component />} />;
  });

  let Dashboard = false;
  if (routes.find(({ path }) => path === "/"))
    Dashboard = routes.find(({ path }) => path === "/").component;
  const NotFound = routes.find(({ path }) => path === "/dashboard").component;



  return (
    <ReactRouterRoutes>
      {/* {routeComponent} */}
      {routeComponents}
      {Dashboard && <Route path="/dashboard" element={<Dashboard />} />}
      <Route path="/page-builder" element={<PageBuilder />}>
        <Route path="/page-builder/Editer" element={<Editer />} />
        <Route path="/page-builder/create" element={<Create />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </ReactRouterRoutes>
  );
}

function useRoutes(pages) {
  const routes = Object.keys(pages)
    .map((key) => {
      let path = key
        .replace("./pages", "")
        .replace("./proxy", "")
        .replace(/\.(t|j)sx?$/, "")
        .replace("$", ":")
        /**
         * Replace /index with /
         */
        .replace(/\/index$/i, "/")
        /**
         * Only lowercase the first letter. This allows the developer to use camelCase
         * dynamic paths while ensuring their standard routes are normalized to lowercase.
         */
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
        /**
         * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
         */
        .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);

      if (path.endsWith("/") && path !== "/") {
        path = path.substring(0, path.length - 1);
      }

      if (!pages[key].default) {
        console.warn(`${key} doesn't export a default React component`);
      }

      return {
        path,
        component: pages[key].default,
      };
    })
    .filter((route) => route.component);
  return routes;
}
