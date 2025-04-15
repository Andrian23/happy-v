import { FC } from "react"

interface LogoutProps {
  className: string
}

const Logout: FC<LogoutProps> = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.875 2.8125H3.375V15.1875H7.875" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.875 9H15.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.9375 6.1875L15.75 9L12.9375 11.8125" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default Logout
