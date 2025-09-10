import { defineChain } from "viem";
import { sepolia as sepoliaOriginal } from "viem/chains";

// GIWA Sepolia chain config (sesuai docs)
export const giwaSepolia = defineChain({
  id: 91342,
  name: 'Giwa Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://sepolia-rpc.giwa.io'],
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
    l2OutputOracle: {},
    disputeGameFactory: {
      [sepoliaOriginal.id]: {
        address: '0x37347caB2afaa49B776372279143D71ad1f354F6',
      },
    },
    portal: {
      [sepoliaOriginal.id]: {
        address: '0x956962C34687A954e611A83619ABaA37Ce6bC78A',
      },
    },
    l1StandardBridge: {
      [sepoliaOriginal.id]: {
        address: '0x77b2ffc0F57598cAe1DB76cb398059cF5d10A7E7',
      },
    },
  },
  testnet: true,
});

// Pakai Sepolia default (sesuai docs GIWA pakai http() tanpa custom URL)
export const sepolia = sepoliaOriginal;
