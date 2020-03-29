import {OrderRepository} from '../repository/order.repository';
import {Product} from '../../product/model/product';

export class OrderService {
  constructor(private repo: OrderRepository) {

  }

  public updateProductInfo(productAfter: Product): Promise<Product> {
    return new Promise((resolve, reject) => {
      if(!productAfter.id) {
        reject({error: 'updateProductInfo: product has no id'})
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
