"use client"

import React, { useRef } from "react"
import Image from "next/image"

import fileIcon from "@/public/AuthFileInput.svg"
import uploadFileIcon from "@/public/AuthInputFile.svg"

interface UploadCloudinaryInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileName: string
  setFileName: (fileName: string) => void
}

const UploadCloudinaryInput: React.FC<UploadCloudinaryInputProps> = ({ onChange, fileName, setFileName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onChange(event) // Pass the event object back to the parent component
    }
  }

  const handleRemoveFile = () => {
    setFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div>
      <div
        className="cursor-pointer rounded-xl border-2 border-dashed border-primary-500 bg-gray-50 px-5 text-center hover:bg-blue-50 max-lg:py-[22px] lg:py-[72px]"
        onClick={handleClick}
      >
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
        <div className="text-3xl text-blue-500">
          <Image src={uploadFileIcon} alt="Auth Input File" className="m-auto h-[68px] w-[69px]" />
        </div>
        <div className="mt-[16px] text-sm text-gray-500">Drag & drop Credentials or Choose Credentials</div>
      </div>
      {fileName && (
        <div className="mt-2 flex items-center justify-start rounded-xl border border-grey-400 bg-grey-100 px-5 py-2">
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

export default UploadCloudinaryInput
