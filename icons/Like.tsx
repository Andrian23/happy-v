import { FC } from "react"

interface LikeProps {
  className: string
}

const Like: FC<LikeProps> = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_3301_82945)">
      <path
        d="M2.25 7.3125H5.625V14.625H2.25C2.10082 14.625 1.95774 14.5657 1.85225 14.4602C1.74676 14.3548 1.6875 14.2117 1.6875 14.0625V7.875C1.6875 7.72582 1.74676 7.58274 1.85225 7.47725C1.95774 7.37176 2.10082 7.3125 2.25 7.3125Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.625 7.3125L8.4375 1.6875C9.03424 1.6875 9.60653 1.92455 10.0285 2.34651C10.4504 2.76847 10.6875 3.34076 10.6875 3.9375V5.625H15.1875C15.3471 5.62504 15.5048 5.65904 15.6503 5.72473C15.7957 5.79042 15.9255 5.8863 16.031 6.006C16.1366 6.1257 16.2154 6.26649 16.2624 6.41901C16.3093 6.57153 16.3233 6.73229 16.3034 6.89062L15.4596 13.6406C15.4254 13.9124 15.2931 14.1624 15.0877 14.3436C14.8822 14.5249 14.6177 14.6249 14.3438 14.625H5.625"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_3301_82945">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default Like
