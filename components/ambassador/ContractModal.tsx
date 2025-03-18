import { FC } from "react"
import Image from "next/image"
import { X } from "lucide-react"

import pdfIcon from "@/public/PDF_Format.svg"

interface ContractModalProps {
  onClose: () => void
  onDownload: () => void
}

const ContractModal: FC<ContractModalProps> = ({ onClose, onDownload }) => (
  <div className="fixed inset-0 z-50 bg-black/70">
    <div className="mb-2 flex h-auto w-full items-center justify-between p-4">
      <div className="flex items-center">
        <Image src={pdfIcon} alt="pdf" className="h-5 w-5" />
        <div className="ml-2 text-white">Copy of the ambassador contract</div>
      </div>
      <div className="flex items-center">
        <div
          className="border-grey-400 bg-grey-400 mt-2 flex h-auto w-full cursor-pointer items-center justify-center rounded-full border px-4 py-2"
          onClick={onDownload}
        >
          <div className="text-sm">Download</div>
        </div>
        <div className="ml-4">
          <X color="#fff" onClick={onClose} className="cursor-pointer" />
        </div>
      </div>
    </div>
    <div className="flex h-full w-full items-center justify-center rounded-lg p-4">
      <div className="h-full w-full" />
    </div>
  </div>
)

export default ContractModal
