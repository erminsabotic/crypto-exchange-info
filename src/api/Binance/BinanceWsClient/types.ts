interface IOrderStreamResponse {
  data: IOrder;
  stream: string;
}

interface IOrder {
  E: number; // Event time
  U: number; // First update ID in event
  a: [string, string][]; // asks (sell) - array of arrays of length 2. Firs item is Price level to be updated second is quantity
  b: [string, string][]; // bids (buys) - array of arrays of length 2. Firs item is Price level to be updated second is quantity
  e: string; // Event type
  s: string; // Symbol
  u: number;
}

interface IChannelSettings {
  method: string;
  params: string[];
  id: number;
}

export type { IChannelSettings, IOrderStreamResponse, IOrder };
