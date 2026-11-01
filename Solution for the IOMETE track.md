# ProofDesk for the IOMETE track: the business case a buyer can defend

Oct 31, 2026 · @tony

Build one workflow: a Business Case Builder that turns a buyer’s situation into a short internal memo in which every statement is labeled sourced, assumed or unknown, and every cost figure can be rechecked line by line. It targets the moment complex technology stalls in a sale: the buyer who has to justify the purchase to their boss.

## 1. What the official brief changes

The brief asks for one friction, one person helped (a sales rep or a buyer), and proof of who it helps, how it works and what it improves. Judges score practical impact 35%, buyer clarity 25%, accuracy 25% and working execution 15%. It also warns against “ChatGPT with a nicer front end”: pick a real workflow, add structure, show before and after.

That rules out most of my earlier four-part concept.

| Earlier idea | Decision | Why |
| --- | --- | --- |
| Four-part ProofDesk | Cut to one workflow | The brief rewards one friction solved well, not four half-built parts |
| Claim Ledger (audits IOMETE’s own pages) | Kept only as a hidden evidence pack | It serves IOMETE’s marketers, not a rep or a buyer |
| AI-shortlist monitor | Dropped | A marketing tool, not a rep or buyer workflow |
| Zero-install sandbox, on-prem product AI | Dropped | The brief says you need not run IOMETE, and the track is not about building on its product |
| Switch and Exit Simulator | Kept as the core, widened into a full memo | Matches the starter friction “I have to justify this to my boss” |

## 2. The friction: a buyer cannot defend the purchase

IOMETE’s product is strong. The stall happens when a champion (a data platform lead, architect or IT head) must explain it and defend its cost to a finance partner and a security reviewer who do not read Spark documentation. Five gaps on IOMETE’s public pages (checked October 31, 2026) show where they get stuck:

