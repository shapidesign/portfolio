"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShopifyProductDetailClient } from "@/components/ui/ShopifyProductDetailClient";

function MerchProductInner() {
  const handle = useSearchParams().get("handle") ?? "";
  return <ShopifyProductDetailClient handle={handle} backHref="/merch" />;
}

export default function MerchProductPage() {
  return (
    <Suspense>
      <MerchProductInner />
    </Suspense>
  );
}
