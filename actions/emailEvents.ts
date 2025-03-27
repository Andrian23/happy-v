"use server"

const sendKlaviyoEvent = async (
  eventData: {
    data: {
      type: string
      attributes: {
        metric: {
          data: {
            type: string
            attributes: {
              name: string
            }
          }
        }
        profile: {
          data: {
            type: string
            attributes: {
              email: string
              first_name?: string
              last_name?: string
              phone_number?: string
            }
          }
        }
        properties: {
          [key: string]: string
          timestamp: string
        }
      }
    }
  },
  eventName: string
) => {
  try {
    const response = await fetch("https://a.klaviyo.com/api/events/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Klaviyo-API-Key ${process.env.NEXT_PUBLIC_KLAVIYO_API_KEY}`,
        revision: "2024-10-15",
      },
      body: JSON.stringify(eventData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Failed to send ${eventName} via Klaviyo: ${JSON.stringify(errorData)}`)
    }
  } catch (error) {
    console.error(`Error sending ${eventName}:`, error)
    throw new Error(`Error sending ${eventName}`)
  }
}

const createEventData = (
  email: string,
  metricName: string,
  properties: Record<string, string>,
  profile?: { first_name?: string; last_name?: string; phone_number?: string }
) => ({
  data: {
    type: "event",
    attributes: {
      profile: {
        data: {
          type: "profile",
          attributes: {
            email,
            ...profile,
          },
        },
      },
      metric: {
        data: {
          type: "metric",
          attributes: {
            name: metricName,
          },
        },
      },
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
      },
    },
  },
})

export const sendVerificationEmail = async ({
  email,
  token,
  name,
  lastName,
  telephone,
}: {
  email: string
  token: string
  name: string
  lastName: string
  telephone: string
}) => {
  const confirmLink = `https://pro.happyv.com/new-verification?token=${token}`

  const eventData = createEventData(
    email,
    "Verification Email Sent",
    { confirm_link: confirmLink },
    { first_name: name, last_name: lastName, phone_number: telephone }
  )

  await sendKlaviyoEvent(eventData, "verification email")
}

export const sendPasswordResetEmail = async ({ email, token }: { email: string; token: string }) => {
  const resetLink = `https://pro.happyv.com/new-password?token=${token}`

  const eventData = createEventData(email, "Password Reset Email Sent", { reset_link: resetLink })

  await sendKlaviyoEvent(eventData, "password reset email")
}

export const sendProfileUpdateEmail = async ({ email, message }: { email: string; message: string }) => {
  const eventData = createEventData(email, "Profile Update Email Sent", { message })

  await sendKlaviyoEvent(eventData, "profile update email")
}

export const sendLoginNotification = async ({ email }: { email: string }) => {
  const eventData = createEventData(email, "Login Notification Sent", {
    message: `${email} has successfully logged in.`,
  })

  await sendKlaviyoEvent(eventData, "login notification")
}

export const sendInactivityNotification = async ({
  email,
  name,
  lastName,
  lastActiveDate,
  daysInactive,
}: {
  email: string
  name?: string
  lastName?: string
  lastActiveDate: string
  daysInactive: number
}) => {
  const eventData = createEventData(
    email,
    "Inactivity Notification Email Sent",
    {
      last_active_date: lastActiveDate,
      days_inactive: daysInactive.toString(),
      message: `We haven't seen you in ${daysInactive} days!`,
    },
    { first_name: name, last_name: lastName }
  )

  await sendKlaviyoEvent(eventData, "inactivity notification")
}
