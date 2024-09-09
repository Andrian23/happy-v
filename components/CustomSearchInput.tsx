import React from "react"
import { Search, X } from "lucide-react"

interface CustomSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  inputStyle?: React.CSSProperties
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomSearchInput: React.FC<CustomSearchInputProps> = ({ value, inputStyle, onChange, ...props }) => {
  const handleSearchClick = () => {
    window.location.href = `/community/search?q=${value}`
  }

  const handleClearClick = () => {
    onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="relative flex items-center text-sm">
      <Search
        className="absolute left-3 cursor-pointer text-gray-400"
        width={20}
        height={20}
        onClick={handleSearchClick}
      />
      <input
        {...props}
        value={value}
        style={inputStyle}
        onChange={onChange}
        type="text"
        className="w-full rounded-[12px] border border-grey-400 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
        placeholder={props.placeholder}
      />
      {value && (
        <X
          className="absolute right-3 cursor-pointer text-gray-400"
          width={20}
          height={20}
          onClick={handleClearClick}
        />
      )}
    </div>
  )
}

export default CustomSearchInput
