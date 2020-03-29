import {Product} from '../../product/model/product';

export interface StockEntry {
	id?: string;
	product: Product;
	inStock: number;
}
