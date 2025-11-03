export interface Promotion {
  id: number;
  product_id: number | null;
  product_name?: string;
  discount: number;
  start_date: string | null;
  end_date: string | null;
}

export interface CreatePromotionData {
  product_id: number | null;
  discount: number;
  start_date?: string | null;
  end_date?: string | null;
}
