export interface Bid {
  date: string;
  walletAddress: string;
  bidder: string;
  bidAmount: number;
}

export interface NFT {
  id: string;
  eventid?: string;
  name: string;
  url: string;
  description: string;
  sender_wallet?: string;
  reciever_wallet?: string;
  highest_amount?: number;
  highest_bidder?: string;
  highestBid: Bid;
  bidHistory: Bid[];
}
