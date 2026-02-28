import * as fs from "node:fs";
import * as path from "node:path";
import { getConfig } from "../config.js";

const BASE_URL = "https://api.printful.com";
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg"];

interface PrintfulFile {
  id: number;
  type: string;
  hash: string;
  url: string;
  filename: string;
  mime_type: string;
  size: number;
  width: number;
  height: number;
  dpi: number | null;
  status: string;
  created: number;
  thumbnail_url: string;
  preview_url: string;
  visible: boolean;
  is_temporary: boolean;
}

export async function uploadFile(filePath: string): Promise<PrintfulFile> {
  const ext = path.extname(filePath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(
      `Unsupported file type "${ext}". Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
    );
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const { token, storeId } = getConfig();
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  // Build multipart form data manually using built-in APIs
  const boundary = `----FormBoundary${Date.now()}`;
  const parts: Buffer[] = [];

  // type field
  parts.push(
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="type"\r\n\r\ndefault\r\n`
    )
  );

  // file field
  const mimeType =
    ext === ".png"
      ? "image/png"
      : ext === ".svg"
        ? "image/svg+xml"
        : "image/jpeg";
  parts.push(
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: ${mimeType}\r\n\r\n`
    )
  );
  parts.push(fileBuffer);
  parts.push(Buffer.from("\r\n"));

  // closing boundary
  parts.push(Buffer.from(`--${boundary}--\r\n`));

  const body = Buffer.concat(parts);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
  };
  if (storeId) {
    headers["X-PF-Store-Id"] = storeId;
  }

  const res = await fetch(`${BASE_URL}/files`, {
    method: "POST",
    headers,
    body,
  });

  const json = (await res.json()) as {
    code: number;
    result: PrintfulFile;
    error?: { message?: string };
  };

  if (!res.ok) {
    const msg =
      json.error?.message ||
      (json as unknown as { result?: string }).result ||
      `HTTP ${res.status}`;
    throw new Error(`File upload failed: ${msg}`);
  }

  const file = json.result;

  // Poll until file is processed
  const startTime = Date.now();
  const TIMEOUT_MS = 60_000;

  while (file.status !== "ok") {
    if (Date.now() - startTime > TIMEOUT_MS) {
      throw new Error(
        `File processing timed out after 60s (status: ${file.status})`
      );
    }
    await new Promise((r) => setTimeout(r, 2000));

    const pollHeaders: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };
    if (storeId) {
      pollHeaders["X-PF-Store-Id"] = storeId;
    }
    const pollRes = await fetch(`${BASE_URL}/files/${file.id}`, {
      headers: pollHeaders,
    });
    const pollJson = (await pollRes.json()) as {
      code: number;
      result: PrintfulFile;
    };

    if (!pollRes.ok) {
      throw new Error(`File status check failed: HTTP ${pollRes.status}`);
    }

    file.status = pollJson.result.status;
    Object.assign(file, pollJson.result);
  }

  return file;
}
