import { FC } from "react"

interface RegistrationProps {
  className: string
}

const Registration: FC<RegistrationProps> = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_446_35262)">
      <path
        d="M5.625 10.125C7.1783 10.125 8.4375 8.8658 8.4375 7.3125C8.4375 5.7592 7.1783 4.5 5.625 4.5C4.0717 4.5 2.8125 5.7592 2.8125 7.3125C2.8125 8.8658 4.0717 10.125 5.625 10.125Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.25 5.625H17.4375" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.25 9H17.4375" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.9375 12.375H17.4375" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M1.125 13.5C1.62422 11.5594 3.52828 10.125 5.625 10.125C7.72172 10.125 9.62578 11.5594 10.125 13.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_446_35262">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default Registration
