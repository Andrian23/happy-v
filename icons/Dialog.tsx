import { FC } from "react"

interface DialogProps {
  className: string
}

const Dialog: FC<DialogProps> = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_3301_82936)">
      <path d="M6.75 7.875H11.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.75 10.125H11.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5.61944 14.8436C7.03731 15.6642 8.70523 15.9411 10.3122 15.6228C11.9192 15.3045 13.3556 14.4126 14.3536 13.1134C15.3515 11.8143 15.843 10.1965 15.7363 8.56178C15.6296 6.92704 14.932 5.3869 13.7736 4.2285C12.6152 3.07011 11.075 2.37252 9.4403 2.26581C7.80556 2.1591 6.1878 2.65054 4.88864 3.64851C3.58948 4.64648 2.69759 6.08286 2.37927 7.68985C2.06094 9.29685 2.33789 10.9648 3.1585 12.3826L2.27889 15.0088C2.24584 15.1079 2.24104 15.2143 2.26504 15.316C2.28904 15.4176 2.34088 15.5106 2.41475 15.5845C2.48863 15.6584 2.58162 15.7102 2.6833 15.7342C2.78499 15.7582 2.89134 15.7534 2.99045 15.7204L5.61944 14.8436Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_3301_82936">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default Dialog
