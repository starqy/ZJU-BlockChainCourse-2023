import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'HTTP://127.0.0.1:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x402dbc419392d4ebcba780dbe0980e234ccaae7a85bc684e840e067fe98aadcc',
        '0x6b4d1712c6ac615dc4af00a2ce05654b9ffe26c4c432cf11cec5e437484405a7',
      ]
    },
  },
};

export default config;
