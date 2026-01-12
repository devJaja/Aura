// aura-docs/theme.config.tsx
import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>AURA Protocol Documentation</span>,
  project: {
    link: "https://github.com/your-org/your-repo", // Replace with your GitHub repo
  },
  chat: {
    link: "https://discord.com", // Replace with your Discord link
  },
  docsRepositoryBase: "https://github.com/your-org/your-repo/blob/main", // Replace with your GitHub repo
  footer: {
    text: "AURA Protocol © 2026",
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Aura',
    }
  },
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>
      }
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 2,
    toggleButton: true
  }
};

export default config;
