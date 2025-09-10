# GIWA Bridge App

Bridge ETH between Ethereum Sepolia dan GIWA Sepolia dengan UI modern dark theme.

## ✨ Fitur Utama
- **Connect Wallet**: Integrasi MetaMask, tanpa private key di .env
- **Deposit ETH**: Bridge ETH dari Ethereum Sepolia ke GIWA Sepolia (Lock-and-Mint)
- **Withdraw ETH**: Bridge ETH dari GIWA Sepolia ke Ethereum Sepolia (Burn-and-Unlock)
- **UI Modern**: Dark theme, glassmorphism, responsif, dan UX nyaman
- **Info Step-by-Step**: Penjelasan proses deposit & withdraw langsung di UI

## 🚀 Cara Jalankan Lokal
1. Clone repo ini
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan dev server:
   ```bash
   npm run dev
   ```
4. Buka di browser: [http://localhost:5173](http://localhost:5173)

## 🌐 Deploy ke Production
- **Vercel**: Import repo ke [vercel.com](https://vercel.com/), klik deploy, selesai!
- **GitHub Pages**: Build & deploy pakai plugin Vite atau workflow CI.
- **Custom Domain**: Bisa di-setup di Vercel/GitHub Pages settings.

## ⚙️ Teknologi
- React + Vite
- Tailwind CSS (dark theme)
- viem (untuk EVM interaction)
- MetaMask (wallet connect)

## 📄 Dokumentasi GIWA
- [docs.giwa.io](https://docs.giwa.io/undefined/en/get-started/bridging/eth)

## 📝 Catatan
- Hanya untuk testnet Sepolia.
- Tidak menyimpan private key di server/browser.
- Semua transaksi harus dikonfirmasi via wallet user.

---

Built with ❤️ for the GIWA ecosystem.
