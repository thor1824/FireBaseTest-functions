import {Orderline} from './orderline';

export interface Order {
	id?: string;
	orderLines: Orderline[];
}
