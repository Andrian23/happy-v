"use client"

import { ChangeEvent, startTransition, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { getSession, useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { updateUser } from "@/actions/user"
import { verifyNPI } from "@/actions/verifyNPI"
import AuthFileInput from "@/components/AuthFileInput"
import { FormError } from "@/components/FormError"
import { FormSuccess } from "@/components/FormSuccess"
import { SignUpLayout } from "@/components/SignUpLayout"
import { Button } from "@/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { useToast } from "@/components/ui/useToast"
import { Info } from "@/icons/Info"
import { NPISchema } from "@/schemas"

import { UpdateResponse } from "../sign-up-3/page"

const SignUpStepFourPage = () => {
  const router = useRouter()
  const [isPending] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState({})
  const [fileName, setFileName] = useState("")
  const [fileUploaded, setFileUploaded] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()
  const { data: sessionData, update } = useSession()

  useEffect(() => {
    const storedData = localStorage.getItem("formData")
    const initialFormData = storedData ? JSON.parse(storedData) : {}
    setFormData(initialFormData)
  }, [])

  const form = useForm<z.infer<typeof NPISchema>>({
    resolver: zodResolver(NPISchema),
    defaultValues: {
      npi_number: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof NPISchema>) => {
    setError("")
    setSuccess("")
    setIsVerifying(true)

    if ((!values.npi_number || values.npi_number === "") && !fileUploaded) {
      setError("Please either upload a credentials file OR enter your NPI number")
      setIsVerifying(false)
      return
    }

    try {
      let npiNumber = undefined
      let isNpiValid = false

      if (values.npi_number && values.npi_number !== "") {
        const verificationResult = await verifyNPI(values.npi_number)

        if (!verificationResult.isVerified) {
          setError(`NPI verification failed: ${verificationResult.error}`)
          setIsVerifying(false)
          return
        }

        npiNumber = values.npi_number
        isNpiValid = true
      }

      if (fileUploaded) {
        localStorage.setItem("fileName", fileName)
      }

      localStorage.removeItem("formData")

      startTransition(async () => {
        try {
          const data = (await updateUser({
            signUpStep4Completed: true,
            npiNumber: npiNumber,
          })) as UpdateResponse

          await handleResponse(data, isNpiValid || fileUploaded)
        } catch (err) {
          console.error("Update user error:", err)
          setError("An error occurred during user update. Please try again.")
          setIsVerifying(false)
        }
      })
    } catch (err) {
      console.error("Submission error:", err)
      setError("An error occurred during submission. Please try again.")
      setIsVerifying(false)
    }
  }

  const handleResponse = async (data: UpdateResponse, isVerified: boolean) => {
    setIsVerifying(false)
    setError(data.error)
    setSuccess(data.success)

    if (data.success && isVerified) {
      await checkAndUpdateSession()
    }
  }

  const checkAndUpdateSession = async () => {
    try {
      const session = await getSession()

      if (session && session.user) {
        await update({
          data: {
            ...sessionData,
            user: { ...sessionData?.user, signUpStep4Completed: true },
          },
        })
        router.push("/sign-up-success")
      } else {
        console.error("Failed to retrieve valid session.")
        setError("Session validation failed. Please try again or contact support.")
      }
    } catch (err) {
      console.error("Session update error:", err)
      setError("Failed to update session. Please try again.")
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError("")

    if (!event.target.files || event.target.files.length === 0) {
      toast({ title: "Failed to upload file" })
      setFileUploaded(false)
      return
    }

    setFileUploaded(true)
  }

  return (
    <SignUpLayout currentStep={3}>
      <div className="text-primary-900 text-center text-3xl font-bold">Upload credentials</div>
      <div className="text-grey-800 mt-2 text-center text-sm">
        To confirm your professional background, please upload your credentials. This helps us ensure we're partnering
        with qualified experts.
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-0 mt-6 block w-full lg:mx-auto">
          <div className="mx-auto mb-6 block w-full">
            <AuthFileInput
              onChange={handleFileChange}
              fileName={fileName}
              setFileName={setFileName}
              disabled={isPending || isVerifying}
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
          <div className="my-5 flex items-center md:my-6">
            <div className="bg-grey-400 h-px flex-grow" />
            <span className="text-grey-850 mx-3.5 text-sm">or enter your NPI number</span>
            <div className="bg-grey-400 h-px flex-grow" />
          </div>
          <FormField
            control={form.control}
            name="npi_number"
            render={({ field }) => (
              <FormItem className="mb-5 md:mb-6">
                <FormLabel>Your NPI number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your NPI number" {...field} disabled={isPending || isVerifying} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="bg-grey-200 text-primary-900 flex justify-items-start gap-2 rounded-lg p-4 text-sm">
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
            disabled={isPending || isVerifying || (!fileUploaded && !form.watch("npi_number"))}
            className="bg-primary-900 hover:bg-primary-900/80 mt-6 w-full"
          >
            Submit & Create account
          </Button>
        </form>
      </Form>
    </SignUpLayout>
  )
}

export default SignUpStepFourPage
