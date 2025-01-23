'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function WinesTableSkeleton() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="h-8 w-[150px] animate-pulse rounded-md bg-gray-200" />
        <div className="h-8 w-[200px] animate-pulse rounded-md bg-gray-200" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Nombre del Alimento</TableHead>
            <TableHead className="text-right">Energía (kcal)</TableHead>
            <TableHead className="text-right">Cantidad (cl)</TableHead>
            <TableHead className="text-right">Alcohol %</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="h-4 w-[140px] animate-pulse rounded bg-gray-200" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-[160px] animate-pulse rounded bg-gray-200" />
              </TableCell>
              <TableCell className="text-right">
                <div className="h-4 w-[60px] ml-auto animate-pulse rounded bg-gray-200" />
              </TableCell>
              <TableCell className="text-right">
                <div className="h-4 w-[50px] ml-auto animate-pulse rounded bg-gray-200" />
              </TableCell>
              <TableCell className="text-right">
                <div className="h-4 w-[40px] ml-auto animate-pulse rounded bg-gray-200" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-[180px] animate-pulse rounded bg-gray-200" />
              </TableCell>
              <TableCell className="text-right">
                <div className="h-8 w-8 ml-auto animate-pulse rounded bg-gray-200" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 