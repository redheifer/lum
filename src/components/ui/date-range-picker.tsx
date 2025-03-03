import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  from: Date;
  to: Date;
  onFromChange: (date: Date) => void;
  onToChange: (date: Date) => void;
  className?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
  className,
  disabled = false,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !from && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {from ? (
              to ? (
                <>
                  {format(from, "PPP")} - {format(to, "PPP")}
                </>
              ) : (
                format(from, "PPP")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 p-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium mb-2">From</span>
              <Calendar
                mode="single"
                selected={from}
                onSelect={(date) => date && onFromChange(date)}
                initialFocus
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium mb-2">To</span>
              <Calendar
                mode="single"
                selected={to}
                onSelect={(date) => date && onToChange(date)}
                initialFocus
                disabled={(date) => date < from}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 