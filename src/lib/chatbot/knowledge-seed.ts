import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { extractTextFromPdf } from "./pdf-parser";

interface DocSection {
  heading: string;
  paragraphs: string[];
}

interface CompanyDocDefinition {
  title: string;
  fileName: string;
  sections: DocSection[];
}

/**
 * Creates a valid, standard PDF 1.4 binary buffer from structured sections.
 */
function generatePdfBuffer(title: string, sections: DocSection[]): Buffer {
  let streamText = "BT\n/F1 14 Tf\n50 740 Td\n";
  // Main Document Header
  streamText += `(${title.replace(/[()\\]/g, "\\$&")}) Tj\n/F1 10 Tf\n0 -25 Td\n`;

  for (const sec of sections) {
    // Section Header
    streamText += `/F1 12 Tf\n(${sec.heading.replace(/[()\\]/g, "\\$&")}) Tj\n/F1 10 Tf\n0 -16 Td\n`;
    for (const p of sec.paragraphs) {
      const words = p.split(" ");
      let line = "";
      for (const w of words) {
        if ((line + " " + w).length > 76) {
          streamText += `(${line.trim().replace(/[()\\]/g, "\\$&")}) Tj\n0 -13 Td\n`;
          line = w + " ";
        } else {
          line += w + " ";
        }
      }
      if (line.trim()) {
        streamText += `(${line.trim().replace(/[()\\]/g, "\\$&")}) Tj\n0 -16 Td\n`;
      }
    }
    streamText += "0 -8 Td\n";
  }
  streamText += "ET\n";

  const streamBuf = Buffer.from(streamText, "utf-8");

  const pdfParts = [
    "%PDF-1.4\n",
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n",
    `4 0 obj\n<< /Length ${streamBuf.length} >>\nstream\n`,
    streamText,
    "endstream\nendobj\n",
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];

  let body = "";
  for (const part of pdfParts) {
    body += part;
  }

  const obj1 = body.indexOf("1 0 obj");
  const obj2 = body.indexOf("2 0 obj");
  const obj3 = body.indexOf("3 0 obj");
  const obj4 = body.indexOf("4 0 obj");
  const obj5 = body.indexOf("5 0 obj");

  const xrefOffset = body.length;
  const xref =
    `xref\n0 6\n0000000000 65535 f \n` +
    `${String(obj1).padStart(10, "0")} 00000 n \n` +
    `${String(obj2).padStart(10, "0")} 00000 n \n` +
    `${String(obj3).padStart(10, "0")} 00000 n \n` +
    `${String(obj4).padStart(10, "0")} 00000 n \n` +
    `${String(obj5).padStart(10, "0")} 00000 n \n` +
    `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(body + xref, "utf-8");
}

export const COMPANY_DOCUMENTS: CompanyDocDefinition[] = [
  {
    title: "CloudCentric Company Profile & Global Overview",
    fileName: "CloudCentric_Company_Overview.pdf",
    sections: [
      {
        heading: "1. About CloudCentric",
        paragraphs: [
          "CloudCentric is a premier enterprise digital transformation and AI engineering consultancy. We help modern businesses adopt artificial intelligence, automate complex workflows, optimize customer experiences, and build scalable digital ecosystems.",
          "Our mission is to bridge cutting-edge artificial intelligence with enterprise reality, delivering measurable ROI and operational resilience for Fortune 500 brands and high-growth innovators alike.",
        ],
      },
      {
        heading: "2. Core Service Pillars",
        paragraphs: [
          "Autonomous AI Agent Development: Designing autonomous agents that plan, reason, and execute operations across CRM, ERP, and customer service.",
          "Salesforce Cloud Consulting: Certified Crest Partner delivering Sales Cloud, Service Cloud, Marketing Cloud, Data Cloud, and Agentforce implementations.",
          "Full-Stack Cloud Engineering: Resilient microservices, cloud migration, and hybrid integrations across AWS, Google Cloud, and Microsoft Azure.",
          "Growth & Digital Experience: Enterprise headless CMS, headless commerce, performance optimization, and custom web applications.",
        ],
      },
      {
        heading: "3. Global Presence & Headquarters",
        paragraphs: [
          "Headquarters: San Francisco, California, USA.",
          "East Coast Hub: New York City, New York, USA.",
          "European Delivery Center: London, United Kingdom.",
          "Asia-Pacific Innovation Center: Bangalore, India.",
          "Official Contact: Email support@flyblaze.com, Phone +1 (800) CLOUDCENTRIC / +1 (800) 256-8323, Web https://cloudcentric.ai.",
        ],
      },
      {
        heading: "4. Accreditations & Certifications",
        paragraphs: [
          "Salesforce Crest Partner with over 50+ certified consultants.",
          "AWS Advanced Tier Services Partner and Google Cloud Recognized Partner.",
          "Certified ISO 27001 Information Security, SOC 2 Type II Audited, GDPR Compliant, and HIPAA Ready for healthcare systems.",
        ],
      },
    ],
  },
  {
    title: "CloudCentric AI Solutions & Autonomous Agents Guide",
    fileName: "CloudCentric_AI_Solutions_and_Agents.pdf",
    sections: [
      {
        heading: "1. Custom Autonomous AI Agents",
        paragraphs: [
          "CloudCentric deploys custom autonomous AI agents that operate 24/7 without human fatigue. Unlike static chatbots, our agents evaluate user intent, interact with corporate databases, verify business rules, and execute actions across third-party tools.",
          "Key applications include customer service tier-1 and tier-2 resolution, financial reconciliation, supplier communication, claims processing, and employee onboarding.",
        ],
      },
      {
        heading: "2. Enterprise Retrieval-Augmented Generation (RAG)",
        paragraphs: [
          "We build enterprise RAG pipelines that ground Large Language Models in your company documentation, manuals, knowledge bases, and live databases.",
          "Our architecture incorporates hybrid semantic search, BM25 keyword matching, reranking, and dynamic prompt synthesis to ensure 100% factual fidelity with zero hallucination.",
        ],
      },
      {
        heading: "3. AI Implementation Timeline & Methodology",
        paragraphs: [
          "Phase 1 (Weeks 1-2): Use-Case Discovery & Security Architecture Alignment.",
          "Phase 2 (Weeks 3-4): Interactive Proof-of-Concept (POC) built in a secure sandbox.",
          "Phase 3 (Weeks 5-8): System integration with Salesforce, ERP, and internal databases.",
          "Phase 4 (Weeks 9-12): Production deployment, real-time telemetry, and managed 24/7 maintenance.",
        ],
      },
      {
        heading: "4. Security, Privacy & Compliance",
        paragraphs: [
          "All AI models can be deployed within your private VPC or dedicated on-premises infrastructure.",
          "We enforce automated PII redaction, prompt injection defense, and strict zero-data-retention agreements with AI foundation model providers.",
        ],
      },
    ],
  },
  {
    title: "CloudCentric Salesforce & Cloud Integration Services",
    fileName: "CloudCentric_Salesforce_and_Cloud_Integration.pdf",
    sections: [
      {
        heading: "1. Salesforce Cloud Practice",
        paragraphs: [
          "CloudCentric is a certified Salesforce Crest partner with deep expertise across Sales Cloud, Service Cloud, Marketing Cloud, Experience Cloud, and Salesforce Data Cloud.",
          "We specialize in Agentforce implementations, enabling autonomous service agents inside Salesforce that resolve customer cases, update records, and generate personalized communications.",
        ],
      },
      {
        heading: "2. Enterprise Integration & MuleSoft",
        paragraphs: [
          "Our certified architects design API-led connectivity using MuleSoft, AWS EventBridge, and Kafka to synchronize Salesforce with SAP, Oracle, NetSuite, and proprietary legacy databases in real time.",
          "We eliminate operational silos and guarantee high-throughput, transactional data consistency.",
        ],
      },
      {
        heading: "3. Service Level Agreements (SLAs) & Support",
        paragraphs: [
          "Priority 1 (Critical Outage): 15-minute response time with continuous 24/7 engineering triage.",
          "Priority 2 (High Impact): 1-hour response time.",
          "Priority 3 (General Inquiries & Routine Enhancements): 4-hour response time.",
          "Dedicated technical account manager assigned to every enterprise client.",
        ],
      },
    ],
  },
  {
    title: "CloudCentric Products, Platforms & Pricing",
    fileName: "CloudCentric_Products_Pricing_and_Engagement_Models.pdf",
    sections: [
      {
        heading: "1. Proprietary Products & Accelerators",
        paragraphs: [
          "CloudCentric CMS: Enterprise headless content management platform with built-in RBAC, IP whitelisting, audit logging, and lightning-fast edge delivery.",
          "CloudCentric AgentFlow: Visual canvas for designing, testing, and monitoring autonomous AI agent workflows across external APIs.",
          "CloudCentric DataSync: High-velocity bi-directional replication engine syncing Salesforce, PostgreSQL, and Snowflake.",
        ],
      },
      {
        heading: "2. Flexible Engagement Models",
        paragraphs: [
          "Dedicated Engineering Squads: Monthly retainer providing dedicated senior engineers, AI researchers, and solution architects.",
          "Fixed-Scope Milestones: Clearly defined deliverables with transparent stage-gate approvals and fixed pricing.",
          "Managed AI & Cloud Services: 24/7 maintenance, proactive monitoring, security updates, and performance tuning.",
        ],
      },
      {
        heading: "3. Consultation & Discovery",
        paragraphs: [
          "We offer a complimentary 30-minute discovery consultation with a Principal Solutions Architect. Prospective clients can schedule directly via the 'Book a Consultation' button on the website.",
          "All new custom AI projects include a risk-free 30-day proof-of-concept milestone.",
        ],
      },
    ],
  },
  {
    title: "CloudCentric Support & Live Agent Assistance Policy",
    fileName: "CloudCentric_Support_and_Live_Agent_Handbook.pdf",
    sections: [
      {
        heading: "1. Customer Support Channels",
        paragraphs: [
          "24/7 AI-Powered Virtual Assistant: Available directly on the CloudCentric web portal for instant documentation answers, technical details, and consultation booking.",
          "Live Human Agent Support: Customers can switch from the AI assistant to a live specialist at any point during chat by clicking 'Chat with a Live Agent'.",
          "Email Support: support@flyblaze.com (handled within 1 business hour).",
          "Direct Telephone Support: +1 (800) CLOUDCENTRIC for active contract customers.",
        ],
      },
      {
        heading: "2. Live Agent Hours & Response Policy",
        paragraphs: [
          "Live Specialist Coverage: Monday through Friday, 24 Hours around the clock. Saturday and Sunday: 8:00 AM to 8:00 PM EST.",
          "If all live agents are currently assisting other clients, your request is prioritized in the live queue, and a dedicated team member will respond within minutes or contact you via your provided email and phone number.",
          "All customer inquiries and chat histories are securely stored in the CloudCentric customer portal for continuous auditing and seamless agent handover.",
        ],
      },
    ],
  },
];

/**
 * Splits text into overlapping semantic chunks for RAG indexing.
 */
export function chunkDocumentText(
  fullText: string,
  docTitle: string,
  chunkSize = 500,
  overlap = 80
): { content: string; metadata: { sectionTitle?: string; docTitle: string } }[] {
  const chunks: { content: string; metadata: { sectionTitle?: string; docTitle: string } }[] = [];
  
  // Split by double newlines or section headers first
  const sections = fullText.split(/\n{2,}/);
  let currentChunk = "";
  let currentHeading = docTitle;

  for (const block of sections) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Detect heading
    if (trimmed.length < 80 && (trimmed.startsWith("1.") || trimmed.startsWith("2.") || trimmed.startsWith("3.") || trimmed.startsWith("4.") || trimmed.endsWith(":"))) {
      currentHeading = trimmed;
    }

    if ((currentChunk + " " + trimmed).length <= chunkSize) {
      currentChunk += (currentChunk ? "\n\n" : "") + trimmed;
    } else {
      if (currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          metadata: { sectionTitle: currentHeading, docTitle },
        });
      }

      // If a single block is longer than chunkSize, split by sentences
      if (trimmed.length > chunkSize) {
        const sentences = trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed];
        currentChunk = "";
        for (const sentence of sentences) {
          if ((currentChunk + " " + sentence).length <= chunkSize) {
            currentChunk += (currentChunk ? " " : "") + sentence.trim();
          } else {
            if (currentChunk) {
              chunks.push({
                content: currentChunk.trim(),
                metadata: { sectionTitle: currentHeading, docTitle },
              });
            }
            currentChunk = sentence.trim();
          }
        }
      } else {
        // Take overlap from previous chunk
        const overlapText = currentChunk.slice(-overlap);
        currentChunk = (overlapText ? overlapText + " " : "") + trimmed;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      metadata: { sectionTitle: currentHeading, docTitle },
    });
  }

  return chunks;
}

/**
 * Seeds company PDF documentation files to public/documents/company/
 * and synchronizes them with ChatKnowledgeDoc and ChatDocChunk in Prisma.
 */
export async function seedCompanyKnowledgeBase(): Promise<void> {
  const dir = path.join(process.cwd(), "public", "documents", "company");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const docDef of COMPANY_DOCUMENTS) {
    const filePath = path.join(dir, docDef.fileName);
    const pdfBuf = generatePdfBuffer(docDef.title, docDef.sections);
    fs.writeFileSync(filePath, pdfBuf);

    // Extract text using PDF parser to verify end-to-end PDF processing
    const parsed = await extractTextFromPdf(pdfBuf);
    const textToStore = parsed.text || docDef.sections.map((s) => `${s.heading}\n${s.paragraphs.join("\n")}`).join("\n\n");

    const fileUrl = `/documents/company/${docDef.fileName}`;
    const fileSize = pdfBuf.length;
    const pageCount = parsed.totalPages || 1;

    // Upsert Knowledge Document in Prisma
    const existing = await prisma.chatKnowledgeDoc.findFirst({
      where: { fileName: docDef.fileName },
    });

    let docRecord;
    if (existing) {
      docRecord = await prisma.chatKnowledgeDoc.update({
        where: { id: existing.id },
        data: {
          title: docDef.title,
          fileUrl,
          fileSize,
          pageCount,
          extractedText: textToStore,
          isActive: true,
        },
      });
      // Delete old chunks
      await prisma.chatDocChunk.deleteMany({
        where: { documentId: docRecord.id },
      });
    } else {
      docRecord = await prisma.chatKnowledgeDoc.create({
        data: {
          title: docDef.title,
          fileName: docDef.fileName,
          fileUrl,
          fileSize,
          pageCount,
          extractedText: textToStore,
          isActive: true,
        },
      });
    }

    // Chunk the text and store chunks
    const chunks = chunkDocumentText(textToStore, docDef.title);
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      await prisma.chatDocChunk.create({
        data: {
          documentId: docRecord.id,
          chunkIndex: i,
          content: c.content,
          metadata: c.metadata,
        },
      });
    }
  }

  console.log(`[KnowledgeBase] Seeded ${COMPANY_DOCUMENTS.length} official company PDF documents.`);
}
