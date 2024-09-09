"use server"

import { NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function POST(req: Request) {
  const { file, format, type, title } = await req.json()

  const newMarketingAsset = await db.marketingAssets.create({
    data: {
      imageUrl: file,
      format,
      type,
      title,
    },
  })

  return NextResponse.json({ newMarketingAsset }, { status: 200 })
}
