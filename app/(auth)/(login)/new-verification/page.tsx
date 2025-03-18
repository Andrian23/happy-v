"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { BeatLoader } from "react-spinners"

import { newVerification } from "@/actions/newVerification"
import { FormError } from "@/components/FormError"
import { FormSuccess } from "@/components/FormSuccess"

const NewVerificationPageContent = () => {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const onSubmit = useCallback(() => {
    if (success || error) return

    if (!token) {
      setError("Missing token!")
      return
    }

    newVerification(token)
      .then((data) => {
        setError(data.error)
        setSuccess(data.success)
      })
      .catch(() => {
        setError("Something went wrong!")
      })
  }, [token, success, error])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <div className="h-full w-full">
      <div className="flex h-[80vh] w-full flex-col items-center justify-center">
        {!success && !error && <BeatLoader />}

        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
        <Link
          href="/sign-in"
          className="mt-[22px] cursor-pointer rounded-full border border-grey-400 px-[32px] py-[8px] text-center text-sm font-normal text-primary-900"
        >
          Back to Home Page
        </Link>
      </div>
    </div>
  )
}

const NewVerificationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewVerificationPageContent />
    </Suspense>
  )
}

export default NewVerificationPage
