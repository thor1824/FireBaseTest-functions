import {OrderRepository} from './order.repository';
import {Product} from '../../product/model/product';
import * as admin from 'firebase-admin';
import {Order} from '../model/order';

const colName = 'orders';

export class OrderRepositoryFirebase implements OrderRepository {
	public updateProductInfo(productAfter: Product): Promise<void> {

		const promise = new Promise<void>((resolve, reject) => {

			this.db().collection(colName).get().then(value => {
				for (let i = 0; i < value.docs.length; i++) {
					var wasUpdated = false;
					const order = value.docs[i].data() as Order;
					for (let j = 0; j < order.orderLines.length; j++) {
						if (order.orderLines[j].product.id) {
							order.orderLines[j].product = productAfter;
							wasUpdated = true;
						}
					}
					if (wasUpdated) {
						this.updateOrder(order);
					}
				}
			});
		});
		return promise;
	}

	public updateOrder(order: Order) {
		return this.db().doc(`${colName}/${order.id}`).update(order);
	}

	db(): FirebaseFirestore.Firestore {
		return admin.firestore();
	}
}
