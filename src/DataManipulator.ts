// responsible for processing the raw stock data we receive from the server
// before the Graph component renders it.
import { ServerRespond } from './DataStreamer';
// updated to match new schema 
export interface Row {
  price_abc: number,
  price_def: number,
  ratio:number;
  timestamp: Date,
  upper_bound:number,
  lower_bound:number,
  trigger_alert:number | undefined
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]):Row {
    const priceABC =(serverRespond[0].top_ask.price + serverRespond[0].top_bid.price)/2;
    const priceDEF =(serverRespond[1].top_ask.price + serverRespond[1].top_bid.price)/2;
    const ratio = priceABC /priceDEF ;
    const upperBound = 1 + 0.05 ;
    const lowerBound = 1 - 0.05 ;
    return {
       price_abc:priceABC,
       price_def:priceDEF,
       ratio,
       timestamp:serverRespond[0].timestamp > serverRespond[1].timestamp ?
            serverRespond[0].timestamp :serverRespond[1].timestamp,
       lower_bound:lowerBound,
       upper_bound:upperBound,
       trigger_alert :(ratio > upperBound  || ratio < lowerBound) ? ratio : undefined,
};
  }
}
