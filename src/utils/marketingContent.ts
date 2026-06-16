const base = import.meta.env.BASE_URL;

export type Integration = {
    name: string;
    logo: string;
};

export const integrations: Integration[] = [
    { name: "Shopify", logo: `${base}logos/third_party/shopify.svg` },
    { name: "QuickBooks", logo: `${base}logos/third_party/quickbooks.svg` },
    { name: "Google Workspace", logo: `${base}logos/third_party/google.svg` },
    { name: "Microsoft 365", logo: `${base}logos/third_party/m365.png` },
    { name: "Excel", logo: `${base}logos/third_party/excel.svg` },
    { name: "Clover", logo: `${base}logos/third_party/clover.svg` },
    { name: "Airtable", logo: `${base}logos/third_party/airtable.svg` },
    { name: "Notion", logo: `${base}logos/third_party/notion.svg` },
    { name: "Slack", logo: `${base}logos/third_party/slack.svg` },
];

export type HowItWorksAct = {
    index: string;
    title: string;
    body: string;
};

export const howItWorks: HowItWorksAct[] = [
    {
        index: "01",
        title: "Describe the work",
        body: "Type it in plain language. 'Every morning, sync yesterday's Shopify orders across all stores into QuickBooks and send a summary to the team.'",
    },
    {
        index: "02",
        title: "It connects and asks once",
        body: "Duri hits the live APIs. If it needs a decision — which account, which template — it asks once and remembers the answer for every run after that.",
    },
    {
        index: "03",
        title: "Runs on your schedule",
        body: "Daily, weekly, or on every new order. You get the result. The tab-switching, the copy-paste, the re-entry — gone.",
    },
];

export const realityPoints: { index: string; label: string; line: string }[] = [
    {
        index: "01",
        label: "Three stores. Three exports. Every morning.",
        line: "Multiple Shopify locations means multiple dashboards. You pull each one, re-enter the numbers into QuickBooks, and hope nothing mismatches by the time month-end reconciliation rolls around.",
    },
    {
        index: "02",
        label: "Clover ran 400 transactions. The spreadsheet shows 387.",
        line: "POS data stays locked in the terminal. Getting a daily sales report means exporting a file, opening Excel, and reformatting it by hand before you can share it with anyone.",
    },
    {
        index: "03",
        label: "The AI suggested the steps. You still clicked them.",
        line: "Claude Cowork and most AI co-pilots run in a browser sandbox. They can see one store at a time, draft the email, and walk you through the QuickBooks form. You still do every step. Duri hits the live APIs directly and completes the operation end-to-end.",
    },
];
