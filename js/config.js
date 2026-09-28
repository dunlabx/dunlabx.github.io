// IMPORTANT:
// This file is publicly downloadable by every website visitor.
// Store ONLY public receiving addresses here.
// NEVER store private keys, seed phrases, passwords, API secrets,
// recovery phrases, or other secrets.

window.SUPPORT_CONFIG = {
  site: { patreonUrl: "https://parteon.com/" },
  // Defaults are used only when that currency/network has an enabled address.
  defaultCurrency: "USDT",
  defaultNetwork: "TRC20",
  currencies: {
    BTC: { name: "Bitcoin", symbol: "BTC", icon: "assets/icons/currencies/btc.svg", enabled: true, networks: {
      // Keep disabled until address is replaced with a Bitcoin-format receiving address.
      BITCOIN: { name: "Bitcoin", label: "Bitcoin", icon: "assets/icons/networks/bitcoin.svg", enabled: false, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8", qrPrefix: "bitcoin:" },
      LIGHTNING: { name: "Lightning Network", label: "Lightning Network", icon: "assets/icons/networks/lightning.svg", enabled: false, address: "" }
    } },
    ETH: { name: "Ethereum", symbol: "ETH", icon: "assets/icons/currencies/eth.svg", enabled: true, networks: {
      ETHEREUM: { name: "Ethereum", label: "Ethereum", icon: "assets/icons/networks/ethereum.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" },
      ARBITRUM: { name: "Arbitrum One", label: "Arbitrum One", icon: "assets/icons/networks/arbitrum.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" },
      OPTIMISM: { name: "Optimism", label: "Optimism", icon: "assets/icons/networks/optimism.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" },
      BASE: { name: "Base", label: "Base", icon: "assets/icons/networks/base.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" }
    } },
    USDT: { name: "Tether", symbol: "USDT", icon: "assets/icons/currencies/usdt.svg", enabled: true, networks: {
      TRC20: { name: "TRON", label: "TRON (TRC20)", icon: "assets/icons/networks/tron.svg", enabled: true, address: "TEx1x1Wx2teXrwFq9pEvHK46QfsJBzjTG9" },
      ERC20: { name: "Ethereum", label: "Ethereum (ERC20)", icon: "assets/icons/networks/ethereum.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" },
      BEP20: { name: "BNB Smart Chain", label: "BNB Smart Chain (BEP20)", icon: "assets/icons/networks/bnb.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" },
      SOLANA: { name: "Solana", label: "Solana", icon: "assets/icons/networks/solana.svg", enabled: true, address: "DWgJfY6Ti8DU1FT1ZtyJ1sNWLWcoTWBNWj7tDyef49ea" },
      POLYGON: { name: "Polygon", label: "Polygon", icon: "assets/icons/networks/polygon.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" },
      ARBITRUM: { name: "Arbitrum One", label: "Arbitrum One", icon: "assets/icons/networks/arbitrum.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" },
      OPTIMISM: { name: "Optimism", label: "Optimism", icon: "assets/icons/networks/optimism.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" },
      AVALANCHE: { name: "Avalanche C-Chain", label: "Avalanche C-Chain", icon: "assets/icons/networks/avalanche.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" },
      TON: { name: "TON", label: "TON", icon: "assets/icons/networks/ton.svg", enabled: true, address: "UQC8FAGanwb17ds7DvGF3BZ2LkzrSBRIbUV2jCR_p6zY8dkv" }
    } },
    USDC: { name: "USD Coin", symbol: "USDC", icon: "assets/icons/currencies/usdc.svg", enabled: true, networks: {
      ERC20: { name: "Ethereum", label: "Ethereum (ERC20)", icon: "assets/icons/networks/ethereum.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" },
      BEP20: { name: "BNB Smart Chain", label: "BNB Smart Chain (BEP20)", icon: "assets/icons/networks/bnb.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" },
      SOLANA: { name: "Solana", label: "Solana", icon: "assets/icons/networks/solana.svg", enabled: false, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" },
      BASE: { name: "Base", label: "Base", icon: "assets/icons/networks/base.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" },
      POLYGON: { name: "Polygon", label: "Polygon", icon: "assets/icons/networks/polygon.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" }
    } },
    BNB: { name: "BNB", symbol: "BNB", icon: "assets/icons/currencies/bnb.svg", enabled: true, networks: {
      BSC: { name: "BNB Smart Chain", label: "BNB Smart Chain (BEP20)", icon: "assets/icons/networks/bnb.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" }
    } },
    SOL: { name: "Solana", symbol: "SOL", icon: "assets/icons/currencies/sol.svg", enabled: true, networks: {
      SOLANA: { name: "Solana", label: "Solana", icon: "assets/icons/networks/solana.svg", enabled: true, address: "DWgJfY6Ti8DU1FT1ZtyJ1sNWLWcoTWBNWj7tDyef49ea" }
    } },
    TON: { name: "Toncoin", symbol: "TON", icon: "assets/icons/currencies/ton.svg", enabled: true, networks: {
      TON: { name: "TON", label: "TON", icon: "assets/icons/networks/ton.svg", enabled: true, address: "UQC8FAGanwb17ds7DvGF3BZ2LkzrSBRIbUV2jCR_p6zY8dkv" }
    } },
    DOGE: { name: "Dogecoin", symbol: "DOGE", icon: "assets/icons/currencies/doge.svg", enabled: true, networks: {
      DOGECOIN: { name: "Dogecoin", label: "Dogecoin", icon: "assets/icons/networks/dogecoin.svg", enabled: true, address: "DN3tM8P5c7yjAHJgfMj9k6BD5Ww4rqjzqW" }
    } },
    TRX: { name: "TRON", symbol: "TRX", icon: "assets/icons/currencies/trx.svg", enabled: true, networks: {
      TRON: { name: "TRON", label: "TRON", icon: "assets/icons/networks/tron.svg", enabled: true, address: "TEx1x1Wx2teXrwFq9pEvHK46QfsJBzjTG9" }
    } },
    LTC: { name: "Litecoin", symbol: "LTC", icon: "assets/icons/currencies/ltc.svg", enabled: true, networks: {
      LITECOIN: { name: "Litecoin", label: "Litecoin", icon: "assets/icons/networks/litecoin.svg", enabled: true, address: "ltc1qddxhyv9nukdfsrmtknxezdpunpcknwfcn7wuxp" }
    } },
    XRP: { name: "XRP", symbol: "XRP", icon: "assets/icons/currencies/xrp.svg", enabled: true, networks: {
      XRP: { name: "XRP Ledger", label: "XRP Ledger", icon: "assets/icons/networks/xrp.svg", enabled: true, address: "rwEwpUeTeQdmrzCdsJTte1ok3ft4CsmsgM" }
    } },
    ADA: { name: "Cardano", symbol: "ADA", icon: "assets/icons/currencies/ada.svg", enabled: true, networks: {
      CARDANO: { name: "Cardano", label: "Cardano", icon: "assets/icons/networks/ada.svg", enabled: true, address: "addr1qy032k82vlf5cj50wj7jcugxhn629pw8c5004xxy53tw8770whfl0pwuskw6q95sw95as53946zg550wr63zdar7cjasawwznl" }
    } },
    AVAX: { name: "Avalanche", symbol: "AVAX", icon: "assets/icons/currencies/avax.svg", enabled: true, networks: {
      CCHAIN: { name: "Avalanche C-Chain", label: "Avalanche C-Chain", icon: "assets/icons/networks/avalanche.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" }
    } },
    DOT: { name: "Polkadot", symbol: "DOT", icon: "assets/icons/currencies/dot.svg", enabled: true, networks: {
      POLKADOT: { name: "Polkadot", label: "Polkadot", icon: "assets/icons/networks/polkadot.svg", enabled: true, address: "13Z2nBvrBUmSCjsMQycEQ2DuvUBuQwdCTLsPzhiDP2fphHAM" }
    } },
    POL: { name: "Polygon", symbol: "POL", icon: "assets/icons/currencies/pol.svg", enabled: true, networks: {
      POLYGON: { name: "Polygon PoS", label: "Polygon PoS", icon: "assets/icons/networks/polygon.svg", enabled: true, address: "0x4bA510B5A26C6799E37302d1C73626F56ab7c3d8" }
    } },
    DAI: { name: "Dai", symbol: "DAI", icon: "assets/icons/currencies/dai.svg", enabled: true, networks: {
      ETHEREUM: { name: "Ethereum", label: "Ethereum (ERC20)", icon: "assets/icons/networks/ethereum.svg", enabled: true, address: "" }
    } }
  }
};
