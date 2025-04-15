import { FC } from "react"

interface ReviewProps {
  className: string
}

const Review: FC<ReviewProps> = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_445_36092)">
      <path
        d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.5356 10.5352L14 13.9995" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_445_36092">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default Review
