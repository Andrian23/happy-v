import { NextRequest } from "next/server"
import crypto from "crypto"

export async function verifyShopifyWebhook(req: NextRequest): Promise<boolean> {
  try {
    const hmacHeader = req.headers.get("x-shopify-hmac-sha256")
    const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET

    if (!hmacHeader || !shopifySecret) {
      console.error("Missing HMAC header or Shopify secret")
      return false
    }

    const clonedReq = req.clone()
    const body = await clonedReq.text()

    const hash = crypto.createHmac("sha256", shopifySecret).update(body, "utf8").digest("base64")

    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader))
  } catch (error) {
    console.error("Error verifying Shopify webhook:", error)
    return false
  }
}
