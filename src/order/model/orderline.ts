import {Product} from '../../product/model/product';

export interface Orderline {
	id?: string;
	product: Product;
	amountBought: number;
}
