"use client"

import { ChangeEvent, startTransition, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
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

const SignUpSecondPage = () => {
  const router = useRouter()
  const [isPending] = useTransition()

  const [error, setError] = useState<string | undefined>("")

  const [success, setSuccess] = useState<string | undefined>("")

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState({})
  const [fileName, setFileName] = useState("")
  const [fileUploaded, setFileUploaded] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isNpiVerified, setIsNpiVerified] = useState(false)
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
    setIsNpiVerified(false)

    if (!fileName) {
      setError("Credentials file is required")
      setIsVerifying(false)
      return
    }

    try {
      const verificationResult = await verifyNPI(values.npi_number)

      if (!verificationResult.isVerified) {
        setError(`NPI verification failed: ${verificationResult.error}`)
        setIsVerifying(false)
        return
      }

      setIsNpiVerified(true)

      localStorage.setItem("fileName", fileName)
      localStorage.removeItem("formData")

      startTransition(async () => {
        await updateUser({
          signUpStep4Completed: true,
        }).then((data) => handleResponse(data))
      })
    } catch (err) {
      console.error("Verification error:", err)
      setError("An error occurred during verification. Please try again.")
      setIsVerifying(false)
    }
  }

  const handleResponse = (data: { success?: string; user?: User; error?: string }) => {
    setError(data.error)
    setSuccess(data.success)
    if (data.success && isNpiVerified && sessionData && sessionData.user) {
      update({
        data: {
          ...sessionData,
          user: { ...sessionData?.user, signUpStep4Completed: true },
        },
      }).then(() => router.push("/sign-up-success"))
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

          <div className="bg-grey-200 text-primary-900 mt-6 flex justify-items-start gap-2 rounded-lg p-[16px] text-sm">
            <div>
              <Info className="h-5 w-5" />
            </div>
            Once you submit your credentials, Happy V will review them, usually this will take up to 2 business days,
            and then we will notify you of the result to the email address you provided
          </div>
          <FormField
            control={form.control}
            name="npi_number"
            render={({ field }) => (
              <FormItem className="my-5">
                <FormLabel>NPI Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your 10-digit NPI number" {...field} disabled={isPending || isVerifying} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            variant="primary"
            disabled={isPending || !fileUploaded || isVerifying}
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
