"use client"

import React, { useEffect, useState } from "react"
import { City, Country, ICity } from "country-state-city"
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

const ShippingModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
  }

  const countryData = Country.getAllCountries()

  const [cityData, setCityData] = useState<ICity[]>([])

  const [country, setCountry] = useState(countryData[0])
  const [city, setCity] = useState<ICity | undefined>(undefined)

  useEffect(() => {
    if (country?.isoCode) {
      setCityData(City.getCitiesOfCountry(country.isoCode) ?? [])
    }
  }, [country])

  useEffect(() => {
    if (cityData) {
      setCity(cityData[0])
    }
  }, [cityData])

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [apartment, setApartment] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [province, setProvince] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  const handleAddAddress = () => {
    const addressData = {
      firstName,
      lastName,
      address,
      apartment,
      email,
      country: country.name,
      city: city?.name,
      postalCode,
      province,
      phone,
    }
    localStorage.setItem("shippingAddress", JSON.stringify(addressData))
    handleClose()
    window.location.reload() // Перерендринг після закриття модального вікна
  }

  return (
    <div
      className={`fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70 ${!isVisible ? "hidden" : ""}`}
    >
      <div className="w-[40rem] rounded-2xl bg-white shadow-lg max-md:w-full">
        <div className="flex w-full items-center justify-between border-b border-grey-400 p-8 max-md:p-[1.3rem]">
          <div className="text-2xl font-semibold text-primary-900">New address</div>
          <X color="#25425D" onClick={handleClose} />
        </div>
        <div className="h-auto w-full p-8 max-md:p-[1.3rem]">
          <div className="flex items-center justify-between">
            <div className="w-[48%]">
              <div className="mb-2 text-sm font-medium text-primary-900">First Name</div>
              <Input
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-[12px]"
              />
            </div>
            <div className="w-[48%]">
              <div className="mb-2 text-sm font-medium text-primary-900">Last Name</div>
              <Input
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-[12px]"
              />
            </div>
          </div>
          <div className="my-4 h-auto w-full">
            <div className="mb-2 text-sm font-medium text-primary-900">Address</div>
            <Input
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-[12px]"
            />
          </div>
          <div className="my-4 h-auto w-full">
            <div className="mb-2 text-sm font-medium text-primary-900">Apartment, suite, etc.</div>
            <Input
              type="text"
              placeholder="Enter your apartment, suite, etc."
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              className="rounded-[12px]"
            />
          </div>
          <div className="my-2 flex items-center justify-between max-md:block">
            <div className="w-[31%] max-md:w-full">
              <div className="mb-2 text-sm font-medium text-primary-900">Country</div>
              <Select
                onValueChange={(value) => {
                  const selectedCountry = countryData.find((country) => country.name === value)
                  if (selectedCountry) {
                    setCountry(selectedCountry)
                  }
                }}
              >
                <SelectTrigger className="w-full rounded-[12px]">
                  <SelectValue placeholder="Choose your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Choose your country</SelectLabel>
                    {countryData &&
                      countryData.map((country) => (
                        <SelectItem key={country.isoCode} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[31%] max-md:w-full">
              <div className="mb-2 text-sm font-medium text-primary-900">State</div>
              <Select
                onValueChange={(value) => {
                  const selectedCity = cityData.find((city) => city.name === value)
                  setCity(selectedCity)
                }}
              >
                <SelectTrigger className="w-full rounded-[12px]">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Choose your city</SelectLabel>
                    {cityData &&
                      cityData.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[31%] max-md:w-full">
              <div className="mb-2 text-sm font-medium text-primary-900">Postal/Zip Code</div>
              <Input
                type="text"
                placeholder="Enter postal / Zip code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="rounded-[12px]"
              />
            </div>
          </div>
          <div className="my-4 h-auto w-full">
            <div className="mb-2 text-sm font-medium text-primary-900">Province</div>
            <Input
              type="text"
              placeholder="Enter your province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="rounded-[12px]"
            />
          </div>
          <div className="my-4 h-auto w-full">
            <div className="mb-2 text-sm font-medium text-primary-900">Phone</div>
            <Input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-[12px]"
            />
          </div>
          <div className="my-4 h-auto w-full">
            <div className="mb-2 text-sm font-medium text-primary-900">Email</div>
            <Input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-[12px]"
            />
          </div>
          <div className="flex items-center">
            <Checkbox id="terms" />
            <div className="ml-4 text-sm font-semibold text-primary-900">Set as a default address</div>
          </div>
          <div className="flex items-center justify-end">
            <div
              className="cursor-pointer rounded-full bg-primary-500 px-4 py-2 text-sm text-white"
              onClick={handleAddAddress}
            >
              Add address
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingModal
