import { seedCompanyKnowledgeBase } from "../src/lib/chatbot/knowledge-seed";

async function main() {
  console.log("Seeding company knowledge base PDFs...");
  await seedCompanyKnowledgeBase();
  console.log("Knowledge base seeding complete!");
}

main().catch((err) => {
  console.error("Knowledge base seeding failed:", err);
  process.exit(1);
});
