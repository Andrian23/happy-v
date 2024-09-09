"use client"

import React, { useState } from "react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"

import AuthFileInput from "./AuthFileInput"

const SocialMediaAdd: React.FC = () => {
  const [fileName, setFileName] = useState("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  return (
    <div className="mx-auto my-8 flex h-[80vh] w-fit flex-col items-center justify-center rounded-2xl p-4">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <AuthFileInput onChange={handleFileChange} fileName={fileName} setFileName={setFileName} />
        <Input type="text" placeholder="File name" className="my-4" />
        <Select>
          <SelectTrigger className="my-4 w-full">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="gif">GIF</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button>Add File</Button>
      </div>
    </div>
  )
}

export default SocialMediaAdd
