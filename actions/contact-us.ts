"use server"

export const createTicketAction = async ({
  fullName,
  email,
  message,
  phoneNumber,
  subject,
}: {
  fullName: string
  email: string
  message: string
  phoneNumber?: string
  subject?: string
}) => {
  if (!fullName || !email || !message) {
    return { success: false, message: "fullName, email, and message are required!" }
  }

  try {
    const response = await fetch(`https://${process.env.NEXT_PUBLIC_GORGIAS_DOMAIN}.gorgias.com/api/tickets`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_GORGIAS_EMAIL}:${process.env.NEXT_PUBLIC_GORGIAS_API_KEY}`).toString("base64")}`,
      },
      body: JSON.stringify({
        customer: {
          email,
        },
        messages: [
          {
            channel: "contact_form",
            via: "contact_form",
            from_agent: false,
            body_text: `
              Full Name: ${fullName}
              Email: ${email}
              Phone Number: ${phoneNumber}
              Subject: ${subject}
              Message: ${message}
            `,
            sender: {
              email: email,
            },
            source: {
              type: "contact-form",
              from: {
                name: fullName,
                address: email,
              },
            },
          },
        ],
      }),
    })

    if (response.ok) {
      const responseData = await response.json()
      return { success: true, data: responseData }
    } else {
      const errorData = await response.json()
      return { success: false, message: `Failed to create ticket: ${JSON.stringify(errorData)}` }
    }
  } catch (error) {
    console.error("Error in createTicketAction:", error)
    return { success: false, message: "Error creating ticket." }
  }
}
