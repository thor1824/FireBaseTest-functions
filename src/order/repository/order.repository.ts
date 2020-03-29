import {Product} from '../../product/model/product';

export interface OrderRepository {

  updateProductInfo(productAfter: Product): Promise<Product>;
}
