import {OrderController} from './order.controller';
import {OrderService} from '../service/order.service';
import {Change} from 'firebase-functions/lib/cloud-functions';
import {DocumentSnapshot} from 'firebase-functions/lib/providers/firestore';
import {EventContext} from 'firebase-functions';
import {Product} from '../../product/model/product';

export class OrderControllerFirebase implements OrderController {
  constructor(private service: OrderService) {

  }

  public updateProductInfo(snap: Change<DocumentSnapshot>, context: EventContext): Promise<Product> {
    const productAfter = snap.after.data() as Product;
    return this.service.updateProductInfo(productAfter);
  }


}
