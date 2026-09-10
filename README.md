# Servit

Servit is a society-owned cooperative for household repairs and materials — not a VC aggregator. Members are KYC-verified, the platform fee is a flat Rs 50, labour sits in UPI escrow until OTP, and parts travel with the worker so one visit finishes the job.

## Demo logins (password `Servit@123`)

- `client@servit.in` — Ravi Sharma, Sector 21 Faridabad
- `worker@servit.in` — Kuldeep Singh, plumber C-4419, 2.1 km, KYC verified
- `admin@servit.in` — Secretary, Balaji Nagar Cooperative Society

## 3-minute script

1. `/` — paradigm table  
2. Client → New job → mic or sample → Rs 850 / 600 / 50  
3. Mock UPI `servit@upi` → vault PAYMENT_HELD  
4. Worker → accept JOB-1042 at 2.1 km → scan QR → arrive → proof  
5. Client → OTP `482917` → Rs 600 released  
6. Admin → COMPLETED + take-home vs private app  

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Reset seed from the sticky top bar. India Stack labels (UPI, eKYC, OTP) are mocks. DPDP Act 2023 copy; no live Aadhaar or NPCI.
