"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { BeatLoader } from "react-spinners"

import { Prisma } from "@prisma/client"

import { getProducts } from "@/actions/product"
import { getRecommendationById } from "@/actions/recommendation"
import { updateRecommendation } from "@/actions/recommendation"
import PageTopic from "@/components/PageTopic"
import ProductGridItem from "@/components/ProductItemGrid"
import ConfirmationModal from "@/components/Recommendations/components/ConfirmationModal"
import { Tabs } from "@/components/Tabs"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { useToast } from "@/components/ui/useToast"
import { BackArrowIcon, CloseIcon, CrossIcon, MenuIcon, PlusIcon, TriangleDownIcon } from "@/icons"
import { cn } from "@/lib/utils"
import type { ShopifyProduct } from "@/models/product"
import type { Recommendation } from "@/models/recommendation"
import pills from "@/public/pills.png"

interface ProductsState {
  products: ShopifyProduct[]
}

const percentages = [0, 3, 8, 10, 12]
const tabs = ["All", "Vaginal Health", "Gut Health", "Everyday Wellness", "Accessories"]

const RecommendationPage = () => {
  const searchParams = useSearchParams()
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [productRecommendationModal, setProductRecommendationModal] = useState(false)
  const [products, setProducts] = useState<ProductsState>({ products: [] })
  const [activeItem, setActiveItem] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [select, setSelect] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [discount, setDiscount] = useState(percentages[1])
  const [deletingId, setDeletingId] = useState<string | number | null>(null)
  const [formData, setFormData] = useState<Omit<Recommendation, "id" | "userId">>({
    clients: [{ id: Date.now(), firstName: "", lastName: "", email: "" }],
    basicInfo: {
      recommendationName: "",
      recommendationDetails: "",
    },
    discount: percentages[1],
    selectedProducts: [],
    status: "ordered",
    created: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const id = searchParams.get("id")

  const handleOpenDeletingModal = (clientId: string | number | null) => {
    setDeletingId(clientId)
  }

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (id) {
        const recommendation = await getRecommendationById(id)
        if (recommendation) {
          setFormData(recommendation)
        }
      }
    }
    fetchRecommendation()
  }, [id])

  const handleOpenProductRecommendationModal = () => {
    setProductRecommendationModal(true)
  }

  const handleCloseProductRecommendationModal = () => {
    setProductRecommendationModal(false)
  }

  useEffect(() => {
    if (productRecommendationModal) {
      document.body.classList.add("no-scroll")
    } else {
      document.body.classList.remove("no-scroll")
    }

    // Clean up function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove("no-scroll")
    }
  }, [productRecommendationModal])

  const getFilteredProducts = useCallback(() => {
    switch (activeItem) {
      case 0:
        return products.products
      case 1:
        return products.products.filter((product) => product.tags.includes("Vaginal health"))
      case 2:
        return products.products.filter((product) => product.tags.includes("Gut health"))
      case 3:
        return products.products.filter(
          (product) => product.tags.includes("Vaginal health") || product.tags.includes("Gut health")
        )
      case 4:
        return products.products.filter((product) => product.tags.includes("Accessories"))
      default:
        return products.products
    }
  }, [activeItem, products])

  const filteredProducts = useMemo(() => getFilteredProducts(), [getFilteredProducts])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const products = await getProducts()
      setProducts({ products })
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const sortedProducts = useMemo(() => {
    const productsToSort = [...filteredProducts]
    let sorted = []

    if (select === "low-to-high") {
      sorted = productsToSort.sort(
        (a, b) => parseFloat(a.variants.edges[0].node.price) - parseFloat(b.variants.edges[0].node.price)
      )
    } else if (select === "high-to-low") {
      sorted = productsToSort.sort(
        (a, b) => parseFloat(b.variants.edges[0].node.price) - parseFloat(a.variants.edges[0].node.price)
      )
    } else {
      sorted = productsToSort.sort((a) => (a.status === "ACTIVE" ? -1 : 1))
    }

    return sorted
  }, [select, filteredProducts])

  useEffect(() => {
    const productsToSort = [...filteredProducts]
    let sorted = []

    if (select === "low-to-high") {
      sorted = productsToSort.sort(
        (a, b) => parseFloat(a.variants.edges[0].node.price) - parseFloat(b.variants.edges[0].node.price)
      )
    } else if (select === "high-to-low") {
      sorted = productsToSort.sort(
        (a, b) => parseFloat(b.variants.edges[0].node.price) - parseFloat(a.variants.edges[0].node.price)
      )
    } else {
      sorted = productsToSort.sort((a) => (a.status === "ACTIVE" ? -1 : 1))
    }

    // Перевірка, чи відрізняється новий відсортований список від попереднього
    if (JSON.stringify(sorted) !== JSON.stringify(sortedProducts)) {
      // setSortedProducts(sorted)
    }
  }, [select, filteredProducts, sortedProducts])

  const handleInputChange = (index: number, field: string, value: unknown, context: "clients" | "selectedProducts") => {
    if (context === "clients") {
      setFormData((prev) => ({
        ...prev,
        clients: prev.clients.map((client, i) => {
          if (i === index) {
            return { ...client, [field]: value }
          }
          return client
        }),
      }))
    } else if (context === "selectedProducts") {
      setFormData((prev) => ({
        ...prev,
        selectedProducts: prev.selectedProducts.map((product, i) => {
          if (i === index) {
            return { ...product, [field]: value }
          }
          return product
        }),
      }))
    }
  }

  const addClient = () => {
    setFormData((prev) => ({
      ...prev,
      clients: [...prev.clients, { id: Date.now(), firstName: "", lastName: "", email: "" }],
    }))
  }

  const handleBasicInfoChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value },
    }))
  }

  /* 3. discount */

  const handleDiscountChange = (discount: number) => {
    setDiscount(discount)
    setFormData((prev) => ({
      ...prev,
      discount,
    }))
  }

  /* 4. recommendation products */

  const handleAddToCart = (product: ShopifyProduct) => {
    setFormData((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.some((p) => p.id === product.id)
        ? prev.selectedProducts.filter((p) => p.id !== product.id)
        : [...prev.selectedProducts, { ...product, amount: "", frequency: "", details: "" }],
    }))
  }

  const handleRemoveProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedProducts: prev?.selectedProducts.filter((p) => p?.id !== productId),
    }))
  }

  const toggleMoreInfo = () => {
    setShowMoreInfo((prev) => !prev)
  }

  const isDisabled =
    formData.clients.some((client) => !client.firstName || !client.lastName || !client.email) ||
    !formData.basicInfo.recommendationName ||
    !formData.basicInfo.recommendationDetails ||
    formData.selectedProducts.length === 0 ||
    formData.selectedProducts.some((product) => !product.amount || !product.frequency)

  // <pre>{JSON.stringify(formData, null, 2)}</pre>

  const handleSubmit = async () => {
    const updatedRecommendation = {
      ...formData,
      created: new Date().toISOString(),
      clients: formData.clients as unknown as Prisma.InputJsonObject[],
      selectedProducts: formData.selectedProducts as unknown as Prisma.InputJsonObject[],
    }

    if (id) {
      try {
        await updateRecommendation(id, updatedRecommendation)

        router.push("/recommendations")
        toast({ title: "Recommendation updated successfully", position: "bottom-right" })
      } catch (error) {
        console.error("Failed to update recommendation:", error)
        toast({
          title: "Failed to update recommendation",
          position: "bottom-right",
        })
      }
    } else {
      console.error("Recommendation ID is null. Cannot update recommendation.")
    }
  }

  const calculateTotalPrice = () => {
    return formData.selectedProducts.reduce((total, product) => {
      return total + parseFloat(product.variants.edges[0].node.price)
    }, 0)
  }

  return (
    <div className="mb-2.5 w-full lg:px-4">
      <button
        onClick={() => router.back()}
        className="mb-7 flex cursor-pointer items-start gap-2 text-sm font-medium text-[#7f85a4]"
      >
        <BackArrowIcon />
        Back to Recommendations
      </button>

      <PageTopic name="New recommendation" />

      <div className="mt-5 grid grid-cols-[65%_32%] gap-5">
        <div>
          <div className="bg-grey-200 mb-5 flex flex-col items-start gap-2.5 self-stretch rounded-[20px] p-6">
            <h2 className="text-primary-900 text-xl leading-normal font-bold">Client Information</h2>

            {formData.clients.map((client, index) => (
              <div key={client.id} className="w-full">
                {formData.clients.length > 1 && (
                  <h3 className="text-primary-900 mx-0 my-2.5 text-sm font-semibold">Client {index + 1}</h3>
                )}
                <div className="grid w-full grid-cols-2 items-center justify-between gap-5">
                  <div>
                    <label className="text-primary-900 mb-2.5 text-sm font-semibold" htmlFor={`fname-${index + 1}`}>
                      First name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your first name"
                      id={`fname-${index + 1}`}
                      onChange={(e) => handleInputChange(index, "firstName", e.target.value, "clients")}
                      value={client.firstName}
                    />
                  </div>

                  <div>
                    <label className="text-primary-900 mb-2.5 text-sm font-semibold" htmlFor={`lname-${index + 1}`}>
                      Last name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your last name"
                      id={`lname-${index + 1}`}
                      onChange={(e) => handleInputChange(index, "lastName", e.target.value, "clients")}
                      value={client.lastName}
                    />
                  </div>
                </div>

                <div className="grid w-full items-center" style={{ marginTop: 16 }}>
                  <label className="text-primary-900 mb-2.5 text-sm font-semibold" htmlFor={`email-${index + 1}`}>
                    Enter email
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter client mail"
                    id={`email-${index + 1}`}
                    onChange={(e) => handleInputChange(index, "email", e.target.value, "clients")}
                    value={client.email}
                  />
                </div>

                {formData.clients.length > 1 && index < formData.clients.length - 1 && (
                  <hr className="bg-grey-400 mt-6 h-px w-full"></hr>
                )}
              </div>
            ))}

            <Button variant="primary-outline" className="mt-3.5 w-full" onClick={addClient}>
              <PlusIcon />
              Add client
            </Button>
          </div>

          <div className="bg-grey-200 mb-5 flex flex-col items-start gap-2.5 self-stretch rounded-[20px] p-6">
            <h2 className="text-primary-900 text-xl leading-normal font-bold">Basic Info</h2>

            <div className="grid w-full items-center">
              <label className="text-primary-900 mb-2.5 text-sm font-semibold" htmlFor="recommendation-name">
                Name the recommendation
              </label>
              <Input
                type="text"
                placeholder="Enter recommendation name"
                id="recommendation-name"
                onChange={(e) => handleBasicInfoChange("recommendationName", e.target.value)}
                value={formData.basicInfo.recommendationName}
              />
            </div>

            <div className="grid w-full items-center">
              <label className="text-primary-900 mb-2.5 text-sm font-semibold" htmlFor="recommendation-details">
                Recommendation details
              </label>
              <Textarea
                placeholder="Enter recommendation details"
                id="recommendation-details"
                onChange={(e) => handleBasicInfoChange("recommendationDetails", e.target.value)}
                value={formData.basicInfo.recommendationDetails}
              />
            </div>
          </div>

          <div className="bg-grey-200 flex flex-col items-start gap-2.5 self-stretch rounded-[20px] p-6">
            <h2 className="text-primary-900 mb-5 text-xl leading-normal font-bold">Products</h2>

            <div className="w-full">
              {formData.selectedProducts.map((product, index) => (
                <div
                  className="relative mb-4 grid grid-cols-[24%_72%] gap-6 rounded-xl bg-white p-5 last-of-type:mb-0"
                  key={product?.id}
                >
                  <Popover>
                    <PopoverTrigger asChild>
                      <MenuIcon className="absolute top-3 right-[18px] cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w- w-39 gap-0 p-0">
                      <button
                        className="flex h-12 cursor-pointer items-center self-stretch rounded-lg px-4 py-4 text-sm font-normal text-[#eb5757] hover:bg-[rgba(220,221,222,0.43)] focus:outline-hidden"
                        onClick={() => handleOpenDeletingModal(product?.id)}
                      >
                        Delete
                      </button>
                    </PopoverContent>
                  </Popover>

                  <ConfirmationModal
                    isOpen={deletingId === product?.id}
                    onClose={() => setDeletingId(null)}
                    onConfirm={() => handleRemoveProduct(product?.id)}
                    message="Are you sure you want to delete this template?"
                  />

                  <div>
                    {product?.images.edges[0]?.node?.src && (
                      <Image
                        src={product.images.edges[0].node.src}
                        alt={product.images.edges[0].node.altText ?? ""}
                        width={70}
                        height={70}
                      />
                    )}

                    <p className="text-primary-900 mt-4 text-sm font-semibold">
                      {product?.title.length > 35 ? `${product?.title.substring(0, 35)}...` : product?.title}
                    </p>
                    <p className="text-grey-800 mx-0 mt-0.5 mb-1.5 text-xs leading-normal font-medium">
                      Servings: {product?.variants.edges[0].node.inventoryQuantity}
                    </p>
                    <p className="text-grey-800 mx-0 mt-0.5 mb-1.5 text-xs leading-normal font-medium">
                      ${product?.variants.edges[0].node.price} Retail
                    </p>
                    <p className="text-grey-800 text-xs leading-normal font-medium">
                      <span className="mr-1.5 line-through">${product?.variants.edges[0].node.price}</span>
                      <span className="text-primary-900 text-sm font-semibold">
                        ${product?.variants.edges[0].node.price}
                      </span>
                    </p>
                  </div>

                  <div>
                    <div className="grid w-full grid-cols-2 items-center justify-between gap-5">
                      <div>
                        <label
                          className="text-primary-900 mb-2.5 text-sm font-semibold"
                          htmlFor={`amount-${index + 1}`}
                        >
                          Amount *
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter amount"
                          id={`amount-${index + 1}`}
                          onChange={(e) => handleInputChange(index, "amount", e.target.value, "selectedProducts")}
                          value={product?.amount}
                        />
                      </div>

                      <div>
                        <label
                          className="text-primary-900 mb-2.5 text-sm font-semibold"
                          htmlFor={`frequency-${index + 1}`}
                        >
                          Frequency *
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter frequency"
                          id={`frequency-${index + 1}`}
                          onChange={(e) => handleInputChange(index, "frequency", e.target.value, "selectedProducts")}
                          value={product?.frequency}
                        />
                      </div>
                    </div>

                    <div className="grid w-full items-center" style={{ marginTop: 16 }}>
                      <Textarea
                        placeholder="Details"
                        id={`details-${index + 1}`}
                        onChange={(e) => handleInputChange(index, "details", e.target.value, "selectedProducts")}
                        value={product?.details}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {formData.selectedProducts.length > 0 ? (
              <Button
                variant="primary-outline"
                className="mt-3.5 w-full gap-2"
                onClick={handleOpenProductRecommendationModal}
              >
                <PlusIcon />
                Add more products
              </Button>
            ) : (
              <div className="grid min-h-[325px] w-full content-center items-center justify-center justify-items-center rounded-lg bg-white">
                <Image src={pills} alt="pills" width={74} height={74} />

                <h4 className="text-primary-900 text-base font-bold">Add a Product Recommendation</h4>
                <p className="text-grey-800 px-0 pt-2 pb-4 text-sm font-medium">
                  Add any available products from the catalog for your clients
                </p>

                <Button variant="primary" className="gap-2" onClick={handleOpenProductRecommendationModal}>
                  <PlusIcon />
                  Add product
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-grey-200 flex flex-col items-start gap-2.5 self-stretch rounded-[20px] p-6">
          <h2 className="text-primary-900 text-xl leading-normal font-bold">Discount Option</h2>

          <div className="mt-0.5 flex h-9 flex-row items-center justify-center gap-2.5">
            {percentages.map((percentage, index) => (
              <div
                key={index}
                className={cn(
                  "border-grey-400 text-grey-800 flex h-9 shrink-0 grow basis-0 cursor-pointer flex-col items-center justify-center gap-2.5 border bg-white px-3 py-2 text-sm font-medium first-of-type:rounded-l-xl last-of-type:rounded-r-xl",
                  percentage === formData.discount && "border-primary-500 bg-primary-500 border text-white"
                )}
                onClick={() => handleDiscountChange(percentage)}
              >
                {percentage}%
              </div>
            ))}
          </div>

          <p className="text-grey-800 mb-6 text-xs leading-normal font-medium">
            The percentage of the discount that you give to the client will be calculated from your income
          </p>

          <h2 className="text-primary-900 text-xl leading-normal font-bold">Price</h2>

          <div className="grid w-full grid-cols-[repeat(2,auto)] items-center justify-between">
            <h4 className="text-grey-800 text-sm font-medium">Client discount ({formData.discount}%)</h4>
            <h4 className="text-grey-800 text-sm font-medium">
              -${(calculateTotalPrice() * (formData.discount / 100)).toFixed(2)}
            </h4>
          </div>

          <div className="grid w-full grid-cols-[repeat(2,auto)] items-center justify-between">
            <h4 className="text-primary-900 text-sm font-semibold">Total starts at</h4>
            <h4 className="text-primary-900 text-sm font-semibold">
              ${(calculateTotalPrice() - calculateTotalPrice() * (formData.discount / 100)).toFixed(2)}
            </h4>
          </div>

          <Button variant="primary" disabled={isDisabled} className="mt-6 w-full" onClick={handleSubmit}>
            Send
          </Button>
        </div>
      </div>

      {productRecommendationModal && (
        <div className="fixed top-0 left-0 z-2 h-screen w-screen bg-black/50">
          <div className="border-grey-400 relative top-1/2 left-1/2 z-1 h-[85%] w-full max-w-[1093px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border-b bg-white">
            <div className="border-grey-400 border-b p-6">
              <h2 className="text-primary-900 text-[28px] leading-normal font-bold">Add recommendation products</h2>
              <div
                className="absolute top-6 right-6 h-6 w-6 cursor-pointer"
                onClick={handleCloseProductRecommendationModal}
              >
                <CloseIcon />
              </div>
            </div>

            <div className="relative h-full overflow-y-auto px-6 pt-3 pb-6">
              <div className="main-products mt-4">
                <div className="flex w-full items-center justify-between max-md:block">
                  <Tabs tabs={tabs} activeTab={activeItem} onTabChange={setActiveItem} />

                  <div className="filter-items-second flex max-md:block">
                    <div className="ml-2 max-md:ml-0">
                      <Select onValueChange={setSelect}>
                        <SelectTrigger className="w-[180px] max-md:w-full">
                          <SelectValue placeholder="Price: Low-High" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="low-to-high">Low to High</SelectItem>
                            <SelectItem value="high-to-low">High to Low</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              {isLoading ? (
                <div className="flex h-screen w-full items-center justify-center">
                  <BeatLoader />
                </div>
              ) : (
                <div className="mt-2 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {sortedProducts.map((product) => (
                    <ProductGridItem
                      key={product.id}
                      product={product}
                      quantity={false}
                      onAddToCart={handleAddToCart}
                      isSelected={formData.selectedProducts.some((p) => p?.id === product?.id)}
                      addLabel="Add to recommendation"
                    />
                  ))}
                </div>
              )}
            </div>

            {formData.selectedProducts.length > 0 && (
              <div className="border-grey-400 absolute bottom-0 grid min-h-[68px] w-full grid-cols-[repeat(2,auto)] items-center justify-between gap-[30px] rounded-b-xl border-t bg-white px-6 py-3 shadow-[0_-2px_31px_0_rgba(55,58,64,0.08)]">
                <div className="flex flex-row items-center justify-center gap-[18px]">
                  <h4 className="text-primary-900 w-[121px] text-sm font-medium">
                    {formData.selectedProducts?.length} Products Added
                  </h4>
                  <div className="flex flex-row justify-center gap-2.5">
                    {formData.selectedProducts.slice(0, 4).map((product) => (
                      <div
                        className="border-grey-400 flex min-h-[44px] w-[168px] flex-row items-center justify-center gap-2.5 rounded-md border px-2 py-0"
                        key={product?.id}
                      >
                        {product?.images.edges[0]?.node?.src && (
                          <Image
                            src={product.images.edges[0].node.src}
                            alt={product.images.edges[0].node.altText ?? ""}
                            width={32}
                            height={32}
                          />
                        )}
                        <p className="text-primary-900 max-w-full overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap">
                          {product?.title}
                        </p>
                        <CrossIcon
                          className="min-h-4 min-w-4 cursor-pointer"
                          onClick={() => handleRemoveProduct(product?.id)}
                        />
                      </div>
                    ))}
                    {formData.selectedProducts.length > 4 && (
                      <div
                        className="group border-grey-400 text-primary-900 hover:bg-grey-200 relative flex w-[75px] cursor-pointer items-center justify-center rounded-md border px-2.5 py-2 text-sm font-semibold"
                        onMouseEnter={toggleMoreInfo}
                        onMouseLeave={toggleMoreInfo}
                      >
                        +{formData.selectedProducts.length - 4} more
                        {showMoreInfo && (
                          <div className="relative">
                            <div className="text-primary-900 absolute bottom-[44px] hidden w-[167px] -translate-x-[65%] translate-y-0 flex-col items-start gap-1.5 rounded-lg bg-white p-3 text-sm font-medium group-hover:flex">
                              {formData.selectedProducts.slice(4).map((product, index) => (
                                <p key={index}>{product?.title}</p>
                              ))}
                            </div>
                            <TriangleDownIcon className="absolute bottom-7 left-0 -translate-x-[180%] -translate-y-[60%] group-hover:block" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="primary" onClick={handleCloseProductRecommendationModal}>
                  Confirm
                </Button>
              </div>
            )}
          </div>

          <div className="absolute top-0 left-0 h-full w-full" onClick={handleCloseProductRecommendationModal}></div>
        </div>
      )}
    </div>
  )
}

export default RecommendationPage
