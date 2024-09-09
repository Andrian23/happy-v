import React, { useEffect, useState } from "react" // Замініть на вірний шлях до вашої функції

import { findUserById } from "@/actions/user"
import type { User } from "@/models/user"

interface CommunityPageUserDetailsProps {
  userId: string
}

const CommunityPageUserDetails: React.FC<CommunityPageUserDetailsProps> = ({ userId }) => {
  const [userDetails, setUserDetails] = useState<User | null>()

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await findUserById()
        setUserDetails(userData)
      } catch (error) {
        console.error("Failed to fetch user details", error)
      }
    }

    if (userId) {
      fetchUserDetails()
    }
  }, [userId])

  return (
    <div className="text-sm text-primary-900">
      {userDetails ? `${userDetails.name} ${userDetails.lastName} · ${userDetails.type_proffesion}` : "Loading..."}
    </div>
  )
}

export default CommunityPageUserDetails
