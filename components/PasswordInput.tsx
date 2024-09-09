"use client"

import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/Input"

interface PasswordInputProps {
  disabled: boolean
  placeholder: string
  className?: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({ disabled, placeholder, className, ...restProps }) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative">
      <Input
        {...restProps}
        disabled={disabled}
        placeholder={placeholder}
        type={showPassword ? "text" : "password"}
        className={className}
      />
      <div
        className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? <EyeOff size={20} className="text-grey-800" /> : <Eye size={20} className="text-grey-800" />}
      </div>
    </div>
  )
}

export default PasswordInput
