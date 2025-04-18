import { FC } from "react"

interface PillProps {
  className: string
}

const Pill: FC<PillProps> = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_3301_82919)">
      <path
        d="M10.316 3.18201L3.17945 10.3186C1.93694 11.5611 1.93694 13.5756 3.17945 14.8181L3.17994 14.8186C4.42245 16.0611 6.43696 16.0611 7.67946 14.8186L14.8161 7.68203C16.0586 6.43952 16.0586 4.42502 14.8161 3.18251L14.8156 3.18201C13.573 1.93951 11.5585 1.93951 10.316 3.18201Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.75 6.75L11.25 11.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_3301_82919">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default Pill
