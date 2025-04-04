import { Prisma } from "@prisma/client"

import { db } from "@/lib/db"
import { ApprovalUserStatus, PartnerStatus } from "@/models/participants"

export async function getParticipants({
  approvalStatus,
  partnerStatus,
  searchTerm,
  page = 1,
  limit = 10,
}: {
  page?: number
  limit?: number
  approvalStatus?: ApprovalUserStatus
  partnerStatus?: PartnerStatus
  searchTerm?: string
}) {
  const skip = (page - 1) * limit

  const where: Prisma.UserWhereInput = {
    role: "USER",
  }

  if (approvalStatus) {
    where.approvalStatus = approvalStatus as unknown as Prisma.UserWhereInput["approvalStatus"]
  }

  if (partnerStatus) {
    where.partnerStatus = partnerStatus as unknown as Prisma.UserWhereInput["partnerStatus"]
  }

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { lastName: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
      // { npiNumber: { contains: searchTerm, mode: "insensitive" } },
    ]
  }

  try {
    const users = await db.user.findMany({
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
        approvalStatus: true,
        approvalStatusUpdatedAt: true,
        partnerStatus: true,
        partnerStatusUpdatedAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    const totalCount = await db.user.count({ where })

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

export async function updateUserApprovalStatus(
  userId: string,
  status: ApprovalUserStatus,
  notes?: string,
  adminId?: string
): Promise<{
  success: boolean
  message: string
}> {
  try {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        approvalStatus: status,
        approvalStatusUpdatedAt: new Date(),
        approvalNotes: notes || null,
        approvedBy: adminId,
      },
    })

    return {
      success: true,
      message: `User approval status successfully updated to ${status}`,
    }
  } catch (error) {
    console.error("Failed to update user approval status:", error)
    return {
      success: false,
      message: "Failed to update user approval status.",
    }
  }
}

export async function updatePartnerStatus(
  doctorId: string,
  status: PartnerStatus,
  notes?: string,
  adminId?: string
): Promise<{
  success: boolean
  message: string
}> {
  try {
    await db.user.update({
      where: {
        id: doctorId,
      },
      data: {
        partnerStatus: status,
        partnerStatusUpdatedAt: new Date(),
        partnerApprovalNotes: notes || null,
        partnerApprovedBy: adminId,
      },
    })

    return {
      success: true,
      message: `User partner status successfully updated to ${status}`,
    }
  } catch (error) {
    console.error("Failed to update user partner status:", error)
    return {
      success: false,
      message: "Failed to update user partner status.",
    }
  }
}
