import {StockEntry} from '../model/stockEntry';
import {Order} from '../../order/model/order';
import {Product} from '../../product/model/product';

export interface StockRepository {

	createStockEntry(stockEntry: StockEntry): Promise<StockEntry>;

	pluckProducts(order: Order): Promise<Order>;

	updateProductInfo(productAfter: Product): Promise<StockEntry>;
}
