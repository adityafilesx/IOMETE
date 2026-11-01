# Evaluation protocol and result capture

The project specification §8 defines T1–T5. Do not report a pass rate until the corresponding tasks have actually run. `python evaluations/run.py` runs only six narrow automated checks, not the full evaluation.

## T1 — Three buyer cases
Prepare separate illustrative inputs and memos for: A, an EU bank leaving Dremio; B, a fintech on Snowflake without a Kubernetes team; C, an air-gapped government department on legacy Hadoop. Review every output against the evidence pack. B should identify the operational skills gap; C should ask about plan and support. Capture the inputs, memo, evidence IDs, reviewer, discrepancies and corrections. Current automated checks do not yet produce the three complete reviewed memos.

## T2 — Math audit
Export the worked example and verify every formula in a spreadsheet engine. A finance-minded reviewer independently checks the inputs, parallel-running and migration treatment, annual cost, three-year TCO and payback. Record engine/version, recalculated values, discrepancies and reviewer sign-off. No reviewer sign-off or spreadsheet-engine recalculation has occurred.

## T3 — Red team
Use the 20 questions in `red_team_questions.json`. The first four are examples specified in §8; the remaining prompts are proposed expansions, not claims that a canonical list was supplied. For each, capture the exact answer, source IDs, correct refusal or supported answer, and whether the outcome is unknown. Report pass rate and unknown rate only after running the question-answer workflow and manual evidence review. That workflow is not yet implemented.

## T4 — Before and after peer study
Recruit 5–8 consenting peers. Randomly assign approximately half to the IOMETE website plus a generic chatbot, half to ProofDesk; use the same illustrative buyer A information and a consistent time limit. Explain that participation is voluntary and avoid collecting real customer information. Capture anonymous participant IDs, assigned condition, time to first draft, draft, number of unsourced claims and errors against the evidence pack. Two reviewers should use the same criteria; resolve disagreements and record them. Report group size, median time, unsourced-claim counts and error counts; describe the small sample and any limitations. No participants have been recruited.

## T5 — Chatbot comparison
Run the same ten prompts from the T3 file against a specified generic chatbot and ProofDesk with equivalent context. Record model/version, date, settings, prompts, complete responses and unsupported numeric claims per answer. Independently review evidence for every number and retain disagreements. No chatbot comparison has run.

## Result capture
For every run record: test ID, input, expected behavior, exact output, evidence IDs, pass/fail or unknown, reason, reviewer, date, tool/model version and limitations. Store any participant data only with consent and local retention controls; do not commit personal or customer data.
