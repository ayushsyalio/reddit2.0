"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { GetSubreaditsQueryResult } from "@/sanity.types";

interface SubreaditComboBoxProps {
  subreadits: GetSubreaditsQueryResult;
  defaultValue?: string;
}

export default function SubreaditComboBox({
  subreadits,
  defaultValue = "",
}: SubreaditComboBoxProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  //handle selection of subreadit
  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    setOpen(false);

    //update the URL query parameter
    if (currentValue) {
      router.push(`/create-post?subreadit=${currentValue}`);
    } else {
      router.push(`/create-post`);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? subreadits.find((subreadit) => subreadit.title === value)
                ?.title || "Select a community"
            : "Select a community"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Seach Community..."/>
            <CommandList>
              <CommandEmpty>No subreadits found</CommandEmpty>
              <CommandGroup>
                {subreadits.map((subreadit) => (
                  <CommandItem
                    key={subreadit._id}
                    value={subreadit.title ?? ""}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 w-4 h-4",
                        value === subreadit.title ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {subreadit.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          
        </Command>
      </PopoverContent>
    </Popover>
  );
}
