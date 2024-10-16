"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { BeatLoader } from "react-spinners"

import { getAllProducts } from "@/actions/productsShopify"
import { getTemplateById } from "@/actions/recommendation"
import PageTopic from "@/components/PageTopic"
import ProductGridItem from "@/components/ProductItemGrid"
import { Tabs } from "@/components/Tabs"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { BackArrowIcon, CloseIcon, CrossIcon, MenuIcon, PlusIcon, TriangleDownIcon } from "@/icons"
import { cn } from "@/lib/utils"
import type { Product } from "@/models/product"
import type { Template } from "@/models/recommendation"
import pills from "@/public/pills.png"

interface ProductsState {
  products: Product[]
}

type TemplateData = Omit<Template, "tempId" | "userId">

const percentages = [0, 3, 8, 10, 12]
const tabs = ["All", "Vaginal Health", "Gut Health", "Everyday Wellness", "Accessories"]

const RecommendationsTemplatePage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tempId = searchParams.get("tempId")
  const [products, setProducts] = useState<ProductsState>({ products: [] })
  const [activeItem, setActiveItem] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [select, setSelect] = useState("")
  const [productRecommendationModal, setProductRecommendationModal] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [discount, setDiscount] = useState(percentages[1])
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [formData, setFormData] = useState<TemplateData>({
    id: "",
    basicInfo: {
      recommendationName: "",
      recommendationDetails: "",
    },
    discount: percentages[1],
    selectedProducts: [],
    status: "not-ordered",
    created: "",
    clients: [],
  })

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (tempId) {
        const template = await getTemplateById(tempId)
        if (template) {
          setFormData(template)
        }
      }
    }
    if (tempId) {
      fetchRecommendation()
    }
  }, [tempId])

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

  const filteredProducts = getFilteredProducts()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true) // Встановлення завантаження перед запитом
      const data = await getAllProducts()
      setProducts(data)
      setIsLoading(false) // Вимкнення завантаження після завершення запиту
    }
    fetchData()
  }, [])

  const sortedProducts = useMemo(() => {
    const productsToSort = [...filteredProducts]
    let sorted = []

    if (select === "low-to-high") {
      sorted = productsToSort.sort((a, b) => parseFloat(a.variants[0].price) - parseFloat(b.variants[0].price))
    } else if (select === "high-to-low") {
      sorted = productsToSort.sort((a, b) => parseFloat(b.variants[0].price) - parseFloat(a.variants[0].price))
    } else {
      sorted = productsToSort.sort((a) => (a.status === "active" ? -1 : 1))
    }

    return sorted
  }, [select, filteredProducts])

  useEffect(() => {
    const productsToSort = [...filteredProducts]
    let sorted = []

    if (select === "low-to-high") {
      sorted = productsToSort.sort((a, b) => parseFloat(a.variants[0].price) - parseFloat(b.variants[0].price))
    } else if (select === "high-to-low") {
      sorted = productsToSort.sort((a, b) => parseFloat(b.variants[0].price) - parseFloat(a.variants[0].price))
    } else {
      sorted = productsToSort.sort((a) => (a.status === "active" ? -1 : 1))
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

  const handleAddToCart = (product: Product) => {
    setFormData((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.some((p) => p.id === product.id)
        ? prev.selectedProducts.filter((p) => p.id !== product.id)
        : [...prev.selectedProducts, { ...product, amount: "", frequency: "", details: "" }],
    }))
  }

  const handleRemoveProduct = (productId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedProducts: prev?.selectedProducts.filter((p) => p?.id !== productId),
    }))
  }

  const toggleMoreInfo = () => {
    setShowMoreInfo((prev) => !prev)
  }

  const isDisabled =
    !formData.basicInfo.recommendationName ||
    !formData.basicInfo.recommendationDetails ||
    formData.selectedProducts.length === 0 ||
    formData.selectedProducts.some((product) => !product.amount || !product.frequency)

  // <pre>{JSON.stringify(formData, null, 2)}</pre>

  const handleSubmit = () => {
    const newRecommendation = {
      ...formData,
      created: new Date().toLocaleDateString("en-GB"),
    }

    // Updating the recommendation in local storage
    const recommendationsData = localStorage.getItem("recommendations")
    const currentRecommendations: Template[] = recommendationsData ? JSON.parse(recommendationsData) : []
    const updatedRecommendations: TemplateData[] = [...currentRecommendations, newRecommendation]

    localStorage.setItem("recommendations", JSON.stringify(updatedRecommendations))

    router.push("/recommendations")
  }

  const calculateTotalPrice = () => {
    return formData.selectedProducts.reduce((total, product) => {
      return total + parseFloat(product.variants[0].price)
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

      <PageTopic name="Edit template" />

      <div className="mt-5 grid grid-cols-[65%_32%] gap-5">
        <div>
          <div className="mb-5 flex flex-col items-start gap-2.5 self-stretch rounded-[20px] bg-grey-200 p-6">
            <h2 className="text-xl font-semibold leading-normal text-primary-900">Basic Info</h2>

            <div className="grid w-full items-center">
              <label className="mb-2.5 text-sm font-semibold text-primary-900" htmlFor="recommendation-name">
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
              <label className="mb-2.5 text-sm font-semibold text-primary-900" htmlFor="recommendation-details">
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

          <div className="flex flex-col items-start gap-2.5 self-stretch rounded-[20px] bg-grey-200 p-6">
            <h2 className="mb-5 text-xl font-semibold leading-normal text-primary-900">Products</h2>

            <div className="w-full">
              {formData.selectedProducts.map((product, index) => (
                <div
                  className="relative mb-4 grid grid-cols-[24%_72%] gap-6 rounded-xl bg-white p-5 last-of-type:mb-0"
                  key={product?.id}
                >
                  <MenuIcon
                    className="absolute right-[18px] top-3 cursor-pointer"
                    onClick={() => handleRemoveProduct(product?.id)}
                  />

                  <div>
                    <Image src={product?.image.src} alt={product?.image.src} width={70} height={70} />

                    <p className="mt-4 text-sm font-semibold text-primary-900">
                      {product?.title.length > 35 ? `${product?.title.substring(0, 35)}...` : product?.title}
                    </p>
                    <p className="mx-0 mb-1.5 mt-0.5 text-xs font-medium leading-normal text-grey-800">
                      Servings: {product?.variants[0].inventory_quantity}
                    </p>
                    <p className="mx-0 mb-1.5 mt-0.5 text-xs font-medium leading-normal text-grey-800">
                      ${product?.variants[0].price} Retail
                    </p>
                    <p className="text-xs font-medium leading-normal text-grey-800">
                      <span className="mr-1.5 line-through">${product?.variants[0].price}</span>
                      <span className="text-sm font-semibold text-primary-900">${product?.variants[0].price}</span>
                    </p>
                  </div>

                  <div>
                    <div className="grid w-full grid-cols-2 items-center justify-between gap-5">
                      <div>
                        <label
                          className="mb-2.5 text-sm font-semibold text-primary-900"
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
                          className="mb-2.5 text-sm font-semibold text-primary-900"
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

                <h4 className="text-base font-bold text-primary-900">Add a Product Recommendation</h4>
                <p className="px-0 pb-4 pt-2 text-sm font-medium text-grey-800">
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

        <div className="sticky top-0 flex h-fit flex-col items-start gap-2.5 self-stretch rounded-[20px] bg-grey-200 p-6">
          <h2 className="text-xl font-semibold leading-normal text-primary-900">Discount Option</h2>

          <div className="mt-0.5 flex h-9 flex-row items-center justify-center gap-2.5">
            {percentages.map((percentage, index) => (
              <div
                key={index}
                className={cn(
                  "flex h-9 shrink-0 grow basis-0 cursor-pointer flex-col items-center justify-center gap-2.5 border border-grey-400 bg-white px-3 py-2 text-sm font-medium text-grey-800 first-of-type:rounded-l-xl last-of-type:rounded-r-xl",
                  percentage === formData.discount && "border border-primary-500 bg-primary-500 text-white"
                )}
                onClick={() => handleDiscountChange(percentage)}
              >
                {percentage}%
              </div>
            ))}
          </div>

          <p className="mb-6 text-xs font-medium leading-normal text-grey-800">
            The percentage of the discount that you give to the client will be calculated from your income
          </p>

          <h2 className="text-xl font-semibold leading-normal text-primary-900">Price</h2>

          <div className="grid w-full grid-cols-[repeat(2,auto)] items-center justify-between">
            <h4 className="text-sm font-medium text-grey-800">Client discount ({formData.discount}%)</h4>
            <h4 className="text-sm font-medium text-grey-800">
              -${(calculateTotalPrice() * (formData.discount / 100)).toFixed(2)}
            </h4>
          </div>

          <div className="grid w-full grid-cols-[repeat(2,auto)] items-center justify-between">
            <h4 className="text-sm font-semibold text-primary-900">Total starts at</h4>
            <h4 className="text-sm font-semibold text-primary-900">
              ${(calculateTotalPrice() - calculateTotalPrice() * (formData.discount / 100)).toFixed(2)}
            </h4>
          </div>

          <Button variant="primary" disabled={isDisabled} className="mt-6 w-full" onClick={handleSubmit}>
            Send
          </Button>
        </div>
      </div>

      {productRecommendationModal && (
        <div className="fixed left-0 top-0 z-[2] h-screen w-screen bg-black/50">
          <div className="relative left-1/2 top-1/2 z-[1] h-[85%] w-full max-w-[1093px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border-b border-grey-400 bg-white">
            <div className="border-b border-grey-400 p-6">
              <h2 className="text-[28px] font-bold leading-normal text-primary-900">Add recommendation products</h2>
              <div
                className="absolute right-6 top-6 h-6 w-6 cursor-pointer"
                onClick={handleCloseProductRecommendationModal}
              >
                <CloseIcon />
              </div>
            </div>

            <div className="h-full overflow-y-auto px-6 pb-6 pt-3">
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
                    />
                  ))}
                </div>
              )}
            </div>

            {formData.selectedProducts.length > 0 && (
              <div className="absolute bottom-0 grid min-h-[68px] w-full grid-cols-[repeat(2,auto)] items-center justify-between gap-[30px] rounded-b-xl border-t border-grey-400 bg-white px-6 py-3 shadow-[0_-2px_31px_0_rgba(55,58,64,0.08)]">
                <div className="flex flex-row items-center justify-center gap-[18px]">
                  <h4 className="w-[121px] text-sm font-medium text-primary-900">
                    {formData.selectedProducts?.length} Products Added
                  </h4>
                  <div className="flex flex-row justify-center gap-2.5">
                    {formData.selectedProducts.slice(0, 4).map((product) => (
                      <div
                        className="flex min-h-[44px] w-[168px] flex-row items-center justify-center gap-2.5 rounded-md border border-grey-400 px-2 py-0"
                        key={product?.id}
                      >
                        <Image src={product?.image.src} alt={product?.image.src} width={32} height={32} />
                        <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-primary-900">
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
                        className="group relative flex w-[75px] cursor-pointer items-center justify-center rounded-md border border-grey-400 px-2.5 py-2 text-sm font-semibold text-primary-900 hover:bg-grey-200"
                        onMouseEnter={toggleMoreInfo}
                        onMouseLeave={toggleMoreInfo}
                      >
                        +{formData.selectedProducts.length - 4} more
                        {showMoreInfo && (
                          <div className="relative">
                            <div className="absolute bottom-[44px] hidden w-[167px] -translate-x-[65%] translate-y-0 flex-col items-start gap-1.5 rounded-lg bg-white p-3 text-sm font-medium text-primary-900 group-hover:flex">
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

          <div className="absolute left-0 top-0 h-full w-full" onClick={handleCloseProductRecommendationModal}></div>
        </div>
      )}
    </div>
  )
}

export default RecommendationsTemplatePage
