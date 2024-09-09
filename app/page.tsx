import Image from "next/image"
import Link from "next/link"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion"
import { buttonVariants } from "@/components/ui/Button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Carousel"
import { FacebookIcon, InstagramIcon, NextArrowIcon, PrevArrowIcon, QuoteIcon, TikTokIcon } from "@/icons"
import { cn } from "@/lib/utils"
import heroImage from "@/public/hero-img.png"
import headerLogo from "@/public/logo-main.svg"
import mainImage from "@/public/main-1.png"
import mainImage2 from "@/public/main-2.png"
import mainImage3 from "@/public/main-3.png"
import personImage from "@/public/person-1.png"
import personImage2 from "@/public/person-2.png"
import productImage from "@/public/product-1.png"
import productImage2 from "@/public/product-2.png"
import productImage3 from "@/public/product-3.png"
import productImage4 from "@/public/product-4.png"

const socialLinks = [
  { icon: <InstagramIcon />, href: "https://www.instagram.com/myhappyv/" },
  { icon: <TikTokIcon />, href: "https://www.tiktok.com/@myhappyv" },
  { icon: <FacebookIcon />, href: "https://www.facebook.com/myhappyv/" },
]

const offers = [
  {
    title: "Wholesale Products",
    description:
      "Clinically-proven probiotic strains with the ability to produce Lactic Acid and Hydrogen Peroxide, the natural defenses these bacteria make to ward off harmful pathogens, including Escherichia coli, Gardnerella vaginalis, Streptococcus agalactiae,",
    image: productImage,
  },
  {
    title: "Affiliate Program",
    description:
      "Clinically-proven probiotic strains with the ability to produce Lactic Acid and Hydrogen Peroxide, the natural defenses these bacteria make to ward off harmful pathogens, including Escherichia coli, Gardnerella vaginalis, Streptococcus agalactiae,",
    image: productImage2,
  },
  {
    title: "Recommendations for Patients",
    description:
      "Clinically-proven probiotic strains with the ability to produce Lactic Acid and Hydrogen Peroxide, the natural defenses these bacteria make to ward off harmful pathogens, including Escherichia coli, Gardnerella vaginalis, Streptococcus agalactiae,",
    image: productImage3,
  },
  {
    title: "Community Forum",
    description:
      "Clinically-proven probiotic strains with the ability to produce Lactic Acid and Hydrogen Peroxide, the natural defenses these bacteria make to ward off harmful pathogens, including Escherichia coli, Gardnerella vaginalis, Streptococcus agalactiae,",
    image: productImage4,
  },
]

const faqs = [
  {
    question: "Question 1",
    answer:
      "Clinically-proven probiotic strains with the ability to produce Lactic Acid and Hydrogen Peroxide, thenatural defenses these bacteria make to ward off harmful pathogens, including Escherichia coli, Gardnerella.",
  },
  {
    question: "Question 2",
    answer:
      "Clinically-proven probiotic strains with the ability to produce Lactic Acid and Hydrogen Peroxide, thenatural defenses these bacteria make to ward off harmful pathogens, including Escherichia coli, Gardnerella.",
  },
  {
    question: "Question 3",
    answer:
      "Clinically-proven probiotic strains with the ability to produce Lactic Acid and Hydrogen Peroxide, thenatural defenses these bacteria make to ward off harmful pathogens, including Escherichia coli, Gardnerella.",
  },
  {
    question: "Question 4",
    answer:
      "Clinically-proven probiotic strains with the ability to produce Lactic Acid and Hydrogen Peroxide, thenatural defenses these bacteria make to ward off harmful pathogens, including Escherichia coli, Gardnerella.",
  },
  {
    question: "Question 5",
    answer:
      "Clinically-proven probiotic strains with the ability to produce Lactic Acid and Hydrogen Peroxide, thenatural defenses these bacteria make to ward off harmful pathogens, including Escherichia coli, Gardnerella.",
  },
]

