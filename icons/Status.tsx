const Status = ({ isActive }: { isActive: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
    <circle cx="6.66797" cy="6" r="6" fill={isActive ? "#09BD30" : "#E7E6E6"} />
  </svg>
)

export default Status
