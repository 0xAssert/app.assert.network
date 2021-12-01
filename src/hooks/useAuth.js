//import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

export const useAuth = () => {
  const web3 = useWeb3React();
  return {
    ...web3,
  };
};