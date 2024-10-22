"use client"

import React, { Dispatch, SetStateAction, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { City, Country, ICity, ICountry, IState, State } from "country-state-city"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"

import { addShippingAddress, editShippingAddress } from "@/actions/shippingAddress"
import SearchableSelect from "@/components/SearchableSelect"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import type { ShippingAddress } from "@/models/shipping"
import { ShippingAddressSchema } from "@/schemas"
import { useAddressStore } from "@/stores/address"

interface SettingsShippingModalProps {
  onClose: () => void
  shippingData?: ShippingAddress
  addressType?: "shipping" | "billing"
  setShippingData?: Dispatch<SetStateAction<ShippingAddress[]>>
  setIsProfileUpdated?: Dispatch<SetStateAction<boolean>>
}

const SettingsShippingModal: React.FC<SettingsShippingModalProps> = ({
  onClose,
  shippingData,
  addressType = "shipping",
  setShippingData,
  setIsProfileUpdated,
}) => {
  const [formState, setFormState] = useState({
    country: null as ICountry | null,
    state: null as IState | null,
    city: null as ICity | null,
  })
  const { setBillingAddress } = useAddressStore()
  const { data } = useSession()

  const form = useForm<z.infer<typeof ShippingAddressSchema>>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: {
      firstName: shippingData?.firstName || "",
      lastName: shippingData?.lastName || "",
      address: shippingData?.address || "",
      apartmentSuite: shippingData?.apartmentSuite || "",
      country: shippingData?.country || "",
      city: shippingData?.city || "",
      postalZipCode: shippingData?.postalZipCode || "",
      stateProvince: shippingData?.stateProvince || "",
      phone: shippingData?.phone || "",
      isDefault: shippingData?.id === data?.user.defaultShippingAddress || false,
      email: shippingData?.email || "",
    },
  })

  const handleClose = () => {
    onClose()
  }

  const countryData = useMemo(() => Country.getAllCountries(), [])
  const stateData = useMemo(
    () => (formState.country ? (State.getStatesOfCountry(formState.country.isoCode) ?? []) : []),
    [formState.country]
  )
  const cityData = useMemo(
    () =>
      formState.state && formState.country
        ? (City.getCitiesOfState(formState.country.isoCode, formState.state.isoCode) ?? [])
        : [],
    [formState.state, formState.country]
  )

  const handleFormStateChange = (key: keyof typeof formState, value: ICountry | IState | ICity | null) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmitValues = async (values: z.infer<typeof ShippingAddressSchema>) => {
    try {
      const { isDefault, ...addressData } = values

      if (addressType === "shipping") {
        if (shippingData) {
          await editShippingAddress(shippingData.id, addressData, isDefault)

          if (setShippingData) {
            setShippingData((prev) =>
              prev.map((address) => (address.id === shippingData.id ? { ...address, ...addressData } : address))
            )
          }

          if (setIsProfileUpdated) {
            setIsProfileUpdated(true)
          }
        } else {
          const newAddress = await addShippingAddress(addressData, isDefault)

          if (setIsProfileUpdated) {
            setIsProfileUpdated(true)
          }

          if (setShippingData) {
            setShippingData((prev) => [
              ...prev,
              {
                ...newAddress,
              },
            ])
          }
        }
      }

      if (addressType === "billing" && shippingData) {
        setBillingAddress(values)
      }

      handleClose()
    } catch (error) {
      console.error("Error saving shipping address:", error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/70">
      <div className="mx-auto my-8 w-160 max-w-full rounded-2xl bg-white shadow-lg max-md:w-full">
        <div className="flex w-full items-center justify-between border-b border-grey-400 p-4 md:p-6">
          <div className="text-2xl font-semibold text-primary-900">New address</div>
          <Button onClick={handleClose} variant="ghost" size="smallIcon">
            <X className="text-primary-900" />
          </Button>
        </div>
        <div className="px-4 py-5 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitValues)}>
              <div className="flex w-full flex-col gap-5">
                <div className="flex flex-col items-center gap-6 md:flex-row">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-sm text-primary-900">First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your first name" type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-sm text-primary-900">Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your last name" type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm text-primary-900">Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your address" type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apartmentSuite"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm text-primary-900">Apartment, suite, etc.</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your apartment, suite, etc." type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col items-center gap-5 md:flex-row md:gap-6">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <SearchableSelect
                            options={countryData.map((country) => ({ label: country.name, value: country.name }))}
                            onValueChange={(value) => {
                              field.onChange(value)
                              const selectedCountry = countryData.find((country) => country.name === value)
                              handleFormStateChange("country", selectedCountry || null)
                            }}
                            defaultValue={field.value}
                            placeholder="Choose your country"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stateProvince"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <SearchableSelect
                            options={stateData.map((state) => ({ label: state.name, value: state.name }))}
                            onValueChange={(value) => {
                              field.onChange(value)
                              const selectedState = stateData.find((state) => state.name === value)
                              handleFormStateChange("state", selectedState || null)
                            }}
                            defaultValue={field.value}
                            placeholder="Select a state"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <SearchableSelect
                            options={cityData.map((city) => ({ label: city.name, value: city.name }))}
                            onValueChange={(value) => {
                              field.onChange(value)
                              const selectedCity = cityData.find((city) => city.name === value)
                              handleFormStateChange("city", selectedCity || null)
                            }}
                            defaultValue={field.value}
                            placeholder="Select a city"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalZipCode"
                    render={({ field }) => (
                      <FormItem className="w-9/12 md:w-full">
                        <FormLabel className="text-sm text-primary-900">Postal/Zip Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter postal / Zip code" type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm text-primary-900">Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your phone number" type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm text-primary-900">Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your email" type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex w-full items-center justify-start space-y-0">
                      <FormControl>
                        <Checkbox
                          id="confirmCheckbox"
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(!!checked)}
                        />
                      </FormControl>
                      <FormLabel className="ml-4 text-sm font-semibold text-primary-900">
                        Set as a default address
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-end">
                  <Button type="submit" variant="primary">
                    {shippingData ? "Save address" : "Add address"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SettingsShippingModal
