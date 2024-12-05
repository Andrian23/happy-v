"use client"

import { FC, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Ellipsis } from "lucide-react"

import { IngredientsCard } from "@/components/IngredientsCard"
import PageTopic from "@/components/PageTopic"
import { ProductCounter } from "@/components/ProductCounter"
import { Button } from "@/components/ui/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Check } from "@/icons/Check"
import { useSupplementInfo } from "@/lib/useSupplementInfo"
import { ShopifyProduct, VariantEdge } from "@/models/product"
import { useShopifyCartStore } from "@/stores/shopifyCart"

interface Ingredient {
  name: string
  subName?: string
  amount: string
  dv?: string
}

interface ProductDetailsProps {
  product: ShopifyProduct
  ingredients: Ingredient[]
}

export const ProductDetails: FC<ProductDetailsProps> = ({ product, ingredients }) => {
  const addToCart = useShopifyCartStore((state) => state.addToCart)
  const [selectedVariant, setSelectedVariant] = useState<VariantEdge>(product.variants.edges[0])
  const [count, setCount] = useState(1)
  const [notify, setNotify] = useState(false)
  const [isOneTimePurchase, setIsOneTimePurchase] = useState(true)

  const { supplementInfo } = useSupplementInfo(product)

  const selectedVariantPercentage =
    selectedVariant.node?.sellingPlanGroups?.edges.length > 0
      ? selectedVariant.node?.sellingPlanGroups?.edges[0]?.node.sellingPlans.edges[0].node.pricingPolicies[0]
          .adjustmentValue.percentage
      : 0

  const handleAddToCart = async () => {
    try {
      if (isOneTimePurchase) {
        await addToCart(selectedVariant.node.id, count, null, supplementInfo?.bottleSizeFirst)
        return
      }

      const is30DaySupply = selectedVariant.node.title.includes("30-day")
      const sellingPlanGroup = selectedVariant.node?.sellingPlanGroups?.edges.find((edge) =>
        is30DaySupply ? edge.node.name === "Delivery every 1 month" : edge.node.name === "Delivery every 3 months"
      )

      const sellingPlanId = sellingPlanGroup?.node?.sellingPlans?.edges[0]?.node?.id || null

      await addToCart(selectedVariant.node.id, count, sellingPlanId, supplementInfo?.bottleSizeFirst)
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const getPrice = () => {
    if (isOneTimePurchase) {
      return parseFloat(selectedVariant.node.price)
    }

    return (
      Math.ceil(
        (parseFloat(selectedVariant.node.price) -
          (parseFloat(selectedVariant.node.price) * selectedVariantPercentage) / 100) *
          100
      ) / 100
    )
  }

  const discountedPrice = getPrice()

  return (
    <div className="my-2.5 block h-screen w-full lg:px-4">
      <PageTopic>
        <Button asChild variant="link" className="h-auto w-auto gap-2 justify-self-start p-0 text-primary-800">
          <Link href="/products" className="inline-flex gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back to products
          </Link>
        </Button>
      </PageTopic>
      <div className="mt-6">
        <h5 className="text-lg font-semibold">Choose Variant</h5>
        <div className="mt-2 flex gap-4">
          <Button
            variant={isOneTimePurchase ? "primary" : "primary-outline"}
            onClick={() => {
              setSelectedVariant({
                node: product.variants.edges[0].node,
              })
              setIsOneTimePurchase(true)
            }}
            className="px-6 py-2 text-sm"
          >
            One-time purchase
          </Button>
          {product.variants.edges.map(({ node: variant }) => (
            <Button
              key={variant.id}
              variant={variant.id === selectedVariant?.node.id && !isOneTimePurchase ? "primary" : "primary-outline"}
              onClick={() => {
                setSelectedVariant({ node: variant })
                setIsOneTimePurchase(false)
              }}
              className="px-6 py-2 text-sm"
            >
              {variant?.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 border-b border-grey-400 pb-6 lg:flex-row lg:gap-10 lg:pb-8">
        <div className="flex aspect-square h-full max-h-64 w-full max-w-80 shrink-0 grow items-center justify-center justify-self-center rounded-2xl bg-grey-200 max-lg:order-1 max-lg:mx-auto">
          <Image
            src={selectedVariant.node.image?.src || product.images.edges[0].node.src}
            alt={selectedVariant.node.image?.altText ?? ""}
            width={150}
            height={150}
          />
        </div>

        <div className="flex items-center max-lg:order-2 max-lg:w-full">
          <div className="w-full">
            <div className="text-xl font-semibold text-primary-900">{product.title}</div>
            {supplementInfo && (
              <div className="mt-2 text-sm text-primary-900">Servings: {supplementInfo.bottleSizeFirst}</div>
            )}
            <div className="mt-2 text-xs text-grey-800">SKU: {selectedVariant.node.sku}</div>
            <div className="mt-6 flex flex-col">
              {(selectedVariant.node.compareAtPrice || selectedVariant.node.price !== discountedPrice.toFixed(2)) && (
                <div className="text-xs text-grey-800">
                  <span className="line-through">
                    ${selectedVariant.node.compareAtPrice || selectedVariant.node.price}
                  </span>{" "}
                  Retail
                </div>
              )}
              <div className="flex">
                <div className="price text-2xl font-semibold text-primary-900">${discountedPrice.toFixed(2)}</div>
                <div className="ml-2 mt-4 text-xs text-grey-800">Wholesale</div>
              </div>
            </div>
            <div className="flex">
              {product.status === "ACTIVE" && selectedVariant.node.inventoryQuantity !== 0 ? (
                <div className="mt-2 flex w-full gap-2">
                  <ProductCounter onCountChange={setCount} />
                  <Button size="md" variant="primary-outline" onClick={handleAddToCart}>
                    Add to Cart
                  </Button>
                </div>
              ) : (
                <div className="mt-2 block w-full">
                  {!notify ? (
                    <Button size="md" variant="primary" onClick={() => setNotify(true)}>
                      Notify when it appears
                    </Button>
                  ) : (
                    <div className="notify flex items-center gap-2 text-sm text-primary-900">
                      <Check />
                      We will notify you of availability
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="-mt-12 ml-auto h-6 w-6 cursor-pointer text-primary-900 lg:mt-4 lg:h-8 lg:w-8"
          >
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Download product one-pager</DropdownMenuItem>
            <DropdownMenuItem>Copy affiliate link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="my-6 grid gap-6 pb-6 lg:grid-cols-3 lg:gap-x-20">
        <IngredientsCard
          className="lg:col-start-3"
          servingSize={supplementInfo?.servingSize}
          servingsNumber={supplementInfo?.servingsNumber}
        />

        <div className="text-primary-900 lg:col-span-2 lg:col-start-1 lg:row-start-1">
          <h5 className="text-base font-bold">Ingredients</h5>

          <Table>
            <TableCaption className="text-left">
              {supplementInfo?.notes.dvNote && <span>{supplementInfo.notes.dvNote}</span>}

              {supplementInfo?.notes.percentDailyValue && <span>{supplementInfo.notes.percentDailyValue}</span>}
            </TableCaption>
            <TableHeader className="text-[10px] uppercase text-grey-800 [&_tr]:border-0">
              <TableRow>
                <TableHead className="h-auto p-0">Name</TableHead>
                <TableHead className="h-auto p-0 text-center">Amount Per Serving</TableHead>
                <TableHead className="h-auto p-0 text-right">%DV*</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:last-child]:border-b">
              {ingredients.map((fact, index) => (
                <TableRow key={index}>
                  <TableCell className="max-w-48 px-0 py-3">
                    <span className="font-semibold">{fact.name}</span>
                    {fact.subName && (
                      <>
                        <br />
                        <span>{fact.subName}</span>
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{fact.amount}</TableCell>
                  <TableCell className="text-right">{fact.dv || "**"}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="px-0 py-3">
                  {supplementInfo?.otherIngredients && (
                    <div dangerouslySetInnerHTML={{ __html: supplementInfo.otherIngredients }} />
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {product.descriptionHtml && (
          <div className="text-primary-900 lg:col-span-2">
            <h5 className="text-base font-bold">Description</h5>
            <div className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
          </div>
        )}
      </div>
    </div>
  )
}
