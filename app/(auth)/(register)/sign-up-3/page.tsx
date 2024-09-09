"use client"

import { ChangeEvent, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import AuthFileInput from "@/components/AuthFileInput"
import { FormError } from "@/components/FormError"
import { FormSuccess } from "@/components/FormSuccess"
import { SignUpLayout } from "@/components/SignUpLayout"
import { Button } from "@/components/ui/Button"
import { Form } from "@/components/ui/Form"
import { useToast } from "@/components/ui/useToast"

const SignUpSecondPage = () => {
  const router = useRouter()
  const [isPending] = useTransition()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | undefined>("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [success, setSuccess] = useState<string | undefined>("")

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState({}) // Initialize formData as an empty object
  const [fileName, setFileName] = useState("")
  const [fileUploaded, setFileUploaded] = useState(false) // Track if a file is uploaded
  const { toast } = useToast()

  useEffect(() => {
    const storedData = localStorage.getItem("formData") // Access localStorage only after component mounts
    const initialFormData = storedData ? JSON.parse(storedData) : {}
    setFormData(initialFormData)
  }, [])

  const form = useForm()

  const onSubmit = () => {
    localStorage.setItem("fileName", fileName)
    router.push("/sign-up-review")
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      toast({ title: "Failed to upload file" })
      setFileUploaded(false) // No file uploaded
      return
    }
    const file = event.target.files[0]
    console.log(file.name)
    setFileUploaded(true) // File uploaded
  }

  return (
    <SignUpLayout currentStep={2}>
      <div className="text-center text-[32px] font-bold text-primary-900">Upload your professional credentials</div>
      <div className="mt-[8px] text-sm text-grey-800">Access your account after confirming your credentials</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto mt-[32px] block w-[90%]">
          <div className="mx-auto mb-[24px] mt-[32px] block w-full">
            <AuthFileInput
              onChange={handleFileChange}
              fileName={fileName}
              setFileName={setFileName}
              disabled={isPending}
            />
          </div>

          <div className="mt-3 text-left text-sm font-normal text-primary-900">
            <span className="font-semibold">For licensed healthcare practitioner:</span> Healthcare license or
            registration (with name and expiry)
          </div>
          <div className="mt-3 text-left text-sm font-normal text-primary-900">
            <span className="font-semibold">If you are not licensed healthcare practitioner: </span> Healthcare degree,
            diploma, certificate, etc.
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" variant="primary" disabled={isPending || !fileUploaded} className="mt-6 w-full">
            Continue to Terms Review
          </Button>
        </form>
      </Form>
    </SignUpLayout>
  )
}

export default SignUpSecondPage
