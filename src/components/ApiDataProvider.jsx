import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchData, getApiURL } from "../action";

const ApiDataContext = createContext(null);

export const useApiData = () => useContext(ApiDataContext);

const ApiDataProvider = ({ children }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const SHOP = urlParams.get("shop");

  const { data: planCheck, isPending: isApiCalling } = useQuery({
    queryKey: ["plan_check"],
    queryFn: async () => {
      const formdata = new FormData();
      formdata.append("shop", SHOP);
      const response = await fetchData(getApiURL("/plan-check"), formdata);
      if (response?.status === true) return response;
      return null;
    },
    enabled: !!SHOP,
    staleTime: 0,
    refetchOnMount: true,
  });

  return (
    <ApiDataContext.Provider value={{ planCheck }}>
      {children}
    </ApiDataContext.Provider>
  );
};

export default ApiDataProvider;
