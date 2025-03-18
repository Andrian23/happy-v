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
        className="border-grey-400 focus:ring-primary-500 w-full rounded-[12px] border py-2 pr-4 pl-10 focus:ring-2 focus:outline-hidden"
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
