const urlParams = new URLSearchParams(window.location.search);
const SHOP = urlParams.get("shop");

/* EXPORT REMOVE SHOP DOMAIN HANDLER START */
export const removeShopDomain = (url, pathurl) => {

    let newUrl = url
    if (url) {
        if (url?.includes(`https://${CUSTOM_DOMAIN}`))
            newUrl = url.replace(`https://${CUSTOM_DOMAIN}`, "");
        else if (url?.includes(CUSTOM_DOMAIN))
            newUrl = url.replace(CUSTOM_DOMAIN, "")
        else if (url?.includes(`https://${SHOP}`))
            newUrl = url.replace(`https://${SHOP}/`, "");
        else if (url?.includes(`${SHOP}`))
            newUrl = url.replace(`${SHOP}/`, "");
    }
    else {
        newUrl = pathurl;
        newUrl = newUrl?.slice(1, newUrl.length);
    }
    return newUrl
}
/* EXPORT REMOVE SHOP DOMAIN HANDLER END */

/* EXPORT COPY CLICK HANDLER START */
export const handleCopyClick = (value, type) => {
    if (type === "actual") {
        navigator.clipboard.writeText(value).then(
            () => shopify.toast.show("Copied to Clipboard", { duration: 3000 }),
            () =>
                shopify.toast.show("Failed to copy.", {
                    duration: 3000,
                    isError: true,
                })
        );
    } else if (type === "custom") {
        navigator.clipboard.writeText(`${CUSTOM_DOMAIN}${value}`).then(
            () => shopify.toast.show("Copied to Clipboard", { duration: 3000 }),
            () =>
                shopify.toast.show("Failed to copy.", {
                    duration: 3000,
                    isError: true,
                })
        );
    } else {
        navigator.clipboard.writeText(`${SHOP}/${value}`).then(
            () => shopify.toast.show("Copied to Clipboard", { duration: 3000 }),
            () =>
                shopify.toast.show("Failed to copy.", {
                    duration: 3000,
                    isError: true,
                })
        );
    }
};
/* COPY CLICK HANDLER END */