const Cross = ({ className, onClick }: { className: string; onClick: () => void }) => (
  <svg
    className={className}
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g clipPath="url(#clip0_1639_92554)">
      <path d="M12.5 3.5L3.5 12.5" stroke="#7C8E9E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 12.5L3.5 3.5" stroke="#7C8E9E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
)

export default Cross
