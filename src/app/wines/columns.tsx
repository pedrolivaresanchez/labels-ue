import { Wine } from "@/types/wine"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { Row } from "@tanstack/react-table"

export const columns = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }: { row: Row<Wine> }) => {
      const wine = row.original
      return (
        <div className="flex items-center justify-center">
          {wine.image_url ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={wine.image_url}
                alt={wine.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-xs">Sin imagen</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "food_name",
    header: "Denominación",
  },
  {
    accessorKey: "alcohol_percentage",
    header: "Alcohol (%)",
  },
  {
    id: "actions",
    cell: ({ row }: { row: Row<Wine> }) => {
      const wine = row.original

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/wines/${wine.id}`}>
                  Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/wines/${wine.id}/preview`}>
                  Vista previa
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
] 