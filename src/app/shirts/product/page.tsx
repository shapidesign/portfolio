"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShopifyProductDetailClient } from "@/components/ui/ShopifyProductDetailClient";

function ShirtsProductInner() {
  const handle = useSearchParams().get("handle") ?? "";
  return <ShopifyProductDetailClient handle={handle} backHref="/shirts" />;
}

export default function ShirtsProductPage() {
  return (
    <Suspense>
      <ShirtsProductInner />
    </Suspense>
  );
}
