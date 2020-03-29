import {EventContext} from 'firebase-functions';
import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {Change} from 'firebase-functions/lib/cloud-functions';
import {StockEntry} from '../model/stockEntry';
import {Order} from '../../order/model/order';

export interface StockController {

  createStockEntry(snap: Change<DocumentSnapshot>, context: EventContext): Promise<StockEntry>;

  pluckProducts(snap: Change<DocumentSnapshot>, context: EventContext): Promise<Order>;

  updateProductInfo(snap: Change<DocumentSnapshot>, context: EventContext): Promise<StockEntry>;
}
