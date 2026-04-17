import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaShopify,
  FaWhatsapp,
} from "react-icons/fa";
import type { IconType } from "react-icons";

import type { ChannelKey } from "../types/channel.types";

type ChannelConfig = {
  label: string;
  icon: IconType | string;
  badgeClassName: string;
  textClassName: string;
  barClassName: string;
  iconBgClassName: string;
};

export const channelConfig: Record<ChannelKey, ChannelConfig> = {
  whatsapp: {
    label: "WhatsApp",
    icon: FaWhatsapp,
    badgeClassName: "bg-whatsapp/10 text-whatsapp",
    textClassName: "text-whatsapp",
    barClassName: "bg-whatsapp",
    iconBgClassName: "bg-whatsapp/10",
  },
  daraz: {
    label: "Daraz",
    icon: "/Connectors/Daraz.png",
    badgeClassName: "bg-daraz/10 text-daraz",
    textClassName: "text-daraz",
    barClassName: "bg-daraz",
    iconBgClassName: "bg-daraz/10",
  },
  shopify: {
    label: "Shopify",
    icon: FaShopify,
    badgeClassName: "bg-shopify/10 text-shopify",
    textClassName: "text-shopify",
    barClassName: "bg-shopify",
    iconBgClassName: "bg-shopify/10",
  },
  facebook: {
    label: "Facebook",
    icon: FaFacebook,
    badgeClassName: "bg-facebook/10 text-facebook",
    textClassName: "text-facebook",
    barClassName: "bg-facebook",
    iconBgClassName: "bg-facebook/10",
  },
  instagram: {
    label: "Instagram",
    icon: FaInstagram,
    badgeClassName: "bg-instagram/10 text-instagram",
    textClassName: "text-instagram",
    barClassName: "bg-instagram",
    iconBgClassName: "bg-instagram/10",
  },
  email: {
    label: "Email",
    icon: FaEnvelope,
    badgeClassName: "bg-muted text-muted-foreground",
    textClassName: "text-muted-foreground",
    barClassName: "bg-muted-foreground",
    iconBgClassName: "bg-muted",
  },
};
