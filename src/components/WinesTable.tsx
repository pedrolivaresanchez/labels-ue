"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, QrCode, Eye, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { UUID } from "@/lib/supabase"
import { Wine } from "@/types/wine"

const columnLabels: Record<string, string> = {
  ean_code: "Código EAN",
  food_name: "Nombre del Alimento",
  energy_kcal: "Energía (kcal)",
  net_quantity_cl: "Cantidad (cl)",
  alcohol_percentage: "Alcohol %",
  origin: "Origen"
};

export interface WinesTableProps {
  data: Wine[]
  onDelete: (id: string) => void
  onQRDownload: (wine: Wine) => Promise<{ dataUrl: string; fileName: string }>
  onDuplicate: (wine: Wine) => void
  duplicatingId?: string | null
}

export const columns: ColumnDef<Wine>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const wine = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="font-medium">{wine.name}</div>
          {wine.ingredients?.some(i => i.isAllergen) && (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Alérgeno</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "ean_code",
    header: () => <div className="text-center">Código EAN</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("ean_code")}</div>,
    enableHiding: true
  },
  {
    accessorKey: "food_name",
    header: () => <div className="text-center">Nombre del Alimento</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("food_name")}</div>,
    enableHiding: true
  },
  {
    accessorKey: "energy_kcal",
    header: () => <div className="text-center">Energía (kcal)</div>,
    cell: ({ row }) => {
      const value = row.getValue("energy_kcal") as number
      return <div className="text-center">{value}</div>
    },
    enableHiding: true
  },
  {
    accessorKey: "net_quantity_cl",
    header: () => <div className="text-center">Cantidad (cl)</div>,
    cell: ({ row }) => {
      const value = row.getValue("net_quantity_cl") as number
      return <div className="text-center">{value}</div>
    },
    enableHiding: true
  },
  {
    accessorKey: "alcohol_percentage",
    header: () => <div className="text-center">Alcohol %</div>,
    cell: ({ row }) => {
      const value = row.getValue("alcohol_percentage") as number
      return <div className="text-center">{value}%</div>
    },
    enableHiding: true
  },
  {
    accessorKey: "origin",
    header: () => <div className="text-center">Origen</div>,
    cell: ({ row }) => {
      const wine = row.original
      return <div className="text-center">{wine.place_of_origin}, {wine.country_of_origin}</div>
    },
    enableHiding: true
  },
  {
    id: "public-view",
    header: () => <div className="text-center">Ver</div>,
    cell: ({ row }) => {
      const wine = row.original;
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/public/wines/${wine.id}`, '_blank');
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ver vista pública</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "qr",
    header: () => <div className="text-center">QR</div>,
    cell: ({ row, table }) => {
      const wine = row.original;
      const { onQRDownload } = table.options.meta as { 
        onQRDownload?: (wine: Wine) => Promise<{ dataUrl: string; fileName: string }> 
      };

      if (!onQRDownload) return null;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={async (e) => {
                  e.stopPropagation();
                  const { dataUrl, fileName } = await onQRDownload(wine);
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
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const wine = row.original;
      const { onDelete, onQRDownload, onDuplicate, duplicatingId } = table.options.meta as { 
        onDelete: (id: string) => void, 
        onQRDownload?: (wine: Wine) => Promise<{ dataUrl: string; fileName: string }>,
        onDuplicate?: (wine: Wine) => void,
        duplicatingId?: string | null
      };

      const isDuplicating = duplicatingId === wine.id;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/wines/view/${wine.id}`}>
                Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/wines/edit/${wine.id}`}>
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onQRDownload && (
              <DropdownMenuItem onClick={async () => {
                const { dataUrl, fileName } = await onQRDownload(wine);
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}>
                Descargar QR
              </DropdownMenuItem>
            )}
            {onDuplicate && (
              <DropdownMenuItem 
                onClick={() => onDuplicate(wine)}
                disabled={isDuplicating}
              >
                {isDuplicating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Duplicando...
                  </>
                ) : (
                  'Duplicar vino'
                )}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                if (wine.id) onDelete(wine.id);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function WinesTable({ data, onDelete, onQRDownload, onDuplicate, duplicatingId }: WinesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    select: false,
    ean_code: false,
    food_name: false,
    energy_kcal: false,
    net_quantity_cl: false,
    alcohol_percentage: false,
    origin: false,
  })
  const [rowSelection, setRowSelection] = React.useState({})

  // Show more columns on larger screens
  React.useEffect(() => {
    const updateVisibility = () => {
      if (window.innerWidth < 640) { // mobile
        setColumnVisibility({
          select: false,
          ean_code: false,
          food_name: false,
          energy_kcal: false,
          net_quantity_cl: false,
          alcohol_percentage: false,
          origin: false,
        })
      } else if (window.innerWidth >= 640) { // sm and above
        setColumnVisibility({
          select: true,
          ean_code: false,
          food_name: true,
          energy_kcal: true,
          net_quantity_cl: false,
          alcohol_percentage: true,
          origin: true,
        })
      }
    }

    updateVisibility()
    window.addEventListener('resize', updateVisibility)
    return () => window.removeEventListener('resize', updateVisibility)
  }, [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      onDelete,
      onQRDownload,
      onDuplicate,
      duplicatingId,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columnas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnLabels[column.id] || column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={(e) => {
                    // Prevent navigation if clicking on buttons, checkboxes, or dropdown menu
                    if (
                      (e.target as HTMLElement).closest('button') ||
                      (e.target as HTMLElement).closest('[role="checkbox"]') ||
                      (e.target as HTMLElement).closest('[role="menuitem"]') ||
                      (e.target as HTMLElement).closest('[data-state="open"]')
                    ) {
                      return;
                    }
                    window.location.href = `/wines/view/${row.original.id}`;
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 py-4">
        <div className="flex-1 text-sm text-muted-foreground text-center sm:text-left">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <div className="text-sm text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
} 