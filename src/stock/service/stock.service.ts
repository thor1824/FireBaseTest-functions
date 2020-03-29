import {StockRepository} from '../repository/stock.repository';
import {StockEntry} from '../model/stockEntry';
import {Order} from '../../order/model/order';
import {Product} from '../../product/model/product';

export class StockService {
	constructor(private repo: StockRepository) {

	}

	public createStockEntry(stockEntry: StockEntry): Promise<StockEntry> {
		return new Promise((resolve, reject) => {
			if (!stockEntry.product.id) {
				reject({
					error: 'createStockEntry: product has no id',
				});
			}
			this.repo.createStockEntry(stockEntry)
				.then(value => {
					if (value.inStock === 0) {
						reject({
							error: 'createStockEntry: stock was not set',
						});
					}
					resolve(value);
				})
				.catch(reason => {
					reject({error: reason}.error);
				});
		});
	}

	public pluckProducts(order: Order): Promise<Order> {
		return new Promise<Order>((resolve, reject) => {
			if (!order.id) {
				reject({
					error: 'pluckProducts: order has no id',
				});
			}
			for (let i = 0; i < order.orderLines.length; i++) {
				if (!order.orderLines[i].product.id) {
					reject({
						error: `pluckProducts: product(${order.orderLines[i].product.name}) had no id in order(${order.id})`,
					});
				}
				if (order.orderLines[i].amountBought <= 0) {
					reject({
						error: `pluckProducts: amountBought below 1 on product(${order.orderLines[i].product.id}) had no id in order(${order.id})`,
					});
				}
			}
			this.repo.pluckProducts(order)
				.then(value => {
					resolve(value);
				})
				.catch(reason => {
					reject({error: reason}.error);
				});

		});
	}

	public updateProductInfo(productAfter: Product): Promise<StockEntry> {
		return new Promise<StockEntry>((resolve, reject) => {
			if (!productAfter.id) {
				reject({
					error: 'updateProductInfo: product has no id',
				});
			}
			this.repo.updateProductInfo(productAfter)
				.then(value => {
					resolve(value);
				})
				.catch(reason => {
					reject({error: reason}.error);
				});
		});
	}
}
