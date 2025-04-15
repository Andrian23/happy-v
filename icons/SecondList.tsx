import { FC } from "react"

interface SecondListProps {
  className: string
}

const SecondList: FC<SecondListProps> = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_3301_82924)">
      <path d="M6.75 4.5H15.1875" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.75 9H15.1875" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.75 13.5H15.1875" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.8125 4.5H3.9375" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.8125 9H3.9375" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.8125 13.5H3.9375" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_3301_82924">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default SecondList
