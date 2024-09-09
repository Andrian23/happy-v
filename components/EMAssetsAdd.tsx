"use client"

import React, { useState } from "react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"

import UploadCloudinaryInput from "./UploadCloudinaryInput"

const EMAssetsAdd: React.FC = () => {
  const [file, setFile] = useState<File | null>(null) // Додано стан для файлу
  const [fileName, setFileName] = useState("") // Додано стан для імені файлу
  const [type, setType] = useState("")
  const [format, setFormat] = useState("")
  const [title, setTitle] = useState("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setFile(file) // Збереження файлу в стані
    }
  }

  const handleUpload = async () => {
    const formData = new FormData()
    formData.append("file", file as File)
    formData.append("format", format)
    formData.append("type", type)
    formData.append("title", title)

    const response = await fetch("/api/marketing_upload", {
      method: "POST",
      body: formData,
      // Видаляємо заголовок 'Content-Type', щоб браузер міг встановити його автоматично
    })

    if (!response.ok) {
      console.log({ file, format, type, title })
      console.error("Failed to upload")
      return
    }
    const data = await response.json()
    console.log(data)
    console.log({ file, format, type, title }) // Logging the POST request data
  }

  return (
    <div className="mx-auto my-8 flex h-[80vh] w-fit flex-col items-center justify-center rounded-2xl p-4">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <UploadCloudinaryInput onChange={handleFileChange} fileName={fileName} setFileName={setFileName} />
        <Select onValueChange={(value) => setType(value)} defaultValue={type}>
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

        <Select onValueChange={(value) => setFormat(value)} defaultValue={format}>
          <SelectTrigger className="my-4 w-full">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="product-one-pagers">Product one-pagers</SelectItem>
              <SelectItem value="product-brochures">Product brochures</SelectItem>
              <SelectItem value="publication-list">Publication list</SelectItem>
              <SelectItem value="studies">Studies</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Title"
          className="my-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Button onClick={handleUpload}>Add File</Button>
      </div>
    </div>
  )
}

export default EMAssetsAdd
