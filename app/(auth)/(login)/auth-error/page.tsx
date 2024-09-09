import Link from "next/link"

const AuthErrorPage = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center text-center">
    <div className="">Auth Error</div>
    <Link
      href="/sign-in"
      className="mt-[32px] cursor-pointer rounded-full border border-grey-400 px-[22px] py-[8px] text-center text-sm font-normal text-primary-900"
    >
      Back to Home Page
    </Link>
  </div>
)

export default AuthErrorPage
