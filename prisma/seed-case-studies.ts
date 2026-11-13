/**
 * One-off migration: moves the case studies that used to be hardcoded in
 * src/components/case-studies/CaseStudyListing.tsx into the CMS database.
 *
 * Safe to re-run: a case study whose sections were already filled in (e.g. edited
 * in the admin) is left untouched.
 *
 * Run: npx tsx prisma/seed-case-studies.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const slugify = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const CASE_STUDIES = [
  {
    slug: "automating-business-operations-with-ai",
    title: "AI-Powered Automation for Faster, Smarter Business Operations",
    category: "AI & Automation",
    tags: ["Business Transformation"],
    clientName: "ABC PVT LTD",
    industry: "MANUFACTURING",
    displayOrder: 1,
    overview:
      "We helped transform manual, repetitive business processes into intelligent workflows using AI-powered automation–reducing operational effort, improving productivity, and creating a more scalable way of working.",
    challenge:
      "We helped transform manual, repetitive business processes into intelligent workflows using AI-powered automation–reducing operational effort, improving productivity, and creating a more scalable way of working.",
    solution: "AI-powered automation connected key processes and reduced repetitive work.",
    seoDescription:
      "Case study on how CloudCentric transformed manual operations into intelligent AI-powered workflows for ABC Pvt Ltd, boosting productivity and scalability.",
    impacts: ["FASTER OPERATIONS", "HIGHER PRODUCTIVITY", "BETTER SCALABILITY"],
    image: "/images/case-studies/case-studies-1.png",
    technologies: ["GENERATIVE AI", "CRM", "INTELLIGENT WORKFLOWS", "BETTER SCALABILITY", "CLOUD INFRASTRUCTURE", "APIS"],
    challengeTitle: "Too Much Manual Work. Too Little Time.",
    challengeHtml:
      "<p>The business relied on repetitive manual processes across teams, resulting in delays, duplicated effort, inconsistent data, and limited visibility. As operations grew, these challenges became harder to manage and created unnecessary pressure on teams.</p>",
    keyChallenges: [
      "Repetitive manual processes",
      "Time-consuming data handling",
      "Disconnected workflows",
      "Delayed decision-making",
      "Limited operational visibility",
    ],
    approachTitle: "Turning Manual Processes Into Intelligent Workflows",
    approachHtml:
      "<p>We analyzed the existing workflows to identify where AI and automation could create the greatest impact. Rather than replacing existing systems, we connected intelligent automation with the business's existing processes and technology ecosystem.</p>",
    approachSteps: [
      { title: "Identify", desc: "Find repetitive, high-impact processes suitable for automation." },
      { title: "Design", desc: "Create intelligent workflows around real business requirements." },
      { title: "Integrate", desc: "Connect AI with existing applications, data, and business systems." },
      { title: "Automate", desc: "Deploy AI-powered workflows with appropriate human oversight." },
      { title: "Optimize", desc: "Monitor performance and continuously improve the solution." },
    ],
    solutionTitle: "AI That Works Across the Business",
    solutionHtml:
      "<p>We designed an intelligent automation layer capable of understanding requests, processing information, triggering workflows, and assisting teams with routine operational tasks.</p>",
    solutionHighlights: [
      { title: "Intelligent Workflow Automation", desc: "Automated repetitive processes and reduced unnecessary manual intervention." },
      { title: "AI-Powered Decision Support", desc: "Provided teams with relevant information and insights when they needed them." },
      { title: "Connected Business Systems", desc: "Integrated automation with existing applications and data sources." },
      { title: "Human-in-the-Loop", desc: "Kept people involved in important decisions while allowing AI to handle routine work." },
    ],
    impactTitle: "From Manual Operations to Intelligent Automation",
    impactHtml:
      "<p><em>“The solution helped create a more efficient operating model by reducing repetitive work and enabling teams to focus on higher-value activities.”</em></p>",
    impactHighlights: [
      { title: "Reduced Manual Effort", desc: "More routine processes handled automatically." },
      { title: "Faster Operations", desc: "Less time spent moving information between systems." },
      { title: "Better Visibility", desc: "Improved access to operational information and insights." },
      { title: "Scalable Processes", desc: "Automation designed to support future business growth." },
    ],
  },
  {
    slug: "scaling-enterprise-support-salesforce-agentforce",
    title: "Building a Scalable Salesforce Ecosystem",
    category: "Salesforce",
    tags: ["Customer Support"],
    clientName: "GLOBAL TELECOM",
    industry: "TELECOMMUNICATIONS",
    displayOrder: 2,
    overview: "High ticket volumes and delayed support responses were impacting customer satisfaction scores.",
    challenge: "High ticket volumes and delayed support responses were impacting customer satisfaction scores.",
    solution: "Deployed autonomous Salesforce Agentforce assistants to handle complex tier-1 queries in real time.",
    seoDescription:
      "Discover how CloudCentric deployed Salesforce Agentforce assistants for Global Telecom to achieve 64% ticket deflection and sub-minute support resolution.",
    impacts: ["64% DEFLECTION", "SUB-MINUTE RESOLUTION", "24/7 AVAILABILITY"],
    image: "/images/case-studies/case-studies-2.png",
    technologies: ["SALESFORCE", "AGENTFORCE", "CRM INTEGRATION", "AI AGENTS", "CUSTOMER SERVICE"],
    challengeTitle: "",
    challengeHtml: "<p>High ticket volumes and delayed support responses were impacting customer satisfaction scores.</p>",
    keyChallenges: [],
    approachTitle: "",
    approachHtml: "",
    approachSteps: [],
    solutionTitle: "",
    solutionHtml: "<p>Deployed autonomous Salesforce Agentforce assistants to handle complex tier-1 queries in real time.</p>",
    solutionHighlights: [],
    impactTitle: "",
    impactHtml: "",
    impactHighlights: [],
  },
];

async function main() {
  for (const cs of CASE_STUDIES) {
    const category = await prisma.caseStudyCategory.upsert({
      where: { slug: slugify(cs.category) },
      update: {},
      create: { name: cs.category, slug: slugify(cs.category) },
    });

    const tagIds: string[] = [];
    for (const name of cs.tags) {
      const tag = await prisma.caseStudyTag.upsert({
        where: { slug: slugify(name) },
        update: {},
        create: { name, slug: slugify(name) },
      });
      tagIds.push(tag.id);
    }

    const content = {
      title: cs.title,
      clientName: cs.clientName,
      industry: cs.industry,
      summary: cs.overview,
      challenge: cs.challenge,
      solution: cs.solution,
      seoTitle: cs.title,
      seoDescription: cs.seoDescription,
      thumbnailImage: cs.image,
      featuredImage: cs.image,
      featuredImageAlt: cs.title,
      impacts: cs.impacts,
      technologies: cs.technologies,
      challengeTitle: cs.challengeTitle || null,
      challengeHtml: cs.challengeHtml || null,
      keyChallenges: cs.keyChallenges,
      approachTitle: cs.approachTitle || null,
      approachHtml: cs.approachHtml || null,
      approachSteps: cs.approachSteps,
      solutionTitle: cs.solutionTitle || null,
      solutionHtml: cs.solutionHtml || null,
      solutionHighlights: cs.solutionHighlights,
      impactTitle: cs.impactTitle || null,
      impactHtml: cs.impactHtml || null,
      impactHighlights: cs.impactHighlights,
      displayOrder: cs.displayOrder,
      categoryId: category.id,
    };

    const existing = await prisma.caseStudy.findUnique({ where: { slug: cs.slug } });

    if (!existing) {
      await prisma.caseStudy.create({
        data: {
          ...content,
          slug: cs.slug,
          results: "",
          status: "PUBLISHED",
          publishedAt: new Date(),
          tags: { create: tagIds.map((tagId) => ({ tagId })) },
        },
      });
      console.log(`created: ${cs.slug}`);
    } else if (!existing.challengeHtml && !existing.solutionHtml && !existing.thumbnailImage) {
      // Old-schema row that was never edited with the new editor: fill it in
      await prisma.caseStudy.update({
        where: { id: existing.id },
        data: {
          ...content,
          tags: { deleteMany: {}, create: tagIds.map((tagId) => ({ tagId })) },
        },
      });
      console.log(`filled: ${cs.slug}`);
    } else {
      console.log(`skipped (already edited): ${cs.slug}`);
    }
  }

  const all = await prisma.caseStudy.findMany({ select: { slug: true, status: true }, orderBy: { displayOrder: "asc" } });
  console.log("case studies in DB:", JSON.stringify(all));
}

main()
  .catch((e) => {
    console.error("SEED FAILED:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
