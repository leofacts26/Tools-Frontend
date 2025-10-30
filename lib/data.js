// lib/data.js
import { FaCreditCard, FaBook, FaBriefcase } from "react-icons/fa";

const sublinks = [
  {
    key: "finance",
    page: "Finance",
    links: [
      // labelKey matches messages keys under common.navbar.finance.links.<labelKey>.label
      { label: "SIP Calculator", labelKey: "sip-calculator", icon: <FaCreditCard />, url: "sip-calculator" },
      { label: "Lumpsum Calculator", labelKey: "lumpsum-calculator", icon: <FaCreditCard />, url: "lumpsum-calculator" },
      { label: "SWP", labelKey: "swp-calculator", icon: <FaCreditCard />, url: "swp-calculator" },
      { label: "MF", labelKey: "mutual-fund-returns-calculator", icon: <FaCreditCard />, url: "mutual-fund-returns-calculator" },
      { label: "MF", labelKey: "sukanya-samriddhi-yojana-calculator", icon: <FaCreditCard />, url: "sukanya-samriddhi-yojana-calculator" },
      { label: "PPF Calculator", labelKey: "ppf-calculator", icon: <FaCreditCard />, url: "ppf-calculator" },
      { label: "EPF Calculator", labelKey: "epf-calculator", icon: <FaCreditCard />, url: "epf-calculator" },
      { label: "FD Calculator", labelKey: "fd-calculator", icon: <FaCreditCard />, url: "fd-calculator" },
      { label: "RD Calculator", labelKey: "rd-calculator", icon: <FaCreditCard />, url: "rd-calculator" },
      { label: "NPS Calculator", labelKey: "nps-calculator", icon: <FaCreditCard />, url: "nps-calculator" },
      { label: "Simple Intrest Calculator", labelKey: "simple-interest-calculator", icon: <FaCreditCard />, url: "simple-interest-calculator" },
      { label: "NSC Calculator", labelKey: "nsc-calculator", icon: <FaCreditCard />, url: "nsc-calculator" },
      { label: "Step Up SIP Calculator", labelKey: "step-up-sip-calculator", icon: <FaCreditCard />, url: "step-up-sip-calculator" },
      { label: "Gratuity Calculator", labelKey: "gratuity-calculator", icon: <FaCreditCard />, url: "gratuity-calculator" },
    ],
  },
  {
    key: "students",
    page: "Students",
    links: [
      { label: "GPA Calculator", labelKey: "gpa-calculator", icon: <FaBook />, url: "/" },
      { label: "Grade Converter", labelKey: "grade-convertor", icon: <FaBook />, url: "/" }
    ],
  },
  {
    key: "developer",
    page: "Developer",
    links: [
      { label: "JSON Formatter", labelKey: "about", icon: <FaBriefcase />, url: "/" },
      { label: "HTML Beautifier", labelKey: "customers", icon: <FaBriefcase />, url: "/" },
    ],
  },
  {
    key: "others",
    page: "Others",
    links: [
      { label: "Text Utilities", labelKey: "text-utilities", icon: <FaBriefcase />, url: "/" },
      { label: "Fun Tools", labelKey: "fun-tools", icon: <FaBriefcase />, url: "/" },
    ],
  },
  {
    key: "blog",
    page: "Blog",
    links: [
      { label: "Finance", labelKey: "finance", icon: <FaBriefcase />, url: "/finance" },
      { label: "Earn", labelKey: "earn", icon: <FaBriefcase />, url: "/" },
    ],
  },
];

export default sublinks;