const quotes = [
  {
    image: personImage,
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,adipiscing elit,",
    name: "Christina Adams",
    role: "Gynecologist",
  },
  {
    image: personImage2,
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,adipiscing elit,",
    name: "Christina Adams",
    role: "Gynecologist",
  },
  {
    image: personImage,
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,adipiscing elit,",
    name: "Christina Adams",
    role: "Gynecologist",
  },
  {
    image: personImage2,
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,adipiscing elit,",
    name: "Christina Adams",
    role: "Gynecologist",
  },
]

const recommendations = [
  {
    badge: "Recommendations",
    title: "Create recommendations for your patients",
    description:
      "Clinically-proven probiotic strains with the ability to produce Lactic Acid and Hydrogen Peroxide, the natural defenses these bacteria make to ward off harmful pathogens, including Escherichia coli, Gardnerella.",
    image: mainImage,
  },
  {
    badge: "Share Recommendations",
    title: "Share your care",
    description:
      "Clinically-proven probiotic strains with the ability to produce Lactic Acid and Hydrogen Peroxide, the natural defenses these bacteria make to ward off harmful pathogens, including Escherichia coli, Gardnerella.",
    image: mainImage2,
  },
  {
    badge: "Discounts",
    title: "Help your patients save",
    description:
      "Clinically-proven probiotic strains with the ability to produce Lactic Acid and Hydrogen Peroxide, the natural defenses these bacteria make to ward off harmful pathogens, including Escherichia coli, Gardnerella.",
    image: mainImage3,
  },
]

