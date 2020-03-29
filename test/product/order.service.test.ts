import {IMock, Mock} from 'moq.ts';
import {OrderService} from '../../src/order/service/order.service';
import {OrderRepository} from '../../src/order/repository/order.repository';
import {Product} from '../../src/product/model/product';

describe('OrderService', () => {
	let orderRepository: IMock<OrderRepository>;
	let orderService: OrderService;


	const prodGood: Product = {price: 100, name: 'fisk', id: 'testId'};
	const prodBad: Product = {price: 100, name: 'fisk'};


	it('updateProductInfo: : Throw no errors', async () => {
		orderRepository = new Mock<OrderRepository>()
			.setup(sr => sr.updateProductInfo(prodGood))
			.returns(new Promise((resolve) => {
				resolve(prodGood);
			}));

		orderService = new OrderService(orderRepository.object());

		const prod = await orderService.updateProductInfo(prodGood);
		expect(prod).toEqual(prodGood);
	});

	it('updateProductInfo: Throw parsed Error', async () => {
		orderRepository = new Mock<OrderRepository>()
			.setup(sr => sr.updateProductInfo(prodGood))
			.returns(new Promise((resolve, reject) => {
				return reject({error: 'test'});
			}));
		orderService = new OrderService(orderRepository.object());

		try {
			await orderService.updateProductInfo(prodGood);
		} catch (e) {
			expect(e).toEqual({error: 'test'});
		}
	});

	it('updateProductInfo: Throw error if no product id', async () => {
		orderRepository = new Mock<OrderRepository>()
			.setup(sr => sr.updateProductInfo(prodBad))
			.returns(new Promise((resolve) => {
				resolve(prodBad);
			}));
		orderService = new OrderService(orderRepository.object());
		try {
			await orderService.updateProductInfo(prodBad);
		} catch (e) {
			expect(e).toEqual(
				{
					error: 'updateProductInfo: product has no id'
				});
		}
	});
});
