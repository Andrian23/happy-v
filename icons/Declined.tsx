import { FC } from "react"

interface DeclinedProps {
  className: string
}

const Declined: FC<DeclinedProps> = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_445_36112)">
      <path d="M10 6L6 10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L10 10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_445_36112">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default Declined
