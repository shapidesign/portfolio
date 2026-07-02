import { ShopifyProductDetailClient } from "@/components/ui/ShopifyProductDetailClient";
import { getCollectionProductHandles, getDefaultCollectionHandles } from "@/lib/shopify-storefront";

type ShirtsProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateStaticParams() {
  const { shirtsCollectionHandle } = getDefaultCollectionHandles();
  try {
    const handles = await getCollectionProductHandles(shirtsCollectionHandle);
    return handles.map((handle) => ({ handle }));
  } catch {
    return [];
  }
}

export default async function ShirtsProductPage({ params }: ShirtsProductPageProps) {
  const { handle } = await params;
  return <ShopifyProductDetailClient handle={handle} backHref="/shirts" />;
}
