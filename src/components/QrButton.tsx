"use client"

import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface QrButtonProps {
  onDownload: () => Promise<{ dataUrl: string; fileName: string }>;
}

export function QrButton({ onDownload }: QrButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={async () => {
              const { dataUrl, fileName } = await onDownload();
              const link = document.createElement('a');
              link.href = dataUrl;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Descargar código QR</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 