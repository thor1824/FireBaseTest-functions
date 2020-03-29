import {StockController} from './stock.controller';
import {Change} from 'firebase-functions/lib/cloud-functions';
import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {EventContext} from 'firebase-functions';
import {Product} from '../../product/model/product';
import {Order} from '../../order/model/order';
import {StockService} from '../service/stock.service';
import {StockEntry} from '../model/stockEntry';

export class StockControllerFirebase implements StockController {
	constructor(private service: StockService) {

	}

	public createStockEntry(snap: Change<DocumentSnapshot>, context: EventContext): Promise<StockEntry> {
		const productAfter = snap.after.data() as Product;
		return this.service.createStockEntry({
			product: productAfter,
			inStock: 5,
		});
	}

	public pluckProducts(snap: Change<DocumentSnapshot>, context: EventContext): Promise<Order> {
		const orderAfter = snap.after.data() as Order;
		return this.service.pluckProducts(orderAfter);
	}

	public updateProductInfo(snap: Change<DocumentSnapshot>, context: EventContext): Promise<StockEntry> {
		const productAfter = snap.after.data() as Product;
		return this.service.updateProductInfo(productAfter);
	}


}
