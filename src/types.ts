export interface Artwork {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  edition: string;
  dimensions: string;
  pen: string;
  paper: string;
  algorithm: string;
  plotTime: string;
  plotSpeed: string;
  year: number;
  description: string;
  story: string;
  image: string;
  objectPosition?: string;
  imageScale?: string;
  category: 'geometric' | 'topography' | 'moire' | 'isometric';
  additionalImages: Array<{
    url: string;
    caption: string;
    alt: string;
  }>;
  featured: boolean;
  inStock: number;
}

export type FrameOption = 'unframed' | 'black-gallery' | 'natural-oak';

export interface CartItem {
  artwork: Artwork;
  quantity: number;
  frameOption: FrameOption;
  framePrice: number;
}

export interface ShippingAddress {
  email: string;
  phone: string;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expDate: string;
  cvc: string;
  cardholderName: string;
}

export interface OrderRecord {
  orderId: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
}