export default async function HomePage() {
  return (
    <>
      <header className="mx-auto flex max-w-12xl items-center justify-between border-b border-grey-400 px-4 py-5 lg:border-none lg:px-18 lg:py-6 2xl:px-42">
        <Link href="/" className="relative h-6 w-32 lg:h-8 lg:w-48 2xl:h-11 2xl:w-64">
          <Image src={headerLogo} alt="Happy V logo" fill className="object-contain" />
        </Link>

        <div className="flex gap-2 lg:gap-3">
          <Link
            href="/sign-in"
            className={cn(
              "px-4 py-2.5 text-primary-900 lg:px-6 lg:py-4",
              buttonVariants({ variant: "primary-outline", size: "auto" })
            )}
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className={cn("px-4 py-2.5 lg:px-6 lg:py-4", buttonVariants({ variant: "primary", size: "auto" }))}
          >
            Sign up
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto mt-8 flex flex-col gap-8 px-4 text-primary-900 lg:max-w-12xl lg:flex-row lg:items-center lg:gap-20 lg:px-18 2xl:gap-10 2xl:px-42">
          <div className="flex flex-col gap-6 lg:gap-10">
            <h1 className="text-3xl font-semibold leading-9 lg:text-6xl 2xl:text-7xl">
              Doctor Engagement and Affiliation Program
            </h1>
            <p className="text-sm font-normal lg:text-lg 2xl:text-xl">
              Clinically effective Nutraceuticals that target multiple root causes of thinning hair in men and women.
              From the #1 dermatologist-recommended hair growth supplement brand.*
            </p>
            <div className="flex gap-2 lg:gap-4 2xl:gap-5">
              <Link
                className={cn(
                  "px-4 py-2.5 text-primary-900 lg:px-16 lg:py-3.5 lg:text-2xl 2xl:px-20 2xl:py-6 2xl:text-4xl",
                  buttonVariants({ variant: "primary-outline", size: "auto" })
                )}
                href="/sign-in"
              >
                Log in
              </Link>
              <Link
                className={cn(
                  "px-4 py-2.5 lg:px-16 lg:py-3.5 lg:text-2xl 2xl:px-20 2xl:py-6 2xl:text-4xl",
                  buttonVariants({ variant: "primary", size: "auto" })
                )}
                href="/sign-up"
              >
                Sign up
              </Link>
            </div>
          </div>
          <div className="relative h-[306px] w-[342px] overflow-hidden rounded-2xl lg:h-[493px] lg:w-full lg:max-w-[451px] lg:shrink-0 2xl:h-[670px] 2xl:w-[612px]">
            <Image fill className="object-cover" src={heroImage} alt="hero image" />
          </div>
        </section>

        <section className="mx-auto mt-13 max-w-12xl px-4 text-primary-900 lg:mt-32 lg:px-18 2xl:px-42">
          <h2 className="text-2xl font-semibold lg:text-5xl 2xl:text-6xl">What we are offering</h2>

          <Carousel className="mt-5 w-full lg:mt-12 2xl:mt-16">
            <div className="absolute right-0 hidden gap-4 lg:-top-[104px] lg:flex 2xl:-top-[126px]">
              <CarouselPrevious
                icon={<PrevArrowIcon />}
                variant="primary-outline"
                className="static h-16 w-16 translate-x-0 translate-y-0 rounded-full border-2 p-3"
              />

              <CarouselNext
                icon={<NextArrowIcon />}
                variant="primary-outline"
                className="static flex h-16 w-16 translate-x-0 translate-y-0 rounded-full border-2 p-3"
              />
            </div>

            <CarouselContent className="lg:-ml-8 2xl:-ml-13">
              {offers.map(({ title, description, image }) => (
                <CarouselItem
                  key={title}
                  className="basis-[306px] pl-5 text-primary-900 lg:basis-[632px] lg:pl-8 2xl:basis-[652px] 2xl:pl-13"
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-grey-200">
                    <div className="flex flex-col gap-3 p-6 pb-3 lg:gap-6 lg:p-13 lg:pb-6 2xl:p-18 2xl:pb-9">
                      <h3 className="text-xl lg:text-[34px] 2xl:text-5xl 2xl:leading-[62px]">{title}</h3>
                      <p className="text-sm lg:text-lg 2xl:text-xl">{description}</p>
                    </div>
                    <div className="relative mt-auto h-[186px] w-full lg:h-[375px] 2xl:h-[450px]">
                      <Image className="object-" fill src={image} alt="product-1" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        <section className="mx-auto mt-13 flex max-w-12xl flex-col gap-13 px-4 text-primary-900 lg:mt-34 lg:px-18 2xl:px-42">
          {recommendations.map(({ badge, title, description, image }) => (
            <div key={badge} className="group flex flex-col lg:grid lg:grid-cols-2 lg:gap-14">
              <div className="flex flex-col lg:max-w-lg lg:justify-center lg:group-odd:order-1">
                <div className="mr-auto rounded-md border border-primary-500 px-3 py-1.5 text-sm font-medium leading-[16px] lg:rounded-2xl lg:border-2 lg:p-[16px] lg:text-[18px]">
                  {badge}
                </div>
                <h3 className="mt-2 text-2xl font-semibold lg:mt-4 lg:text-4xl">{title}</h3>
                <p className="mt-4 text-sm lg:text-lg">{description}</p>
              </div>
              <div className="relative mx-auto mt-6 h-[376px] w-full overflow-hidden rounded-5xl lg:h-[596px]">
                <Image src={image} alt="main-1" fill className="object-cover" />
              </div>
            </div>
          ))}
        </section>

        <section className="mx-auto mt-13 max-w-12xl px-4 text-primary-900 lg:mt-34 lg:px-18 2xl:px-42">
          <h2 className="text-center text-2xl font-semibold lg:text-5xl 2xl:text-6xl">Frequently Asked Questions</h2>
          <div className="mt-5 lg:mt-8 2xl:mt-13">
            <Accordion type="single" collapsible className="flex flex-col gap-3 text-primary-900 lg:gap-5">
              {faqs.map(({ question, answer }) => (
                <AccordionItem
                  key={question}
                  value={question}
                  className="rounded-2xl bg-grey-200 px-5 py-2 lg:px-10 lg:py-5"
                >
                  <AccordionTrigger className="py-3 text-lg lg:py-5 lg:text-2xl 2xl:text-3xl 2xl:[&>svg]:h-6 2xl:[&>svg]:w-6">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-3xl pb-3 lg:pb-5 lg:text-lg 2xl:text-xl">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="mx-auto mt-13 max-w-12xl px-4 text-primary-900 lg:mt-32 lg:px-18 2xl:px-42">
          <h2 className="text-2xl font-semibold lg:text-5xl 2xl:text-6xl">Here is what our partners saying</h2>

          <Carousel className="mt-5 w-full lg:mt-12 2xl:mt-16">
            <div className="absolute right-0 hidden gap-4 lg:-top-[104px] lg:flex 2xl:-top-[126px]">
              <CarouselPrevious
                icon={<PrevArrowIcon />}
                variant="primary-outline"
                className="static h-16 w-16 translate-x-0 translate-y-0 rounded-full border-2 p-3"
              />

              <CarouselNext
                icon={<NextArrowIcon />}
                variant="primary-outline"
                className="static flex h-16 w-16 translate-x-0 translate-y-0 rounded-full border-2 p-3"
              />
            </div>

            <CarouselContent className="lg:-ml-8">
              {quotes.map(({ image, quote, name, role }, index) => (
                <CarouselItem key={index} className="text-primary-9000 basis-[314px] pl-5 lg:basis-[776px] lg:pl-8">
                  <div className="flex flex-col overflow-hidden rounded-3xl bg-grey-200 lg:flex-row">
                    <div className="relative h-[150px] shrink-0 lg:h-auto lg:w-[305px]">
                      <Image className="object-cover" fill src={image} alt="person-1" />
                    </div>
                    <div className="flex w-full flex-col items-center gap-5 p-5 text-primary-900 lg:gap-14 lg:p-12">
                      <QuoteIcon className="h-6 w-8 lg:h-14 lg:w-16" />
                      <h3 className="text-center text-xl font-normal leading-5 lg:mt-8 lg:text-3xl lg:leading-8">
                        {quote}
                      </h3>
                      <div className="mt-1 flex flex-col items-center gap-2">
                        <p className="text-sm font-medium leading-3 lg:text-xl lg:leading-5">{name}</p>
                        <p className="text-xs leading-3 lg:text-base lg:leading-4">{role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        <section className="mt-13 flex flex-col items-center bg-primary-100 px-6 py-13 text-primary-900 lg:mt-34 lg:py-34 2xl:py-40">
          <h2 className="text-2xl font-semibold lg:text-5xl 2xl:text-6xl">Ready to join the team?</h2>
          <p className="mt-4 text-sm font-medium lg:mt-6 lg:text-2xl 2xl:mt-12 2xl:text-4xl">
            Complete this form and we will contact you shortly.
          </p>
          <Link
            href="/sign-up"
            className={cn(
              "mt-6 px-4 py-2.5 lg:mt-10 lg:px-16 lg:py-3.5 lg:text-2xl 2xl:px-20 2xl:py-6 2xl:text-4xl",
              buttonVariants({ variant: "primary", size: "auto" })
            )}
          >
            Sign up
          </Link>
        </section>
      </main>

      <footer className="mx-auto flex max-w-12xl flex-col items-center gap-8 px-6 py-13 text-primary-900 lg:grid lg:grid-cols-3 lg:px-18 2xl:px-42">
        <Link href="#" className="relative h-6 w-36 lg:order-1 lg:h-8 lg:w-48 lg:justify-self-center">
          <Image src={headerLogo} alt="Happy V logo" fill className="object-contain" />
        </Link>

        <div className="flex-start flex shrink-0 gap-5">
          {socialLinks.map(({ icon, href }) => (
            <Link key={href} className="h-7 w-7" href={href} target="_blank" rel="noopener noreferrer">
              {icon}
            </Link>
          ))}
        </div>

        <p className="text-xs lg:order-2 lg:justify-self-end lg:text-end lg:text-base">
          &copy; 2021-{new Date().getFullYear()} Happy V. All Rights Reserved
        </p>
      </footer>
    </>
  )
}
