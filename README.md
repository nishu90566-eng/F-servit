# SEWA-SETU

SEWA-SETU is a cooperative household-services + materials marketplace. It is not Urban Company and not a VC aggregator. Clients pay service + materials in one shot into a Central Fund (escrow vault). The merchant is paid at QR pickup. The worker is paid only after the client unique code, after a flat platform fee and a welfare cutoff.

## 8-step workflow

1. **Client initiates a job** — audio (Web Speech API), short video, or catalog (Plumbing, Electrical, Carpentry, Appliance, Painting). Client pays service + materials into the Central Fund. Status: `PAYMENT_HELD`.
2. **Worker alert** — on-duty cooperative worker sees: "Your service requested in this area. YES or NO".
3. **If YES** — worker is connected to the material vendor and receives a pickup QR. Status: `ACCEPTED`. If NO, the same job is offered to the next fair-queued worker. Central funds stay locked.
4. **Merchant scans QR** — after materials are marked picked, the merchant receives their share from the Central Fund. Status: `MATERIALS_COLLECTED`.
5. **Worker travels** — worker goes to the client with materials. Status: `EN_ROUTE`. Client and Admin see "Worker on the way".
6. **Job done — client shares code** — client screen displays a unique code. Worker does not see it until the client reads it out. Status: `AWAITING_CODE`.
7. **Worker enters code** — only then remaining funds are released to the worker after platform fee and welfare cutoff. Status: `COMPLETED`.
8. **Service completed** — settlement receipt on all four roles. Banner: **SERVICE COMPLETED**.

## Money math (demo job: electrical breaker / switchboard)

| Line | Amount |
| --- | --- |
| 16A MCB Switch | Rs 180 |
| 1.5mm Copper Wire (2m) | Rs 120 |
| Materials subtotal (merchant at QR pickup) | Rs 300 |
| Service / labour | Rs 350 |
| Platform fee (cutoff) | Rs 50 |
| Welfare fund (8% of labour) | Rs 28 |
| Worker take-home | Rs 272 |
| **Client pays upfront** | **Rs 650** |

Release from Central Fund:

- Step 1 — client pays Rs 650 · vault 650
- Step 4 — merchant gets Rs 300 · vault 350
- Step 7 — worker gets Rs 272 · vault 78 (platform Rs 50 + welfare Rs 28 stay with the cooperative)

Never take a 20–30% aggregator commission. Never pay the worker before the unique code. Never pay the merchant before QR pickup.

## Unique code

Default demo code: **1234** (4 digits, generated per job). Client displays it after the worker is `EN_ROUTE`. Worker enters it to close the job. Wrong code: `Invalid code. Ask the client to read the unique code.`

## Live tracking (Rapido-style)

Worker tab has a **location detector**:
- **Detect my GPS** — uses the phone GPS so the client sees the real distance
- **Demo GPS** — simulates the worker moving toward the client on OpenStreetMap

Client tracker shows: how far the worker is, ETA in minutes, and a live map (worker / shop / home).

## Roles

Bottom navigation. Demo login is on the Overview page.

Password for all accounts: `Sewa@123`

- `client@sewasetu.in` — Sunita Sharma, Block C, Sector 14, City Center
- `worker@sewasetu.in` — Suresh Verma (fair-queue electrician)
- `merchant@sewasetu.in` — Gupta Electrical Store
- `admin@sewasetu.in` — Cooperative Admin

Fair dispatch = lowest jobsToday among on-duty workers. First job → Suresh.

## Run

```bash
npm install && npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Do not commit `node_modules`.
