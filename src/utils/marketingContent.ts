const base = import.meta.env.BASE_URL;

export type Integration = {
    name: string;
    logo: string;
};

export const integrations: Integration[] = [
    { name: "Shopify", logo: `${base}logos/third_party/shopify.svg` },
    { name: "QuickBooks", logo: `${base}logos/third_party/quickbooks.svg` },
    { name: "Gmail", logo: `${base}logos/third_party/gmail.svg` },
    { name: "Slack", logo: `${base}logos/third_party/slack.png` },
    { name: "Notion", logo: `${base}logos/third_party/notion.svg` },
    { name: "Airtable", logo: `${base}logos/third_party/airtable.svg` },

    { name: "Excel", logo: `${base}logos/third_party/excel.svg` },
];

export type HowItWorksAct = {
    index: string;
    title: string;
    body: string;
};

export const howItWorks: HowItWorksAct[] = [
    {
        index: "01",
        title: "Learns from you",
        body: "Show it once. Type the steps, drop a doc, or record yourself doing the work. It picks up the shape and remembers.",
    },
    {
        index: "02",
        title: "Executes",
        body: "It opens what it needs, asks before it guesses, and finishes the work on your behalf.",
    },
    {
        index: "03",
        title: "Then runs on a schedule",
        body: "Daily, weekly, on every order. Hand it off. The workspace keeps the rhythm.",
    },
];

export const realityPoints: { index: string; label: string; line: string }[] = [
    {
        index: "01",
        label: "Manual, every day",
        line: "Tabs and spreadsheets. The team types the same numbers across, day after day, and something always slips at month-end.",
    },
    {
        index: "02",
        label: "Drag, drop, pray",
        line: "No-code automation tools wired together once, in front of one person. Now nobody can read them, and they break the week a vendor shifts a field.",
    },
    {
        index: "03",
        label: "Hire or contract",
        line: "Bring in a developer or an agency, write the spec, wait, pay. The integration ships six weeks late and only fits one workflow.",
    },
];
