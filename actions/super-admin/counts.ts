"use server"

import { db } from "@/lib/db"

export async function getAmbassadorCounts() {
  try {
    const [
      pendingReviewAmbassadors,
      activeAmbassadors,
      declinedRequestsAmbassadors,
      pendingReviewPartners,
      activePartners,
      declinedRequestsPartners,
    ] = await Promise.all([
      db.user.count({
        where: {
          role: "USER",
          verificationStatus: "PENDING_REVIEW",
        },
      }),
      db.user.count({
        where: {
          role: "USER",
          verificationStatus: "ACTIVE",
        },
      }),
      db.user.count({
        where: {
          role: "USER",
          verificationStatus: "DECLINED",
        },
      }),

      db.user.count({
        where: {
          role: "USER",
          partnerStatus: "PENDING_REVIEW",
        },
      }),
      db.user.count({
        where: {
          role: "USER",
          partnerStatus: "ACTIVE",
        },
      }),
      db.user.count({
        where: {
          role: "USER",
          partnerStatus: "DECLINED",
        },
      }),
    ])

    return {
      pendingReviewAmbassadors,
      activeAmbassadors,
      declinedRequestsAmbassadors,
      pendingReviewPartners,
      activePartners,
      declinedRequestsPartners,
    }
  } catch (error) {
    console.error("Failed to fetch counts:", error)
    throw new Error("Failed to fetch counts")
  }
}
