import { ShopifyProductDetailClient } from "@/components/ui/ShopifyProductDetailClient";
import { getCollectionProductHandles, getDefaultCollectionHandles } from "@/lib/shopify-storefront";

type MerchProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateStaticParams() {
  const { merchCollectionHandle } = getDefaultCollectionHandles();
  try {
    const handles = await getCollectionProductHandles(merchCollectionHandle);
    return handles.map((handle) => ({ handle }));
  } catch {
    return [];
  }
}

export default async function MerchProductPage({ params }: MerchProductPageProps) {
  const { handle } = await params;
  return <ShopifyProductDetailClient handle={handle} backHref="/merch" />;
}
