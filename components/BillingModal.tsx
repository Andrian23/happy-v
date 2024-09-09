"use client"

import React, { useEffect, useState } from "react"
import { X } from "lucide-react"

import { Checkbox } from "@/components/ui/Checkbox"
import { Input } from "@/components/ui/Input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"

const BillingModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
  }

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    province: "",
    phone: "",
  })

  useEffect(() => {
    const savedData = localStorage.getItem("shippingAddress")
    if (savedData) {
      setFormData(JSON.parse(savedData))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSave = () => {
    localStorage.setItem("shippingAddress", JSON.stringify(formData))
    setIsVisible(!isVisible)
  }

  return (
    <div
      className={`fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70 ${!isVisible ? "hidden" : ""}`}
    >
      <div className="w-[40rem] rounded-2xl bg-white shadow-lg max-md:w-full">
        <div className="flex w-full items-center justify-between border-b border-grey-400 p-8 max-md:p-[1.3rem]">
          <div className="text-2xl font-semibold text-primary-900">Add billing address</div>
          <X color="#25425D" onClick={handleClose} />
        </div>
        <div className="h-auto w-full p-8 max-md:p-[1.3rem]">
          <div className="flex items-center justify-between">
            <div className="w-[48%]">
              <div className="mb-2 text-sm font-medium text-primary-900">First Name</div>
              <Input
                type="text"
                placeholder="Enter your first name"
                onChange={handleChange}
                className="rounded-[12px]"
              />
            </div>
            <div className="w-[48%]">
              <div className="mb-2 text-sm font-medium text-primary-900">Last Name</div>
              <Input
                type="text"
                placeholder="Enter your last name"
                onChange={handleChange}
                className="rounded-[12px]"
              />
            </div>
          </div>
          <div className="my-4 h-auto w-full">
            <div className="mb-2 text-sm font-medium text-primary-900">Address</div>
            <Input type="text" placeholder="Enter your address" onChange={handleChange} className="rounded-[12px]" />
          </div>
          <div className="my-4 h-auto w-full">
            <div className="mb-2 text-sm font-medium text-primary-900">Apartment, suite, etc.</div>
            <Input
              type="text"
              placeholder="Enter your apartment, suite, etc."
              onChange={handleChange}
              className="rounded-[12px]"
            />
          </div>
          <div className="my-2 flex items-center justify-between max-md:block">
            <div className="w-[48%] max-md:w-full">
              <div className="mb-2 text-sm font-medium text-primary-900">City</div>
              <Select>
                <SelectTrigger className="w-full rounded-[12px]">
                  <SelectValue placeholder="United States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>United States</SelectLabel>
                    <SelectItem value="apple">United States</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[48%] max-md:w-full">
              <div className="mb-2 text-sm font-medium text-primary-900">Postal/Zip Code</div>
              <Input
                type="text"
                placeholder="Enter postal / Zip code"
                onChange={handleChange}
                className="rounded-[12px]"
              />
            </div>
          </div>
          <div className="my-4 h-auto w-full">
            <div className="mb-2 text-sm font-medium text-primary-900">Province</div>
            <Input type="text" placeholder="Enter your province" onChange={handleChange} className="rounded-[12px]" />
          </div>
          <div className="my-4 h-auto w-full">
            <div className="mb-2 text-sm font-medium text-primary-900">Phone</div>
            <Input
              type="text"
              placeholder="Enter your phone number"
              onChange={handleChange}
              className="rounded-[12px]"
            />
          </div>
          <div className="flex items-center">
            <Checkbox id="terms" />
            <div className="ml-4 text-sm font-semibold text-primary-900">Set as a default billing address</div>
          </div>
          <div className="flex items-center justify-end">
            <div
              className="cursor-pointer rounded-full bg-primary-500 px-4 py-2 text-sm text-white"
              onClick={handleSave}
            >
              Add billing address
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingModal
