"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { IngredientsCard } from "@/components/IngredientsCard"
import { ProductCounter } from "@/components/ProductCounter"
import { Button } from "@/components/ui/Button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Check } from "@/icons/Check"
import type { Product } from "@/models/product"
import dotsIcon from "@/public/Dots.svg"
import productAvailableImage from "@/public/Product-available.svg"
import { useCartStore } from "@/stores/cart"

import PageTopic from "../PageTopic"

const ingredients = [
  {
    name: "Vitamin C",
    description: "(as ascorbic acid)",
    amount: "500mg",
    dv: "555%",
  },
  {
    name: "Vitamin B",
    description: "(as pyridoxine HCI)",
    amount: "2mg",
    dv: "118%",
  },
  {
    name: "Potassium",
    description: "(as potassium citrate)",
    amount: "100mg",
    dv: "2%",
  },
  {
    name: "D-Mannose",
    description: "(Uclear®)",
    amount: "2000mg",
    dv: "**",
  },
  {
    name: "Pacran",
    description: "Cranberry Fruit 50:1 Extract(Vaccinium macrocarpon)",
    amount: "500mg",
    dv: "**",
  },
  {
    name: "Uva Ursi Leaf",
    description: "4:1 Extract (Arctostaphylos uva-ursi)",
    amount: "200mg",
    dv: "**",
  },
  {
    name: "Hibiscus Flower Powder",
    amount: "50mg",
    dv: "**",
  },
]

type ProductDetailsProps = {
  product: Product
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const addToCart = useCartStore((state) => state.addProduct)
  const [count, setCount] = useState(1)
  const [notify, setNotify] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const toggleOptions = () => {
    setShowOptions(!showOptions)
  }

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

      <div className="mt-4 flex justify-between max-md:block">
        <div className="image flex w-[30%] items-center justify-center rounded-2xl bg-grey-200 max-md:w-full">
          <Image
            src={product?.image?.src || productAvailableImage}
            alt="ProductImage"
            className="h-[150px] w-[150px]"
            width={150}
            height={150}
          />
        </div>
        <div className="ml-2 flex w-[30%] items-center max-md:w-full">
          <div className="w-full">
            <div className="text-xl font-semibold text-primary-900">{product.title}</div>
            <div className="mt-2 text-sm text-primary-900">Servings: {product.variants[0].grams} grams</div>
            <div className="mt-2 text-xs text-grey-800">SKU: {product.variants[0].sku}</div>
            <div className="mt-6 text-xs text-grey-800">
              <span className="line-through">${product.variants[0].price}</span> Retail
            </div>
            <div className="flex">
              <div className="price text-2xl font-semibold text-primary-900">${product.variants[0].price}</div>
              <div className="ml-2 mt-4 text-xs text-grey-800">Wholesale</div>
            </div>

            <div className="mt-6 flex">
              {product && product.status === "active" ? (
                <div className="mt-2 flex w-full gap-2">
                  <ProductCounter onCountChange={setCount} />
                  <Button size="md" variant="primary-outline" onClick={() => addToCart(product, count)}>
                    Add to Cart
                  </Button>
                </div>
              ) : (
                <div className="mt-2 block w-full">
                  {!notify && (
                    <Button size="md" variant="primary" onClick={() => setNotify(true)}>
                      Notify when it appears
                    </Button>
                  )}
                  {notify && (
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
        <div className="share mr-1 mt-4 flex h-6 w-[30%] justify-end max-md:hidden">
          <div className="relative block">
            <Image src={dotsIcon} className="h-6 w-6" alt="dots" onClick={toggleOptions} />
            {showOptions && (
              <div
                className="z-1 absolute right-0 top-5 h-auto w-[15rem] rounded-xl p-4 text-primary-900"
                style={{ boxShadow: "0px 8px 24px 0px rgba(42, 50, 52, 0.08)" }}
              >
                <div className="pointer my-2 text-sm">Download product one-pager</div>
                <div className="pointer text-sm">Copy affiliate link</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="my-6 grid gap-6 pb-6 lg:grid-cols-3 lg:gap-x-20">
        <IngredientsCard className="lg:col-start-3" />

        <div className="text-primary-900 lg:col-span-2 lg:col-start-1 lg:row-start-1">
          <h5 className="text-base font-bold">Ingredients</h5>

          <Table>
            <TableCaption className="text-left">
              * %DV based on a 2000-calorie diet. DV may be higher or lower depending on individual calorie needs.
              <br /> ** Percent Daily Value not established
            </TableCaption>
            <TableHeader className="text-[10px] uppercase text-grey-800 [&_tr]:border-0">
              <TableRow>
                <TableHead className="h-auto p-0">Name</TableHead>
                <TableHead className="h-auto p-0 text-center">Amount Per Serving</TableHead>
                <TableHead className="h-auto p-0 text-right">%DV*</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr:last-child]:border-b">
              {ingredients.map(({ name, amount, description, dv }) => (
                <TableRow key={name}>
                  <TableCell className="px-0 py-3">
                    <span className="font-semibold">{name}</span>
                    <br />
                    {description && <span>{description}</span>}
                  </TableCell>
                  <TableCell className="px-0 py-3 text-center font-semibold">{amount}</TableCell>
                  <TableCell className="px-0 py-3 text-end font-semibold">{dv}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="px-0 py-3">
                  <span className="font-semibold">Other Ingredients:</span> Natural Flavors, Silicon Dioxide, and Stevia
                  Leaf Extract (Stevia rebaudiana).
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {product.body_html && (
          <div className="text-primary-900 lg:col-span-2">
            <h5 className="text-base font-bold">Description</h5>
            <div className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: product.body_html }} />
          </div>
        )}
      </div>
    </div>
  )
}