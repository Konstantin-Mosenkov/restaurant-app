"use client"
import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
// import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
export function DatePicker() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  return (
    <div className="flex flex-col gap-3">
      {/* <Label htmlFor="date" className="px-1 text-wave-500">
        Дата бронирования
      </Label> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-wave-500 outline-1 -outline-offset-1 outline-white/10 placeholder:text-wave-500 focus:outline-2 focus:-outline-offset-2 active:bg-gold-500/10 hover:bg-gold-500/10 sm:text-sm/6 border-wave-500"
          >
            {date ? date.toLocaleDateString() : "Выберите дату"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0 bg-milk-500 border-wave-500" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}