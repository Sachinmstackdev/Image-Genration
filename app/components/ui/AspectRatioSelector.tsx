import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

const aspectRatios = [
  { value: "1:1", label: "Square 1:1" },
  { value: "3:2", label: "Landscape 3:2" },
  { value: "2:3", label: "Portrait 2:3" },
  { value: "16:9", label: "Widescreen 16:9" },
  { value: "4:5", label: "Portrait 4:5" },
];

interface AspectRatioSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function AspectRatioSelector({ value, onValueChange }: AspectRatioSelectorProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SelectPrimitive.Value placeholder="Select aspect ratio" />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <SelectPrimitive.Viewport className="p-1">
            {aspectRatios.map((ratio) => (
              <SelectPrimitive.Item
                key={ratio.value}
                value={ratio.value}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                )}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>{ratio.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
} 