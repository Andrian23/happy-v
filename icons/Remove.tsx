const Remove = ({ className, onClick }: { className: string; onClick: () => void }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    className={className}
    onClick={onClick}
  >
    <g clipPath="url(#clip0_4508_191762)">
      <path
        d="M15.625 4.875L4.375 16.125"
        stroke="#7C8E9E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.625 16.125L4.375 4.875"
        stroke="#7C8E9E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_4508_191762">
        <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
      </clipPath>
    </defs>
  </svg>
)

export default Remove
