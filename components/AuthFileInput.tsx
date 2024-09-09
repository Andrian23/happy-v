"use client"

import React, { useRef, useState } from "react"
import Image from "next/image"

import fileIcon from "@/public/AuthFileInput.svg"
import uploadFileIcon from "@/public/AuthInputFile.svg"

interface AuthFileInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileName: string
  setFileName: (fileName: string) => void
  disabled?: boolean
}

const AuthFileInput: React.FC<AuthFileInputProps> = ({ onChange, fileName, setFileName, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onChange(event)
    }
  }

  const handleRemoveFile = () => {
    setFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (!disabled) {
      const file = event.dataTransfer.files?.[0]
      if (file) {
        setFileName(file.name)
        const changeEvent = {
          target: { files: event.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(changeEvent)
      }
    }
  }

  return (
    <div>
      <div
        className={`cursor-pointer rounded-xl border-2 border-dashed border-primary-500 bg-primary-500 bg-opacity-[4%] px-5 text-center max-lg:py-[22px] lg:py-[72px] ${disabled ? "cursor-not-allowed opacity-50" : ""} ${isDragging ? "bg-blue-100" : ""}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} disabled={disabled} />
        <div className="text-3xl text-blue-500">
          <Image src={uploadFileIcon} alt="Auth Input File" className="m-auto h-[68px] w-[69px]" />
        </div>
        <div className="mt-[16px] text-sm text-gray-500">
          Drag & drop Credentials or <span style={{ color: "#6CB4DA" }}>Choose Credentials</span>
        </div>
      </div>
      {fileName && (
        <div className="my-[24px] flex items-center justify-start rounded-[8px] border border-grey-400 bg-grey-100 px-5 py-2">
          <Image src={fileIcon} alt="Auth Input File" className="mr-2 h-[18px] w-[15px]" />
          <span className="text-sm text-grey-800">{fileName}</span>
          <button onClick={handleRemoveFile} className="ml-auto text-grey-800">
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default AuthFileInput
