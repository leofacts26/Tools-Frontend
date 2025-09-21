// lib/data.js
import { FaCreditCard, FaBook, FaBriefcase } from "react-icons/fa";

const sublinks = [
  {
    key: "finance",
    page: "Finance",
    links: [
      // labelKey matches messages keys under common.navbar.finance.links.<labelKey>.label
      { label: "SIP Calculator", labelKey: "sip-calculator", icon: <FaCreditCard />, url: "sip-calculator" },
      { label: "Lumpsum Calculator",      labelKey: "lumpsum-calculator",      icon: <FaCreditCard />, url: "lumpsum-calculator" },
      { label: "SWP", labelKey: "swp-calculator",       icon: <FaCreditCard />, url: "swp-calculator" },
      { label: "MF", labelKey: "mutual-fund-returns-calculator",  icon: <FaCreditCard />, url: "mutual-fund-returns-calculator" },
      { label: "MF", labelKey: "sukanya-samriddhi-yojana-calculator",  icon: <FaCreditCard />, url: "sukanya-samriddhi-yojana-calculator" },
      { label: "PPF Calculator", labelKey: "ppf-calculator",  icon: <FaCreditCard />, url: "ppf-calculator" },
    ],
  },
  {
    key: "students",
    page: "Students",
    links: [
      { label: "Plugins",    labelKey: "plugins",    icon: <FaBook />, url: "/products" },
      { label: "Libraries",  labelKey: "libraries",  icon: <FaBook />, url: "/products" },
      { label: "Help",       labelKey: "help",       icon: <FaBook />, url: "/products" },
      { label: "Billing",    labelKey: "billing",    icon: <FaBook />, url: "/products" },
    ],
  },
  {
    key: "utilities",
    page: "Utilities",
    links: [
      { label: "About",      labelKey: "about",      icon: <FaBriefcase />, url: "/products" },
      { label: "Customers",  labelKey: "customers",  icon: <FaBriefcase />, url: "/products" },
    ],
  },
  {
    key: "others",
    page: "Others",
    links: [
      { label: "Others",     labelKey: "others",     icon: <FaBriefcase />, url: "/products" },
      { label: "Customers",  labelKey: "customers",  icon: <FaBriefcase />, url: "/products" },
    ],
  },
];

export default sublinks;
