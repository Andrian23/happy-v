"use client"

import React from "react"
import Link from "next/link"

import { ContactCard } from "@/components/ContactCard"
import { ContactForm, type ContactFormData } from "@/components/forms/ContactForm"
import PageTopic from "@/components/PageTopic"
import emailContactIcon from "@/public/Email_contact.svg"
import faqContactIcon from "@/public/FAQ_contact.svg"
import telephoneContactIcon from "@/public/Telephone_contact.svg"

const ContactPage = () => {
  const handleSubmit = async (contactData: ContactFormData) => {
    try {
      const response = await fetch("/api/send_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })

      const data = await response.json()
      if (data.success) {
        alert("Email sent successfully!")
      } else {
        alert("Failed to send email.")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Error sending email.")
    }
  }

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <div className="hidden lg:block">
        <PageTopic name="Contact Us" description="We are always here to answer your questions" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-flow-col lg:grid-cols-5 lg:gap-x-28">
        <div className="grid gap-1 lg:col-span-3">
          <div className="mb-2 text-xl font-semibold text-primary-900">Have a questions?</div>
          <div className="mb-1 text-sm font-normal text-primary-900">
            You can contact us in one of the following ways. We&apos;re here
          </div>
          <div className="mb-1 text-sm font-medium text-primary-900">Monday to Friday 9am - 5pm EST</div>
          <div className="text-sm font-medium text-primary-900">Weekends 10am - 3pm EST</div>
        </div>

        <ContactForm onSubmit={handleSubmit} className="lg:col-span-3" />

        <ContactCard
          title="FAQ page"
          icon={faqContactIcon}
          alt="question mark icon"
          className="max-lg:row-start-2 lg:col-span-2 lg:col-start-4"
        >
          Before contacting us, visit our{" "}
          <Link href="/faqs" className="whitespace-nowrap font-medium text-primary-500 hover:text-primary-600">
            FAQ page
          </Link>{" "}
          to see if your question can be answered.
        </ContactCard>

        <div className="grid h-fit gap-5 lg:col-span-2 lg:col-start-4">
          <ContactCard title="Email Us" icon={emailContactIcon} alt="mail icon">
            We lover to hear from you. Shoot us an email at{" "}
            <Link href="mailto:hello@happyv.com" className="font-medium text-primary-500 hover:text-primary-600">
              hello@happyv.com
            </Link>{" "}
            we will reply with in 24 business hours.
          </ContactCard>

          <ContactCard title="Call us" icon={telephoneContactIcon} alt="phone icon">
            Want to talk a customer service rep? Call us at{" "}
            <Link
              href="tel:+18312083459"
              className="whitespace-nowrap font-medium text-primary-500 hover:text-primary-600"
            >
              +1 (831) 208-3459
            </Link>{" "}
            during our business hours.
          </ContactCard>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