| Gap | What the public pages show | What the buyer cannot tell |
| --- | --- | --- |
| Jargon wall | The [FAQ](https://iomete.com/faq) defines lakehouse, Iceberg and air-gapped in plain words, but every section of [IOMETE University](https://iomete.com/university) is for engineers (compute clusters, connection protocols, Iceberg time travel) | Where a CFO or security lead should start |
| Which plan has which control | The [pricing page](https://iomete.com/pricing) puts data masking, role-level security, disaster zone and auditing under Enterprise; the [security page](https://iomete.com/product/architecture/data-security) lists row and column security, masking and audit logs without naming a plan | Whether the controls they need exist in the Free plan |
| Pricing cliff | Free is up to 100 vCPUs. Enterprise is $500 per vCPU per year with a $100,000 minimum (200 vCPUs). The page does not say how vCPUs are counted | That on published prices a 120-vCPU workload jumps from $0 to $100,000, and which vCPUs count |
| Which savings figure to quote | The FAQ says 30–60% versus SaaS platforms; a blog headline says 40–60% while its own case studies show about 20%, 1% and 38%; the homepage says 2–5x | Which number is safe to put in a memo |
| What compliance means | The FAQ says IOMETE can meet GDPR, HIPAA and SOC 2 requirements because the customer controls the deployment. That describes what the customer can do, not IOMETE’s own certifications; its Trust Center is a separate page I did not read | Whether “SOC 2” refers to the vendor or to their own deployment |

These are gaps between pages written for engineers and a decision a non-engineer must sign, not product flaws. I have no IOMETE funnel data, so I cannot say how many deals stall here; IOMETE’s sales team can confirm.

## 3. Judging every idea against the official rubric

Scores are 1–5 on the official criteria, weighted 35 / 25 / 25 / 15. They are my judgment, with execution scored for a small team in about 24–48 hours (the event length is not in the brief).

| Idea | Impact | Clarity | Accuracy | Execution | Weighted |
| --- | --- | --- | --- | --- | --- |
| **Business case builder (starter: justify this to my boss; my Simulator widened)** | 5 | 4 | 5 | 3 | **4.45** |
| Security questionnaire helper (starter) | 4 | 3 | 5 | 3 | 3.85 |
| Use-case quiz (starter) | 3 | 5 | 3 | 5 | 3.80 |
| Four-part ProofDesk (my earlier concept) | 4 | 3 | 5 | 2 | 3.70 |
| Role-based explainer (starter) | 3 | 4 | 3 | 5 | 3.55 |
| Zero-install sandbox | 4 | 5 | 3 | 1 | 3.55 |
| Call prep generator (starter) | 4 | 3 | 3 | 4 | 3.50 |
| Claim Ledger alone | 3 | 2 | 5 | 4 | 3.40 |
| Demo personalizer (starter) | 3 | 3 | 3 | 3 | 3.00 |
| AI-shortlist monitor | 2 | 2 | 3 | 4 | 2.55 |
| On-prem product AI | 2 | 2 | 3 | 1 | 2.10 |

**Why the business case builder wins.** It removes a real step (building a defensible internal memo), forces visible assumptions (the accuracy criterion), and its proof is concrete: a finance reviewer can recheck the math. Quizzes and explainers score well on clarity and execution but are the ideas other teams are most likely to build, and they struggle on impact and on the “ChatGPT with a front end” test. That is my guess about other teams, not data.

**Runner-up: the questionnaire helper.** Strong on accuracy and impact, but the public material I read (FAQ and security page) gives capabilities without certification details, and I could not read the Trust Center, so most answers would be “unknown”. It fits as a later extension, not as the core.

**Sensitivity.** The business case builder stays first with impact 4 (4.10) or execution 1 (4.15). It loses the lead only if its impact falls to 3 (3.75, behind the questionnaire helper and the quiz). Execution is its main risk, which is why section 11 scopes it tightly.

## 4. The solution: ProofDesk Business Case Builder

**Who it helps:** the buyer’s champion, who has to defend the purchase. IOMETE’s rep benefits second: the memo arrives with the buyer’s numbers, assumptions and open questions already organized.

**What it improves:** the time and risk of producing a memo that a finance partner and a security reviewer will accept, and the quality of the first sales conversation.

### 4.1 Walkthrough

1. **Describe your situation.** Eight to ten plain-language questions: industry, role, current platform and annual cost, peak vCPUs, controls needed, hosting, Kubernetes skills, migration plan. Every question has a tooltip that explains the term using IOMETE’s own definitions.
2. **See IOMETE in your terms.** Five to seven sentences on what IOMETE would do for this buyer, written for their role (CFO, security lead, CTO or student). Each sentence carries a source chip. Analogies are marked “analogy, not a claim”.
3. **Check fit.** A traffic-light list: Kubernetes skills, scale, sovereignty need, plan needed for the controls requested, and where IOMETE may not fit. Each rule is marked IOMETE-stated or ProofDesk assumption.
4. **Audit the cost.** A cost and payback table with every formula visible, three scenarios and a sensitivity list. A download gives a spreadsheet with live formulas.
5. **Get the memo.** A two-page memo plus an appendix: evidence table, assumptions table, and a list of questions to ask IOMETE, generated from every unknown.

### 4.2 Three labels, shown everywhere

| Label | Meaning | Rule |
| --- | --- | --- |
| SOURCED | A statement in IOMETE’s public material | Needs a link, a retrieval date and a quoted span |
| ASSUMED | A number or statement the buyer or the tool supplied | Shown with its range and who set it |
| UNKNOWN | Not found in public material | Never filled in; becomes a question for IOMETE |

The memo header shows live counts, for example “31 sourced, 7 assumed, 5 unknown”. The language model never chooses facts: rules choose claims, the model only phrases them, and a verifier rejects any sentence its cited claims do not support.

### 4.3 Memo contents

| Memo section | Built from | Labeling rule |
| --- | --- | --- |
| Why now | Buyer’s stated problems and sourced context | Buyer statements are ASSUMED; context is SOURCED |
| What IOMETE is, in your terms | Selected evidence claims, role lens | Every sentence SOURCED |
| Fit check | Rule table | IOMETE-stated or ASSUMED |
| Options considered | Stay as is, stay on SaaS, Free-plan pilot, Enterprise | Costs from the calculator |
| Cost and payback | Calculator | Formulas visible; inputs ASSUMED |
| Benefits beyond cost | Control, open formats, cloud discounts, deployment choice | SOURCED, tagged “IOMETE-stated, not independently verified” |
| Risks | Operations burden, skills, migration, plan features | SOURCED or ASSUMED |
| Unknowns and questions for IOMETE | Every UNKNOWN | Generated automatically |
| Decision and next step | Pilot on the Free plan (up to 100 vCPUs, on-premises, community support) | SOURCED |

### 4.4 What it will not do

It will not promise savings, give legal or compliance advice, rank IOMETE against competitors beyond differences IOMETE itself states, or guess a vCPU count from data volume. When the buyer’s own numbers show no cost advantage, the memo says so and rests the case on the non-cost benefits, or recommends not proceeding.

## 5. The cost model

The Free plan has a license cost of 0 (up to 100 vCPUs, core features). For Enterprise, the pricing page’s $500 per vCPU and $100,000 minimum apply.

| Input | Purpose | Label |
| --- | --- | --- |
| Current platform and annual cost (from an invoice) | Baseline | Buyer-supplied |
| Peak vCPUs: low, base, high | Drives the license | Buyer-supplied; blank = UNKNOWN |
| Controls needed (masking, row-level security, auditing, multi-region, air-gapped) | Picks the plan from the pricing page | Buyer-supplied |
| Infrastructure cost per year | Hosting the platform | Buyer-supplied |
| Platform staff (FTE × loaded cost) | Operating Kubernetes and the platform | Buyer-supplied |
| Migration cost and months of parallel running | One-time costs | Buyer-supplied |
| Horizon (default 3 years), currency and FX rate | Amortization, USD pricing | Assumption |

```latex
License_{Enterprise} = \max(vCPUs \times 500, 100000)
AnnualCost = License + Infrastructure + Staff + \frac{Migration + ParallelRun}{Horizon}
Payback = \frac{Migration + ParallelRun}{CurrentCost - License - Infrastructure - Staff}
```

**Worked example with illustrative inputs (not benchmarks).** A buyer on a SaaS platform spends $420,000 a year and needs 160 vCPUs.

| Line | Amount (USD) |
| --- | --- |
| License: max(160 × 500, 100,000) | 100,000 |
| Infrastructure | 90,000 |
| Staff: 1.5 FTE × 60,000 | 90,000 |
| Migration 120,000, spread over 3 years | 40,000 |
| Parallel run: 3 months of current spend (105,000), spread over 3 years | 35,000 |
| **Annual IOMETE cost** | **355,000** |
| **Annual change versus 420,000** | **65,000 (15.5%)** |
| **Payback**: 225,000 one-time ÷ 140,000 yearly run-rate saving | **1.6 years** |

The example shows the 200-vCPU minimum biting (the buyer pays for 200 while using 160) and a result well below the published savings ranges. That is the point: the memo uses the buyer’s numbers, so a finance partner can trust it.

The tool also runs a sensitivity pass (each input moved by 25%, an assumption the buyer can change) and lists which input flips the sign of the savings.

## 6. The evidence pack

A frozen file of about 60 claims from IOMETE’s public pages (pricing, FAQ, security, deployment, University, selected blog posts), reviewed by hand and stamped with a retrieval date. It lives in the repo so judges can open it.

| Field | Example |
| --- | --- |
| id | PRICE-03 |
| claim | Enterprise is $500 per vCPU per year with a $100,000 yearly minimum |
| source and date | iomete.com/pricing, retrieved 2026-10-31 |
| quoted span | The footnote text on the page |
| scope | Plan: Enterprise |
| tags | cost, plan, license |
| conflict group | none |

Claims are selected by tags and rules from the buyer’s inputs. A **published-figures register** groups claims that conflict (the savings percentages) so the tool shows all of them with their sources, applies none, and explains why: they have different bases. Present this as a feature that protects the buyer, and preview it with IOMETE mentors before judging.

## 7. Designed for buyer clarity

| Lens | Emphasis (same facts, different order) |
| --- | --- |
| CFO | Cost lines, payback, minimum commitment, risks to the numbers |
| Security lead | Controls and which plan includes them, deployment control, unknowns on certification |
| CTO or architect | Deployment options, Kubernetes requirement, open formats, migration path |
| Student or newcomer | Plain definitions, one analogy per term, where to learn more |

- Jargon tooltips use IOMETE’s own FAQ definitions with source links.
- The memo is capped at two pages plus appendix. Every section ends with a next step.
- Unknowns are phrased as questions the buyer can send to IOMETE.

## 8. How to prove it works

| Test | Method | What you show |
| --- | --- | --- |
| T1 Three sample buyers | A: EU bank leaving Dremio after SAP’s acquisition (completed July 6, 2026). B: fintech on Snowflake with no Kubernetes team. C: air-gapped government department with legacy Hadoop | Three clearly different memos; B’s says IOMETE is likely not a fit yet; C’s lists unknowns on plan and support. Outputs checked against the evidence pack |
| T2 Math audit | Spreadsheet export with live formulas, unit tests, one finance-minded reviewer rechecks the example | Screenshot of the reviewer’s sign-off and the passing tests |
| T3 Red-team set | 20 questions such as “Will I save 50%?”, “Is IOMETE SOC 2 certified?”, “Does the Free plan include auditing?”, “How many vCPUs for 20 TB?” | Pass rate for correct refusal or sourced answer, and the unknown rate |
| T4 Before and after | 5–8 peers write a memo for sample buyer A, half with the website plus a chatbot, half with ProofDesk | Median time to first draft, count of unsourced claims, count of errors against the evidence pack. Small sample, reported as such |
| T5 Chatbot comparison | Same 10 prompts to a generic chatbot and to ProofDesk | Unsupported numeric claims per answer |

Do not state any result before you have run the test. The demo should show the real numbers, including weak ones.

## 9. Architecture and build

1. **Intake** validated as typed data.
2. **Rule engine** picks claim IDs by plan, role and scenario tags.
3. **Calculator** (plain Python, unit-tested) produces the numbers and the spreadsheet.
4. **Writer** (a language model with structured output) produces sentences, each carrying claim IDs. It phrases; it does not choose facts.
5. **Verifier** checks each sentence against its cited claims and requires every number in the prose to equal the calculator’s output. Failures are dropped.
6. **Renderer** produces the web preview, PDF, Word memo and spreadsheet, plus the label counters.

| Layer | Choice |
| --- | --- |
| App base | [fastapi/full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template): FastAPI, React, TypeScript, Tailwind, shadcn/ui, PostgreSQL, MIT licensed |
| Structured output | [Instructor](https://github.com/567-labs/instructor), MIT licensed |
| Tests | pytest for the calculator; a small claim-support test set; optionally DeepEval |
| Evidence pack | YAML or JSON in the repo; no crawler needed at run time |

**Security note.** Do not use LiteLLM: it was compromised twice in 2026, in [March](https://www.netspi.com/blog/executive-blog/ai-ml-pentesting/litellm-supply-chain-compromise/) and on [October 21](https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-docker/). Commit a lockfile and keep API keys off shared machines.

## 10. How it scores on the judging criteria

| Criterion (weight) | What you show |
| --- | --- |
| Practical impact (35%) | Memo built in minutes from a buyer’s inputs; T4 time and error comparison; unknowns turned into a ready question list for the rep |
| Buyer clarity (25%) | Role lenses, plain tooltips, two-page memo with a next step, tested on peers who do not know IOMETE |
| Accuracy (25%) | Three labels with live counts, linked sources, visible formulas, published-figures register, T3 unknown and refusal rate |
| Working execution (15%) | One complete path from inputs to downloadable memo and spreadsheet for all three sample buyers |

## 11. Build plan

| Priority | Scope |
| --- | --- |
| Must | Intake, evidence pack of about 40 claims, rule engine, calculator with spreadsheet export, memo with labels and counters, sample buyers A and B |
| Should | Role lenses, verifier pass, PDF export, sample buyer C, red-team results page |
| Could | Questionnaire helper tab (runner-up idea), published-figures register view, Word export |

| Hours (assuming 24) | Work |
| --- | --- |
| 0–4 | Read IOMETE pages, draft the evidence pack, set up the template repo |
| 4–10 | Calculator, spreadsheet export, unit tests; intake form |
| 10–16 | Rule engine, writer, verifier; memo rendering |
| 16–20 | Run T1, T3 and T5; fix failures; recruit testers for T4 |
| 20–24 | Record the demo, write the submission, rehearse |

If the event runs longer, start T4 earlier and add the Should items. For three people: one on calculator and evidence pack, one on backend and language model, one on frontend, tests and demo.

**Five-minute demo.**

1. Show the problem: one buyer question and the conflicting public savings figures.
2. Enter sample buyer A and watch the memo build with labels and counters.
3. Click a sentence to open its source; open the spreadsheet and recheck one formula.
4. Enter sample buyer B and show the honest “not a fit yet” result.
5. Ask “Will I save 50%?” and show the refusal and the generated question for IOMETE.
6. Close with the T3, T4 and T5 numbers.

**Submission checklist.**

- [ ] Working prototype link and short demo video
- [ ] Repository with the evidence pack file
- [ ] Test results sheet (T1 to T5)
- [ ] One-page “who, how, what improves” summary
- [ ] IOMETE track Google form submitted

## 12. What IOMETE gains beyond the hackathon

- Reps receive a structured brief with the buyer’s inputs, assumptions and open questions before the first call.
- The unknown report shows which buyer questions public pages cannot answer: a direct backlog for the docs and marketing teams.
- The published-figures register helps align savings claims across pages.
- A trimmed version could sit on iomete.com as a self-serve business case page.
- Later phases can reuse the same evidence pack: a continuous claim checker, an AI-shortlist monitor, a hosted sandbox. These stay out of the hackathon scope.

## 13. Risks and open questions

| Risk or unknown | Mitigation |
| --- | --- |
| Public pages change after the snapshot | Date-stamp every claim; show the retrieval date in the memo |
| I could not read IOMETE’s Trust Center | Mark certification questions UNKNOWN; check the page by hand before the demo |
| The published-figures register may read as criticism of the sponsor | Frame it as buyer protection; preview with mentors |
| Event length and team size are not in the brief | The plan assumes 24 hours and three people; adjust scope using the Must list |
| Sample buyers are fictional | Label them illustrative |
| Cost inputs are the buyer’s estimates | Ranges, a sensitivity pass, visible assumptions |
| Language model errors | Rules choose facts; verifier and calculator-match checks; T3 and T5 measure it |
| Not legal or compliance advice | Disclaimer in the memo; unknowns routed to IOMETE and the buyer’s counsel |

## 14. Sources

Pages opened October 31, 2026 unless noted.

- Official brief: IOMETE Track Starter Kit for hackCBS (uploaded PDF)
- IOMETE: [pricing](https://iomete.com/pricing), [FAQ](https://iomete.com/faq), [data security](https://iomete.com/product/architecture/data-security), [University](https://iomete.com/university)
- IOMETE blog: [Fortune 500 cost post](https://iomete.com/resources/blog/fortune-500-cost-reduction-self-hosted-vs-saas-tco) and [Dremio and SAP guide](https://iomete.com/resources/blog/dremio-sap-migration-guide)
- [SAP completes Dremio acquisition](https://news.sap.com/2026/07/sap-completes-dremio-acquisition/)
- [fastapi/full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template) and [Instructor](https://github.com/567-labs/instructor)
- LiteLLM incidents: [NetSPI](https://www.netspi.com/blog/executive-blog/ai-ml-pentesting/litellm-supply-chain-compromise/) and [Datadog Security Labs](https://securitylabs.datadoghq.com/articles/litellm-compromised-pypi-docker/)
