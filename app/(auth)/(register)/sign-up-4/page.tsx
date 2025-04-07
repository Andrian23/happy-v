"use client"

import { ChangeEvent, startTransition, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { getSession, useSession } from "next-auth/react"
import { useForm } from "react-hook-form"

import { updateUser } from "@/actions/user"
import AuthFileInput from "@/components/AuthFileInput"
import { FormError } from "@/components/FormError"
import { FormSuccess } from "@/components/FormSuccess"
import { SignUpLayout } from "@/components/SignUpLayout"
import { Button } from "@/components/ui/Button"
import { Form } from "@/components/ui/Form"
import { useToast } from "@/components/ui/useToast"
import { Info } from "@/icons/Info"

import { UpdateResponse } from "../sign-up-3/page"

const SignUpSecondPage = () => {
  const router = useRouter()
  const [isPending] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState({})
  const [fileName, setFileName] = useState("")
  const [fileUploaded, setFileUploaded] = useState(false)
  const { toast } = useToast()
  const { data: sessionData, update } = useSession()

  useEffect(() => {
    const storedData = localStorage.getItem("formData")
    const initialFormData = storedData ? JSON.parse(storedData) : {}
    setFormData(initialFormData)
  }, [])

  const form = useForm()

  const onSubmit = async () => {
    localStorage.setItem("fileName", fileName)
    localStorage.removeItem("formData")

    if (fileName) {
      startTransition(async () => {
        await updateUser({ signUpStep4Completed: true }).then((data) => handleResponse(data as UpdateResponse))
      })
    } else {
      setError("Credentials is required")
    }
  }

  const handleResponse = (data: UpdateResponse) => {
    setError(data.error)
    setSuccess(data.success)
    if (data.success) {
      checkAndUpdateSession()
    }
  }

  const checkAndUpdateSession = async () => {
    const session = await getSession()

    if (session && session.user) {
      update({
        data: {
          ...sessionData,
          user: { ...sessionData?.user, signUpStep4Completed: true },
        },
      }).then(() => router.push("/sign-up-success"))
    } else {
      console.error("Failed to retrieve valid session after retry.")
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
      <div className="text-primary-900 text-center text-3xl font-bold">Upload credentials</div>
      <div className="text-grey-800 mt-2 text-center text-sm">
        To confirm your professional background, please upload your credentials. This helps us ensure we’re partnering
        with qualified experts.
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-0 mt-6 block w-full lg:mx-auto">
          <div className="mx-auto mb-6 block w-full">
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

          <div className="bg-grey-200 text-primary-900 mt-6 flex justify-items-start gap-2 rounded-lg p-4 text-sm">
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
