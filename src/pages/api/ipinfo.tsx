// src/pages/api/ipinfo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { IPinfoWrapper } from "node-ipinfo";
import dotenv from "dotenv";

dotenv.config();

const ipinfo = new IPinfoWrapper(process.env.IPINFO_TOKEN as string);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ip = req.query.ip as string;
  try {
    const data = await ipinfo.lookupIp(ip);
    res.status(200).json(data);
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching IP info:", error);
    }
    res.status(500).json({ error: error?.message || "Failed to fetch IP information" });
  }
}
