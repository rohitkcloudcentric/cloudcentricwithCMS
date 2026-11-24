import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { verifyAdminApiIpAccess } from "@/lib/admin-ip-guard";
import { getAuthenticatedUser } from "@/lib/auth";
import { extractTextFromPdf } from "@/lib/chatbot/pdf-parser";
import { chunkDocumentText, seedCompanyKnowledgeBase } from "@/lib/chatbot/knowledge-seed";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "15mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ipAllowed = await verifyAdminApiIpAccess(req, res);
  if (!ipAllowed) return;

  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized access." });
  }

  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    try {
      const documents = await prisma.chatKnowledgeDoc.findMany({
        include: {
          _count: {
            select: { chunks: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (error) {
      console.error("Error fetching knowledge documents:", error);
      return res.status(500).json({ success: false, error: "Failed to load knowledge documents." });
    }
  }

  if (req.method === "POST") {
    try {
      const { action, title, fileName, fileBase64 } = req.body || {};

      // Quick re-seed action
      if (action === "reseed_default") {
        await seedCompanyKnowledgeBase();
        const docs = await prisma.chatKnowledgeDoc.findMany({
          include: { _count: { select: { chunks: true } } },
          orderBy: { createdAt: "desc" },
        });
        return res.status(200).json({
          success: true,
          message: "Company knowledge base documents successfully seeded & indexed.",
          data: docs,
        });
      }

      if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ success: false, error: "Document title is required." });
      }

      if (!fileBase64 || typeof fileBase64 !== "string") {
        return res.status(400).json({ success: false, error: "PDF file content is required." });
      }

      const cleanFileName = (fileName || `${title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`).replace(/\s+/g, "_");
      if (!cleanFileName.toLowerCase().endsWith(".pdf")) {
        return res.status(400).json({ success: false, error: "Only PDF documents are supported." });
      }

      // Decode base64
      const base64Data = fileBase64.replace(/^data:application\/pdf;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      if (buffer.length < 50) {
        return res.status(400).json({ success: false, error: "Invalid PDF file data." });
      }

      // Save file to public/documents/company/
      const uploadDir = path.join(process.cwd(), "public", "documents", "company");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const targetPath = path.join(uploadDir, cleanFileName);
      fs.writeFileSync(targetPath, buffer);

      // Extract text with PDF parser
      const parsed = await extractTextFromPdf(buffer);
      if (!parsed.text || parsed.text.trim().length < 10) {
        return res.status(400).json({
          success: false,
          error: "Could not extract readable text from the provided PDF document.",
        });
      }

      const fileUrl = `/documents/company/${cleanFileName}`;

      // Save document record
      const doc = await prisma.chatKnowledgeDoc.create({
        data: {
          title: title.trim(),
          fileName: cleanFileName,
          fileUrl,
          fileSize: buffer.length,
          pageCount: parsed.totalPages || 1,
          extractedText: parsed.text,
          isActive: true,
        },
      });

      // Generate & save RAG chunks
      const chunks = chunkDocumentText(parsed.text, title.trim());
      for (let i = 0; i < chunks.length; i++) {
        await prisma.chatDocChunk.create({
          data: {
            documentId: doc.id,
            chunkIndex: i,
            content: chunks[i].content,
            metadata: chunks[i].metadata,
          },
        });
      }

      return res.status(201).json({
        success: true,
        data: {
          ...doc,
          _count: { chunks: chunks.length },
        },
        message: `Successfully uploaded and indexed "${title}" (${chunks.length} chunks generated).`,
      });
    } catch (error) {
      console.error("Error uploading knowledge document:", error);
      return res.status(500).json({ success: false, error: "Failed to upload knowledge document." });
    }
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
