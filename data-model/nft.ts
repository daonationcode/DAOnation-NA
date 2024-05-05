export interface Bid {
  date: string;
  walletAddress: string;
  bidder: string;
  bidAmount: number;
}

export interface NFT {
  id: string;
  name: string;
  url: string;
  description: string;
  highestBid: Bid;
  bidHistory: Bid[];
}
