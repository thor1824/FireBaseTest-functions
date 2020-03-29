import {ProductController} from './product/controller/product.controller';
import {ProductRepositoryFirebase} from './product/repository/product.repository.firebase';
import {ProductRepository} from './product/repository/product.repository';
import {ProductService} from './product/service/product.service';
import {ProductControllerFirebase} from './product/controller/product.controller.firebase';
import {StockController} from './stock/controller/stock.controller';
import {StockService} from './stock/service/stock.service';
import {StockRepository} from './stock/repository/stock.repository';
import {StockRepositoryFirebase} from './stock/repository/stock.repository.firebase';
import {StockControllerFirebase} from './stock/controller/stock.controller.firebase';
import {OrderControllerFirebase} from './order/controller/order.controller.firebase';
import {OrderService} from './order/service/order.service';
import {OrderRepositoryFirebase} from './order/repository/order.repository.firebase';
import {OrderRepository} from './order/repository/order.repository';
import {OrderController} from './order/controller/order.controller';
import {UserRepository} from './user/repository/user.repository';
import {UserRepositoryFirebase} from './user/repository/user.repository.firebase';
import {UserService} from './user/service/user.service';
import {UserControllerFirebase} from './user/controller/user.controller.firebase';

export class DependencyFactory {
	getProductController(): ProductController {
		const repo: ProductRepository = new ProductRepositoryFirebase();
		const service: ProductService = new ProductService(repo);
		return new ProductControllerFirebase(service);
	}

	getStockController(): StockController {
		const repo: StockRepository = new StockRepositoryFirebase();
		const service: StockService = new StockService(repo);
		return new StockControllerFirebase(service);
	}

	getOrderController(): OrderController {
		const repo: OrderRepository = new OrderRepositoryFirebase();
		const service: OrderService = new OrderService(repo);
		return new OrderControllerFirebase(service);
	}

	getUserController(): OrderController {
		const repo: UserRepository = new UserRepositoryFirebase();
		const service: UserService = new UserService(repo);
		return new UserControllerFirebase(service);
	}

}
