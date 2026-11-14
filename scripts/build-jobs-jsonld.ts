import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jobsFile = path.join(root, "savanna/data/jobs.json");
const htmlFile = path.join(root, "savanna/pages/jobs.html");

type Job = {
  id: string;
  title: string;
  employer: string;
  location: string;
  datePosted: string;
  validThrough: string;
  description: string;
  accommodations: string[];
};

function jobPostingLd(job: Job): object {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    hiringOrganization: { "@type": "Organization", name: job.employer },
    jobLocation: { "@type": "Place", name: job.location },
    jobBenefits: job.accommodations,
  };
}

export function buildJsonLdBlocks(jobs: Job[]): string {
  return jobs.map((job) => `<script type="application/ld+json">\n${JSON.stringify(jobPostingLd(job), null, 2)}\n</script>`).join("\n");
}

function main() {
  const { jobs } = JSON.parse(fs.readFileSync(jobsFile, "utf8")) as { jobs: Job[] };
  const blocks = buildJsonLdBlocks(jobs);
  let html = fs.readFileSync(htmlFile, "utf8");
  html = html.replace(
    /<!-- mezgeb:jobs-jsonld -->[\s\S]*?<!-- \/mezgeb:jobs-jsonld -->|<!-- mezgeb:jobs-jsonld -->/,
    `<!-- mezgeb:jobs-jsonld -->\n${blocks}\n<!-- /mezgeb:jobs-jsonld -->`
  );
  fs.writeFileSync(htmlFile, html);
  console.log(`Injected ${jobs.length} JobPosting blocks into jobs.html`);
}

const isMain =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) main();