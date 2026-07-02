export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string;
  width: number | null;
  height: number | null;
};

export type ShopifySelectedOption = {
  name: string;
  value: string;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  selectedOptions: ShopifySelectedOption[];
};

export type ShopifyProductCard = {
  id: string;
  handle: string;
  title: string;
  featuredImage: ShopifyImage | null;
  minPrice: ShopifyMoney | null;
};

export type ShopifyProductDetail = ShopifyProductCard & {
  description: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
};

export type ShopifyCollectionProducts = {
  handle: string;
  title: string;
  products: ShopifyProductCard[];
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandiseId: string;
  productTitle: string;
  variantTitle: string;
  image: ShopifyImage | null;
  price: ShopifyMoney;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: ShopifyMoney | null;
  lines: ShopifyCartLine[];
};
