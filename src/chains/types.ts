/** UI- and RPC-oriented network metadata for a supported chain (name, explorer, Alchemy base URL, native asset). */
export type Network = {
  name: string;
  chainId: number;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
    logo: string;
  };
  rpcBaseUrl: string;
  explorerUrl: string;
};
