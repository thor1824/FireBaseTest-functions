import {Change, EventContext} from 'firebase-functions';
import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {Product} from '../../product/model/product';

export interface OrderController {

	updateProductInfo(snap: Change<DocumentSnapshot>, context: EventContext): Promise<Product>;
}
