import {StockService} from '../../src/stock/service/stock.service';
import {StockRepository} from '../../src/stock/repository/stock.repository';
import {IMock, Mock} from 'moq.ts';
import {Product} from '../../src/product/model/product';
import {StockEntry} from '../../src/stock/model/stockEntry';
import {Order} from '../../src/order/model/order';

describe('ProductService', () => {
  let stockRepository: IMock<StockRepository>;
  let stockService: StockService;

  const prodGood: Product = {price: 100, name: 'fisk', id: 'testId'};
  const prodGood2: Product = {price: 100, name: 'fisk2', id: 'testId'};
  const prodBad: Product = {price: 100, name: 'fisk'};

  const stockEntrySucc: StockEntry = {inStock: 5, product: prodGood};
  const stockBadProd: StockEntry = {inStock: 5, product: prodBad};
  const stockEntryFail: StockEntry = {inStock: 0, product: prodGood};

  const orderGood: Order = {
    id: 'testid',
    orderLines: [{product: prodGood, amountBought: 5}, {product: prodGood2, amountBought: 1}]
  };
  const orderNoID: Order = {
    orderLines: [{product: prodGood, amountBought: 5}, {product: prodGood2, amountBought: 5}]
  };
  const orderProdNoID: Order = {
    id: 'testid',
    orderLines: [{product: prodGood, amountBought: 5}, {product: prodBad, amountBought: 5}]
  };
  const orderBoughtLessThanOne: Order = {
    id: 'testid',
    orderLines: [{product: prodGood, amountBought: 5}, {product: prodGood2, amountBought: 0}]
  };
  const orderBoughtLessThanOne2: Order = {
    id: 'testid2',
    orderLines: [{product: prodGood, amountBought: -1}, {product: prodGood2, amountBought: 5}]
  };

  it('createStockEntry: Throw no errors', async () => {
    stockRepository = new Mock<StockRepository>()
      .setup(sr => sr.createStockEntry(stockEntrySucc))
      .returns(new Promise((resolve) => {
        resolve(stockEntrySucc);
      }));

    stockService = new StockService(stockRepository.object());
    const stock = await stockService.createStockEntry(stockEntrySucc);
    expect(stock).toEqual(stockEntrySucc);
  });

  it('createStockEntry: Throw parsed Error', async () => {
    stockRepository = new Mock<StockRepository>()
      .setup(sr => sr.createStockEntry(stockEntrySucc))
      .returns(new Promise((resolve, reject) => {
        return reject({error: 'test'});
      }));

    stockService = new StockService(stockRepository.object());
    try {
      await stockService.createStockEntry(stockEntrySucc);
    } catch (e) {
      expect(e).toEqual({error: 'test'});
    }
  });

  it('createStockEntry: Throw error if inStock was not set', async () => {
    stockRepository = new Mock<StockRepository>()
      .setup(sr => sr.createStockEntry(stockEntrySucc))
      .returns(new Promise((resolve) => {
        resolve(stockEntryFail);
      }));

    stockService = new StockService(stockRepository.object());
    try {
      await stockService.createStockEntry(stockEntrySucc);
    } catch (e) {
      expect(e).toEqual({
        error: 'createStockEntry: stock was not set'
      });
    }
  });

  it('createStockEntry: Throw error if no product id', async () => {
    stockRepository = new Mock<StockRepository>()
      .setup(sr => sr.createStockEntry(stockBadProd))
      .returns(new Promise((resolve) => {
        resolve(stockEntryFail);
      }));

    stockService = new StockService(stockRepository.object());
    try {
      await stockService.createStockEntry(stockBadProd);
    } catch (e) {
      expect(e).toEqual({
        error: 'createStockEntry: product has no id',
      });
    }
  });

  it('pluckProducts: : Throw no errors', async () => {
    stockRepository = new Mock<StockRepository>()
      .setup(sr => sr.pluckProducts(orderGood))
      .returns(new Promise((resolve) => {
        resolve(orderGood);
      }));

    stockService = new StockService(stockRepository.object());

    const order = await stockService.pluckProducts(orderGood);
    expect(order).toEqual(orderGood);
  });

  it('pluckProducts: : Throw error if no order id', async () => {
    stockRepository = new Mock<StockRepository>()
      .setup(sr => sr.pluckProducts(orderNoID))
      .returns(new Promise((resolve) => {
        resolve(orderNoID);
      }));

    stockService = new StockService(stockRepository.object());
    try {
      await stockService.pluckProducts(orderNoID);
    } catch (e) {
      expect(e).toEqual({
        error: `pluckProducts: order has no id`
      });
    }
  });

  it('pluckProducts: : Throw error if no product id', async () => {
    stockRepository = new Mock<StockRepository>()
      .setup(sr => sr.pluckProducts(orderProdNoID))
      .returns(new Promise((resolve) => {
        resolve(orderProdNoID);
      }));

    stockService = new StockService(stockRepository.object());
    try {
      await stockService.pluckProducts(orderProdNoID);
    } catch (e) {
      expect(e).toEqual({
        error: `pluckProducts: product(${prodBad.name}) had no id in order(${orderProdNoID.id})`,
      });
    }
  });

  it('pluckProducts: : Throw error if stock below 1', async () => {
    // noinspection DuplicatedCode
    stockRepository = new Mock<StockRepository>()
      .setup(sr => sr.pluckProducts(orderBoughtLessThanOne))
      .returns(new Promise((resolve) => {
        resolve(orderBoughtLessThanOne);
      }));

    stockRepository = new Mock<StockRepository>()
      .setup(sr => sr.pluckProducts(orderBoughtLessThanOne2))
      .returns(new Promise((resolve) => {
        resolve(orderBoughtLessThanOne2);
      }));
    stockService = new StockService(stockRepository.object());
    try {
      await stockService.pluckProducts(orderBoughtLessThanOne);
    } catch (e) {
      expect(e).toEqual({
        error: `pluckProducts: amountBought below 1 on product(${prodGood2.id}) had no id in order(${orderBoughtLessThanOne.id})`,
      });
    }
    try {
      await stockService.pluckProducts(orderBoughtLessThanOne2);
    } catch (e) {
      expect(e).toEqual({
        error: `pluckProducts: amountBought below 1 on product(${prodGood.id}) had no id in order(${orderBoughtLessThanOne2.id})`,
      });
    }
  });

  it('pluckProducts: : Throw error if stock below 1', async () => {
    stockRepository = new Mock<StockRepository>()
      .setup(sr => sr.pluckProducts(orderGood))
      .returns(new Promise((resolve, reject) => {
        return reject({error: 'test'});
      }));

    stockService = new StockService(stockRepository.object());
    try {
      await stockService.pluckProducts(orderGood);
    } catch (e) {
      expect(e).toEqual({error: 'test'});
    }
  });

  it('updateProductInfo: : Throw no errors', async () => {
    stockRepository = new Mock<StockRepository>()
      .setup(sr => sr.updateProductInfo(prodGood))
      .returns(new Promise((resolve) => {
        resolve(stockEntrySucc);
      }));

    stockService = new StockService(stockRepository.object());

    const stockEntry = await stockService.updateProductInfo(prodGood);
    expect(stockEntry).toEqual(stockEntrySucc);
  });

  it('updateProductInfo: Throw parsed Error', async () => {
    stockRepository = new Mock<StockRepository>()
      .setup(sr => sr.updateProductInfo(prodGood))
      .returns(new Promise((resolve, reject) => {
        return reject({error: 'test'});
      }));
    stockService = new StockService(stockRepository.object());

    try {
      await stockService.updateProductInfo(prodGood);
    } catch (e) {
      expect(e).toEqual({error: 'test'});
    }
  });

  it('updateProductInfo: Throw error if no product id', async () => {
    stockRepository = new Mock<StockRepository>()
      .setup(sr => sr.updateProductInfo(prodBad))
      .returns(new Promise((resolve) => {
        resolve(stockEntrySucc);
      }));
    stockService = new StockService(stockRepository.object());
    try {
      await stockService.updateProductInfo(prodBad);
    } catch (e) {
      expect(e).toEqual(
        {
          error: 'updateProductInfo: product has no id'
        });
    }
  });

});
