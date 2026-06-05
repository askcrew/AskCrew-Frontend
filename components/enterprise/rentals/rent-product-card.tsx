"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconCurrencyDollar,
  IconMapPin,
  IconStar,
  IconPackage,
} from "@tabler/icons-react";
import { ApiRentalProduct } from "./products-data-table/schema";
import { useState } from "react";
import Image from "next/image";
import { RentProductDialog } from "./rent-product-dialog";

interface RentProductCardProps {
  product: ApiRentalProduct;
}

export function RentProductCard({ product }: RentProductCardProps) {
  const [rentDialogOpen, setRentDialogOpen] = useState(false);

  // const conditionConfig = {
  //   excellent: {
  //     label: "Excellent",
  //     className:
  //       "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400",
  //   },
  //   good: {
  //     label: "Good",
  //     className:
  //       "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400",
  //   },
  //   fair: {
  //     label: "Fair",
  //     className:
  //       "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  //   },
  // };

  // const config =
  //   conditionConfig[product.condition as keyof typeof conditionConfig];

  return (
    <>
      <Card className="group relative overflow-hidden border-2 border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-orange-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 pointer-events-none" />

        {/* Product Image */}
        <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-orange-500/20 to-purple-500/20">
          {product.image  && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {/* Availability Badge */}
          {product.is_active && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-green-500 text-white font-semibold">
                Available
              </Badge>
            </div>
          )}
          {/* Condition Badge */}
          {/* <div className="absolute top-2 right-2">
            <Badge variant="outline" className={config.className}>
              {config.label}
            </Badge>
          </div> */}
        </div>

        <CardHeader className="relative space-y-3 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <Badge
                variant="secondary"
                className="bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400"
              >
                {product.type}
              </Badge>
              <h3 className="text-xl font-bold leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-3 pb-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconMapPin className="size-4" />
            <span>{product.location}</span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <IconCurrencyDollar className="size-4 text-orange-500" />
              <span className="font-bold text-orange-600 text-lg">
                ${product.price_per_day}
              </span>
              <span className="text-muted-foreground">/day</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {/* <div className="flex items-center gap-1.5">
              <IconPackage className="size-4" />
              <span className="font-medium">
                {product.totalRentals} rentals
              </span>
            </div> */}
            <div className="flex items-center gap-1.5">
              <IconStar className="size-4 fill-orange-500 text-orange-500" />
              <span className="font-medium">4.8</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="relative pt-4 border-t border-orange-500/10">
          <Button
            onClick={() => setRentDialogOpen(true)}
            disabled={!product.is_active}
            className="w-full bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconPackage className="mr-2 size-4" />
            {product.is_active ? "Rent Now" : "Not Available"}
          </Button>
        </CardFooter>
      </Card>

      <RentProductDialog
        product={product}
        open={rentDialogOpen}
        onOpenChange={setRentDialogOpen}
      />
    </>
  );
}
