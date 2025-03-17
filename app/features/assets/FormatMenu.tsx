import { FC, useState } from "react"
import React from "react"
import { Check, X } from "lucide-react"

import { Checkbox } from "@/components/ui/Checkbox"
import { Label } from "@/components/ui/Label"

interface FormatMenuProps {
  format: string
  setFormat: React.Dispatch<React.SetStateAction<string>>
}

const FormatMenu: FC<FormatMenuProps> = ({ format, setFormat }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div
      className={`text-primary-900 relative mx-4 h-full w-auto cursor-pointer rounded-xl border px-3 py-2 text-sm font-medium max-lg:mx-0 ${isMenuOpen ? "border-primary-500 bg-primary-100" : ""} ${format !== "Format" ? "border-primary-500 bg-primary-100" : ""}`}
    >
      <div className="flex items-center gap-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {format !== "Format" && <Check className="h-5 w-5" />}
        {format}
        {format !== "Format" && <X className="h-5 w-5" onClick={() => setFormat("Format")} />}
      </div>
      {isMenuOpen && (
        <div className="absolute top-10 left-0 z-40 h-auto w-auto rounded-2xl bg-white p-3 shadow-xs">
          <div className="text-primary-900 font-medium">Format</div>
          <div className="mt-2 flex items-center justify-between gap-6">
            <Label className="flex items-center gap-2 font-normal">
              <Checkbox id="pdf" onCheckedChange={() => setFormat("PDF")} checked={format === "PDF"} />
              PDF
            </Label>
            <Label className="flex items-center gap-2 font-normal">
              <Checkbox id="image" onCheckedChange={() => setFormat("Image")} checked={format === "Image"} />
              Image
            </Label>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormatMenu
