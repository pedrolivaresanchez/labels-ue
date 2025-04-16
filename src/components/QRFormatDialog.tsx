import { useState } from "react";
import { QRFormat } from "@/utils/qr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileCode, FileImage, FileText } from "lucide-react";

interface QRFormatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (format: QRFormat) => void;
}

export function QRFormatDialog({ 
  open, 
  onOpenChange,
  onDownload 
}: QRFormatDialogProps) {
  const [format, setFormat] = useState<QRFormat>('png');

  const handleDownload = () => {
    onDownload(format);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Descargar código QR</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">
              Selecciona el formato de descarga:
            </label>
            <Select 
              value={format} 
              onValueChange={(value) => setFormat(value as QRFormat)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    <span>PNG (Imagen)</span>
                  </div>
                </SelectItem>
                <SelectItem value="svg" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    <span>SVG (Vector)</span>
                  </div>
                </SelectItem>
                <SelectItem value="pdf" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>PDF (Documento)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <div className="mt-2 text-xs text-muted-foreground">
              {format === 'png' && "Formato de imagen estándar, ideal para la web y redes sociales."}
              {format === 'svg' && "Formato vectorial que mantiene la calidad en cualquier tamaño."}
              {format === 'pdf' && "Documento PDF con el código QR listo para imprimir."}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDownload}
            className="w-full sm:w-auto"
          >
            Descargar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 