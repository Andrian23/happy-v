"use server"

import { Prisma, User } from "@prisma/client"

import { auth } from "@/auth"
import { Pagination } from "@/interfaces/pagination"
import { db } from "@/lib/db"
import { serverPusher } from "@/lib/pusher"
import { PartnerStatus, VerificationUserStatus } from "@/models/participants"

interface UsersResponse<T> {
  users: T[]
  pagination: Pagination
}

export async function getParticipants({
  verificationStatus,
  partnerStatus,
  searchTerm,
  page = 1,
  limit = 10,
}: {
  page?: number
  limit?: number
  verificationStatus?: VerificationUserStatus
  partnerStatus?: PartnerStatus
  searchTerm?: string
}): Promise<UsersResponse<Partial<User>>> {
  const skip = (page - 1) * limit

  type PartialWhere = {
    role: string
    verificationStatus?: unknown
    partnerStatus?: unknown
    OR?: Array<{
      name?: { contains: string; mode: "insensitive" }
      lastName?: { contains: string; mode: "insensitive" }
      email?: { contains: string; mode: "insensitive" }
    }>
  }

  const whereObj: PartialWhere = {
    role: "USER",
  }

  if (verificationStatus) {
    whereObj.verificationStatus = verificationStatus
  }

  if (partnerStatus) {
    whereObj.partnerStatus = partnerStatus
  }

  if (searchTerm) {
    whereObj.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { lastName: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
      // { npiNumber: { contains: searchTerm, mode: "insensitive" } },
    ]
  }

  const where = whereObj as unknown as Prisma.UserWhereInput

  try {
    const [users, totalCount] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
          telephone: true,
          npiNumber: true,
          type_proffesion: true,
          place_work: true,
          signUpStep3Completed: true,
          signUpStep4Completed: true,
          verificationStatus: true,
          verificationDate: true,
          partnerStatus: true,
          partnerStatusDate: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ])

    return {
      users,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        page,
        limit,
      },
    }
  } catch (error) {
    console.error("Failed to fetch users:", error)
    throw new Error("Failed to fetch users")
  }
}

async function updateUserStatus<T extends VerificationUserStatus | PartnerStatus>({
  userId,
  status,
  notes,
  isPartnerStatus = false,
}: {
  userId: string
  status: T
  notes?: string
  isPartnerStatus?: boolean
}): Promise<{
  success: boolean
  message: string
}> {
  try {
    const session = await auth()
    const adminId = session?.user.id

    if (!adminId) {
      throw new Error("Admin user not found")
    }

    const updateData = isPartnerStatus
      ? {
          partnerStatus: status,
          partnerStatusDate: new Date(),
          partnerNotes: notes ?? null,
          partnerReviewedBy: adminId ?? null,
        }
      : {
          verificationStatus: status,
          verificationDate: new Date(),
          verificationNotes: notes ?? null,
          verifiedBy: adminId ?? null,
        }

    const data = updateData as unknown as Prisma.UserUpdateInput

    await db.user.update({
      where: { id: userId },
      data,
    })

    await serverPusher.trigger("admin-dashboard", "counts-updated", {
      message: `User status updated`,
      updatedByAdminId: adminId || "unknown",
    })

    const statusType = isPartnerStatus ? "partner" : "approval"

    return {
      success: true,
      message: `User ${statusType} status successfully updated to ${status}`,
    }
  } catch (error) {
    console.error(`Failed to update user status:`, error)
    return {
      success: false,
      message: `Failed to update user status.`,
    }
  }
}

export async function updateUserVerificationStatus(
  userId: string,
  status: VerificationUserStatus,
  notes?: string
): Promise<{
  success: boolean
  message: string
}> {
  return updateUserStatus({
    userId,
    status,
    notes,
    isPartnerStatus: false,
  })
}

export async function updatePartnerStatus(
  userId: string,
  status: PartnerStatus,
  notes?: string
): Promise<{
  success: boolean
  message: string
}> {
  return updateUserStatus({
    userId,
    status,
    notes,
    isPartnerStatus: true,
  })
}
