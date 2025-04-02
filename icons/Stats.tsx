import { FC } from "react"

interface StatsProps {
  className: string
}

const Stats: FC<StatsProps> = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_3301_82913)">
      <path d="M3.375 14.625V9.5625H6.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.75 14.625H2.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.75 14.625V6.1875H10.6875" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.6875 14.625V2.8125H14.625V14.625" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_3301_82913">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default Stats
