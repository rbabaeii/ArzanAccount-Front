"use client";

import { useEffect } from "react";
import { useStore } from "@/context/StoreContext";

export default function DynamicBrandHead() {
  const { settings } = useStore();

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (settings.siteFavicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      link.href = settings.siteFavicon;
    }
  }, [settings.siteFavicon]);

  return null;
}
