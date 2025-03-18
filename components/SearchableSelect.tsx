import { ButtonHTMLAttributes, forwardRef, useState } from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/Command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { cn } from "@/lib/utils"

interface SearchableSelectProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  options: {
    label: string
    value: string
  }[]
  onValueChange: (value: string) => void
  defaultValue?: string
  placeholder?: string
  animation?: number
  maxCount?: number
  modalPopover?: boolean
  asChild?: boolean
  className?: string
}

const SearchableSelect = forwardRef<HTMLButtonElement, SearchableSelectProps>(
  (
    {
      options,
      onValueChange,
      defaultValue = "",
      placeholder = "Select options",
      modalPopover = false,
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = useState<string>(defaultValue)
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev)
    }

    const handleSelect = (value: string) => {
      setSelectedValue(value)
      onValueChange(value)
      setIsPopoverOpen(false)
    }

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "border-grey-400 text-primary-900 ring-ring ring-offset-background focus:ring-ring flex h-10 w-full items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm hover:bg-transparent focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
          >
            {selectedValue ? (
              <div className="flex w-full items-center justify-between">
                <p
                  className="text-primary-900 flex items-center overflow-hidden text-ellipsis"
                  style={{ maxWidth: "calc(100% - 1.5rem)" }}
                >
                  {selectedValue}
                </p>
                <ChevronDown className="text-primary-900 h-5 w-5 min-w-5 cursor-pointer" />
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="text-grey-800 overflow-hidden text-sm text-ellipsis">{placeholder}</span>
                <ChevronDown className="text-primary-800 h-5 w-5 min-w-5 cursor-pointer" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start" onEscapeKeyDown={() => setIsPopoverOpen(false)}>
          <Command className="bg-popover rounded-lg shadow-md">
            <CommandInput placeholder="Search..." />
            <CommandList style={{ scrollbarWidth: "none" }}>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="p-0">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer"
                  >
                    <span>{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

SearchableSelect.displayName = "SearchableSelect"

export default SearchableSelect
