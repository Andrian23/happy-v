import { FC } from "react"

interface ActiveProps {
  className: string
}

const Active: FC<ActiveProps> = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_445_36102)">
      <path
        d="M3.40375 12.5962C2.82875 12.0212 3.21 10.8131 2.9175 10.1056C2.61375 9.375 1.5 8.78125 1.5 8C1.5 7.21875 2.61375 6.625 2.9175 5.89437C3.21 5.1875 2.82875 3.97875 3.40375 3.40375C3.97875 2.82875 5.1875 3.21 5.89437 2.9175C6.62812 2.61375 7.21875 1.5 8 1.5C8.78125 1.5 9.375 2.61375 10.1056 2.9175C10.8131 3.21 12.0212 2.82875 12.5962 3.40375C13.1712 3.97875 12.79 5.18687 13.0825 5.89437C13.3863 6.62812 14.5 7.21875 14.5 8C14.5 8.78125 13.3863 9.375 13.0825 10.1056C12.79 10.8131 13.1712 12.0212 12.5962 12.5962C12.0212 13.1712 10.8131 12.79 10.1056 13.0825C9.375 13.3863 8.78125 14.5 8 14.5C7.21875 14.5 6.625 13.3863 5.89437 13.0825C5.1875 12.79 3.97875 13.1712 3.40375 12.5962Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5.5 8.5L7 10L10.5 6.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_445_36102">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default Active
