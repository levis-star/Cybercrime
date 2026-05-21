"""
Severity analyzer.
Uses weighted feature extraction — more features and finer weights than the
original JS function, giving a more reliable 0-100 score.
"""

import re

CATEGORY_BASE = {
    "Mobile money fraud": 35,
    "SIM swap": 42,
    "Social media scams": 22,
    "Phishing": 27,
    "Identity theft": 38,
    "Cyberbullying": 16,
    "Online harassment": 16,
    "Fake jobs": 22,
    "Financial fraud": 38,
}

_HIGH_RISK = [
    r"\botp\b", r"\bpin\b", r"\bpassword\b", r"\bnenosiri\b",
    r"\bsim swap\b", r"\bidentity\b", r"\butambulisho\b",
    r"\bblackmail\b", r"\bextort\b", r"\bvitisho\b", r"\bthreat\b",
    r"\bsextortion\b", r"\bkidnap\b", r"\bchild\b",
]

_FINANCIAL = [
    r"\bmoney\b", r"\bfedha\b", r"\bmalipo\b", r"\btransfer\b",
    r"\bpayment\b", r"\bstolen\b", r"\bmobile money\b",
    r"\bm-pesa\b", r"\btigo pesa\b", r"\bairtel money\b",
    r"\bbank\b", r"\baccount\b", r"\btransaction\b", r"\bmuamala\b",
]

_URGENCY = [
    r"\burgent\b", r"\bimmediately\b", r"\bright now\b",
    r"\bhurry\b", r"\bharaka\b", r"\bsasa hivi\b",
    r"\bactive\b", r"\bongoing\b", r"\bstill happening\b",
]

_VULNERABILITY = [
    r"\belderly\b", r"\bmzee\b", r"\bkijiji\b", r"\bvillage\b",
    r"\bdisabled\b", r"\bchild\b", r"\bstudent\b", r"\bpoor\b",
]


def _count(patterns: list, text: str) -> int:
    return sum(1 for p in patterns if re.search(p, text))


def score(
    category: str,
    description: str,
    has_evidence: bool,
    anonymity_status: str,
) -> dict:
    text = f"{category} {description}".lower()

    base = CATEGORY_BASE.get(category, 22)

    high_risk_hits    = _count(_HIGH_RISK, text)
    financial_hits    = _count(_FINANCIAL, text)
    urgency_hits      = _count(_URGENCY, text)
    vulnerability_hits = _count(_VULNERABILITY, text)

    risk_bonus        = min(high_risk_hits * 9, 27)
    financial_bonus   = min(financial_hits * 5, 15)
    urgency_bonus     = min(urgency_hits * 4, 12)
    vulnerability_bonus = min(vulnerability_hits * 3, 9)
    evidence_bonus    = 8 if has_evidence else 0
    verified_bonus    = 5 if anonymity_status == "verified" else 0
    length_bonus      = min(len(description) // 150, 6)

    total = (
        base + risk_bonus + financial_bonus + urgency_bonus
        + vulnerability_bonus + evidence_bonus + verified_bonus + length_bonus
    )
    total = min(total, 100)

    flags = []
    if high_risk_hits:
        flags.append("high-risk-keywords")
    if financial_hits:
        flags.append("financial-indicators")
    if urgency_hits:
        flags.append("urgency-signals")
    if vulnerability_hits:
        flags.append("vulnerable-population")
    if has_evidence:
        flags.append("evidence-attached")

    return {
        "severityScore": total,
        "flags": flags,
        "breakdown": {
            "base": base,
            "riskBonus": risk_bonus,
            "financialBonus": financial_bonus,
            "urgencyBonus": urgency_bonus,
            "vulnerabilityBonus": vulnerability_bonus,
            "evidenceBonus": evidence_bonus,
            "verifiedBonus": verified_bonus,
            "lengthBonus": length_bonus,
        },
    }
