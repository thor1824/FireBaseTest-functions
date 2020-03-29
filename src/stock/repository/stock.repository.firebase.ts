import {StockRepository} from './stock.repository';
import {StockEntry} from '../model/stockEntry';
import * as admin from 'firebase-admin';
import {Order} from '../../order/model/order';
import {Product} from '../../product/model/product';

const colName = 'stock';

export class StockRepositoryFirebase implements StockRepository {

	get db(): FirebaseFirestore.Firestore {
		return admin.firestore();
	}

	public createStockEntry(stockEntry: StockEntry): Promise<StockEntry> {
		return new Promise((resolve, reject) => {
			try {
				this.db.collection(colName).doc(<string> stockEntry.product.id).set(stockEntry)
					.then(() => {
						resolve((stockEntry));
					})
					.catch(reason => {
						reject({error: reason});
					});
			} catch (e) {
				reject({error: e});
			}
		});
	}

	public async pluckProducts(order: Order): Promise<Order> {
		return new Promise((resolve, reject) => {
			try {
				for (let i = 0; i < order.orderLines.length; i++) {
					const prod = order.orderLines[i].product;
					if (prod.id) {
						this.db.collection(colName).doc(prod.id).get()
							.then(value => {
								const stockEntry = value.data() as StockEntry;
								stockEntry.inStock = stockEntry.inStock - order.orderLines[i].amountBought;
								this.updateStock(stockEntry);
							})
							.catch(reason => {
								reject({error: reason});
							});
					}
				}
				resolve(order);
			} catch (e) {
				reject({error: e});
			}
		});
	}

	public updateProductInfo(productAfter: Product): Promise<StockEntry> {
		return new Promise((resolve, reject) => {
			try {
				if (productAfter.id != null) {
					this.db.collection(colName).doc(productAfter.id).get().then(value => {
						const stockEntry = value.data() as StockEntry;
						stockEntry.product = productAfter;
						this.updateStock(stockEntry)
							.then(value1 => {
								resolve(stockEntry);
							})
							.catch(reason => {
								reject({error: reason});
							});
					});
				}
			} catch (e) {
				reject({error: e});
			}
		});
	}

	private updateStock(stockEntry: StockEntry): Promise<StockEntry> {
		return new Promise((resolve, reject) => {
			try {
				this.db.doc(`${colName}/${stockEntry.product.id}`).update(stockEntry)
					.then(() => {
						resolve(stockEntry);
					})
					.catch(reason => {
						reject({error: reason});
					});
			} catch (e) {
				reject({error: e});
			}
		});
	}
}
