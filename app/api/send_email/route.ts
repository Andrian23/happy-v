"use server"

import { NextApiRequest } from "next"
import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request | NextRequest) {
  const { fullName, email, phoneNumber, subject, message } = req.body as NextApiRequest["body"]

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Переконайтеся, що ці змінні правильно встановлені
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "maclsikgamedevstudio@gmail.com",
    subject: `New Contact from ${fullName}`,
    text: `Name: ${fullName}\nEmail: ${email}\nPhone: ${phoneNumber}\nSubject: ${subject}\nMessage: ${message}`,
  }

  try {
    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to send email:", error)
    return NextResponse.json({ success: false })
  }
}
