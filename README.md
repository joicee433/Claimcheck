# Claimcheck

Paste a short claim and one link. Validators on GenLayer **Studionet** read the page and return
`SUPPORTED`, `NOT_SUPPORTED` or `CANNOT_VERIFY`.

```
claimcheck/
├── contracts/claimcheck.py   # the Intelligent Contract
├── frontend/                 # Next.js (App Router) + TypeScript + Tailwind
└── README.md
```

Pages: `/` (home), `/new` (submit a claim), `/c/[id]` (see a verdict).

You need: a browser wallet (MetaMask), a free GitHub account, and a free Vercel account.
Studionet is a test network, so nothing here costs real money.

---

## 1. Open Studio and deploy the contract

1. Go to **https://studio.genlayer.com**.
2. Make sure the network shown is **Studionet** (not Bradbury).
3. Create a new contract file and name it `claimcheck.py`.
4. Open `contracts/claimcheck.py` from this project, copy everything, and paste it into Studio.
5. Open the **Run and Debug** (deploy) tab and click **Deploy**.
6. Wait until the contract shows up in the list of deployed contracts.

Optional test in Studio: run `check` with a claim and a URL, then run `next_id` (should be `1`)
and `get_check` with `0`.

## 2. Copy the contract address

In the deployed contracts list, click the copy icon next to your contract. It looks like
`0x1234...abcd`. Keep it somewhere handy.

## 3. Put the address into the frontend

```bash
cd frontend
cp .env.example .env.local
```

Open `.env.local` and replace the zeros:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_ADDRESS_HERE
```

Run it on your computer (needs Node.js 18+):

```bash
npm install
npm run dev
```

Open http://localhost:3000, go to **Check a claim**, click **Connect wallet**. The wallet will
offer to add **GenLayer Studionet** (Chain ID 61999, RPC `https://studio.genlayer.com/api`). Approve it.

When you submit, the validators fetch the page and vote. **Consensus can take a few minutes.**
Keep the tab open. You are sent to `/c/[id]` when it is done.

## 4. Deploy the frontend to Vercel

1. Put this project on GitHub (the whole `claimcheck` folder).
2. Go to **https://vercel.com**, click **Add New → Project**, and import the repository.
3. Set **Root Directory** to `frontend`.
4. Open **Environment Variables** and add:
   - Name: `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - Value: your contract address from step 2
5. Click **Deploy**. Vercel gives you a public link.

If you change the address later, update it in Vercel and redeploy.

---

## Troubleshooting

- **"NEXT_PUBLIC_CONTRACT_ADDRESS is not set"**: redo step 3, then restart `npm run dev`.
- **Result page says "No result yet"**: wait. If it never appears, the transaction may have been
  rejected (for example, a claim over 400 characters or a URL over 200). Try again.
- **Verdict is CANNOT_VERIFY**: the page could not be fetched or did not contain enough information.

## Known limit

The result id is read just before you submit. If two people submit at the exact same moment,
the id on the redirect could be off by one. Fine for a simple demo.
