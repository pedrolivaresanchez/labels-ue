"use client"

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

interface NutritionalTableProps {
  wine: {
    id: string;
    energyKj: number;
    energyKcal: number;
    fat: number;
    saturatedFat: number;
    carbohydrate: number;
    sugars: number;
    protein: number;
    salt: number;
  };
}

export function NutritionalTable({ wine }: NutritionalTableProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">100 ml</h3>
        <Table>
          <TableBody>
            <TableRow className="border-b">
              <TableCell className="py-2 font-bold">valor energético kJ</TableCell>
              <TableCell className="py-2 text-right">{wine.energyKj} kJ</TableCell>
            </TableRow>
            <TableRow className="border-b">
              <TableCell className="py-2">valor energético kcal</TableCell>
              <TableCell className="py-2 text-right">{wine.energyKcal} kcal</TableCell>
            </TableRow>
            <TableRow className="border-b">
              <TableCell className="py-2 font-bold">grasas</TableCell>
              <TableCell className="py-2 text-right">{wine.fat} g</TableCell>
            </TableRow>
            <TableRow className="border-b">
              <TableCell className="py-2 pl-8">de las cuales saturadas</TableCell>
              <TableCell className="py-2 text-right">{wine.saturatedFat} g</TableCell>
            </TableRow>
            <TableRow className="border-b">
              <TableCell className="py-2 font-bold">hidratos de carbono</TableCell>
              <TableCell className="py-2 text-right">{wine.carbohydrate} g</TableCell>
            </TableRow>
            <TableRow className="border-b">
              <TableCell className="py-2 pl-8">de los cuales azúcares</TableCell>
              <TableCell className="py-2 text-right">{wine.sugars} g</TableCell>
            </TableRow>
            <TableRow className="border-b">
              <TableCell className="py-2 font-bold">proteínas</TableCell>
              <TableCell className="py-2 text-right">{wine.protein} g</TableCell>
            </TableRow>
            <TableRow className="border-b">
              <TableCell className="py-2 font-bold">sal</TableCell>
              <TableCell className="py-2 text-right">{wine.salt} g</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}