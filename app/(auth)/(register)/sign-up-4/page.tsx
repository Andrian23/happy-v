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
import { Info } from "@/icons/Info"

const SignUpSecondPage = () => {
  const router = useRouter()
  const [isPending] = useTransition()

  const [error, setError] = useState<string | undefined>("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [success, setSuccess] = useState<string | undefined>("")

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState({})
  const [fileName, setFileName] = useState("")
  const [fileUploaded, setFileUploaded] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedData = localStorage.getItem("formData")
    const initialFormData = storedData ? JSON.parse(storedData) : {}
    setFormData(initialFormData)
  }, [])

  const form = useForm()

  const onSubmit = () => {
    localStorage.setItem("fileName", fileName)
    localStorage.removeItem("formData")

    if (fileName) {
      router.push("/sign-up-success")
    } else {
      setError("Credentials is required")
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError("")
    if (!event.target.files || event.target.files.length === 0) {
      toast({ title: "Failed to upload file" })
      setFileUploaded(false)
      return
    }
    const file = event.target.files[0]
    console.log(file.name)
    setFileUploaded(true)
  }

  return (
    <SignUpLayout currentStep={3}>
      <div className="text-primary-900 text-center text-[32px] font-bold">Upload credentials</div>
      <div className="text-grey-800 mt-[8px] text-center text-sm">
        To confirm your professional background, please upload your credentials. This helps us ensure we’re partnering
        with qualified experts.
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-0 mt-[24px] block w-full lg:mx-auto">
          <div className="mx-auto mb-[24px] block w-full">
            <AuthFileInput
              onChange={handleFileChange}
              fileName={fileName}
              setFileName={setFileName}
              disabled={isPending}
            />
          </div>

          <div className="text-primary-900 mt-3 text-left text-sm font-normal">
            <span className="font-semibold">For licensed healthcare practitioner:</span> Healthcare license or
            registration (with name and expiry)
          </div>
          <div className="text-primary-900 mt-3 text-left text-sm font-normal">
            <span className="font-semibold">If you are not licensed healthcare practitioner: </span> Healthcare degree,
            diploma, certificate, etc.
          </div>

          <div className="bg-grey-200 text-primary-900 mt-6 flex justify-items-start gap-2 rounded-lg p-[16px] text-sm">
            <div>
              <Info className="h-5 w-5" />
            </div>
            Once you submit your credentials, Happy V will review them, usually this will take up to 2 business days,
            and then we will notify you of the result to the email address you provided
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            variant="primary"
            disabled={isPending || !fileUploaded}
            className="bg-primary-900 hover:bg-primary-900/80 mt-6 w-full"
          >
            Submit & Create account
          </Button>
        </form>
      </Form>
    </SignUpLayout>
  )
}

export default SignUpSecondPage
