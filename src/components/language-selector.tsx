import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";

export function LanguageSelector() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Image
            src="/images/gb.svg"
            alt="English"
            width={20}
            height={20}
          />
          English
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <div className="flex items-center gap-2">
            <Image
              src="/images/gb.svg"
              alt="English"
              width={20}
              height={20}
            />
            English
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 