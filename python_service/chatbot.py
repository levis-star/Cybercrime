"""
NLP chatbot using TF-IDF + cosine similarity.
Replaces the JS keyword-matching approach with vector similarity so the
bot can handle varied phrasing, synonyms and partial matches.
"""

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ---------------------------------------------------------------------------
# Knowledge base
# Each entry has: tags (training phrases), answer_en, answer_sw, escalate flag
# ---------------------------------------------------------------------------
KB = [
    {
        "tags": [
            "otp one time password share gave someone caller asked pin verification code secret",
            "someone stole my otp pin password namba ya siri asked for code"
        ],
        "en": "Never share OTPs, PINs, or passwords with anyone — even callers claiming to be from your bank, telecom, or a government office. Contact your mobile money provider immediately to freeze the account, then submit a report including the caller's number, the time, and exactly what was requested.",
        "sw": "Usitoe OTP, PIN, au nenosiri kwa mtu yeyote — hata akisema anatoka benki, kampuni ya simu, au serikali. Wasiliana na mtoa huduma wako wa fedha mara moja ili kusimamisha akaunti, kisha tuma ripoti yenye namba ya mpigaji, muda, na maelezo ya ombi.",
        "escalate": True,
    },
    {
        "tags": [
            "sim swap sim card lost line network gone signal disappeared my number hijacked",
            "sim ilichukuliwa laini yangu mtandao umeenda signal imeisha namba yangu"
        ],
        "en": "A sudden loss of mobile signal can indicate a SIM swap attack. Call your network provider immediately, freeze all mobile money accounts linked to that number, then submit a report with your phone number, the time signal was lost, and any recent suspicious calls.",
        "sw": "Kupoteza mtandao ghafla kunaweza kumaanisha SIM swap. Piga kampuni ya simu mara moja, simamisha akaunti zote za fedha zinazohusiana na namba hiyo, kisha tuma ripoti yenye namba yako, muda wa kupoteza mtandao, na simu za kutiliwa shaka.",
        "escalate": True,
    },
    {
        "tags": [
            "fake job scam employment fraud interview fee pay to get job recruiter asked money",
            "ajira bandia ada ya usaili kazi ya uongo malipo ya kazi mwajiri aliomba fedha"
        ],
        "en": "Legitimate employers never ask for payment for interviews, training, or job processing. Save screenshots of the job advertisement, payment numbers, conversation logs, and any URLs. Submit a report with all this evidence.",
        "sw": "Waajiri halali hawaombi malipo kwa usaili, mafunzo, au usindikaji wa kazi. Hifadhi picha za tangazo la kazi, namba za malipo, mazungumzo, na viungo. Tuma ripoti na ushahidi huu wote.",
        "escalate": False,
    },
    {
        "tags": [
            "phishing fake link suspicious email fake website clicked link bank message",
            "phishing kiungo cha uongo barua pepe ya kutiliwa shaka tovuti bandia benki ujumbe"
        ],
        "en": "Do not click suspicious links or enter credentials on pages reached through unsolicited messages. Check for misspelled domain names and urgency language. Take a screenshot of the message and submit a report with the sender details and the URL.",
        "sw": "Usibonyeze viungo vya kutiliwa shaka wala kuandika nenosiri kwenye ukurasa uliofika kwa ujumbe usioulizwa. Angalia makosa ya tahajia katika jina la tovuti na lugha ya dharura. Piga picha ya skrini ya ujumbe na utume ripoti yenye maelezo ya mtumaji na kiungo.",
        "escalate": False,
    },
    {
        "tags": [
            "sent money wrong number transferred mistake mobile money wrong transaction",
            "nimetuma fedha namba mbaya nilikosea muamala tigo airtel mpesa"
        ],
        "en": "Contact your mobile money provider immediately — most providers can reverse transfers within 24 hours if reported quickly. Keep the transaction ID, recipient number, and exact time. Submit a report with these details.",
        "sw": "Wasiliana na mtoa huduma wako wa fedha mara moja — wengi wanaweza kurudisha malipo ndani ya saa 24 yakiwasilishwa haraka. Hifadhi nambari ya muamala, namba ya mpokeaji, na muda kamili. Tuma ripoti na maelezo haya.",
        "escalate": True,
    },
    {
        "tags": [
            "blackmail sextortion threat extort threatening harass intimate photos videos",
            "vitisho blackmail kunyanyaswa picha za siri extort kutishwa"
        ],
        "en": "Do not pay — payment almost always escalates the situation. Block the contact, preserve all messages and media before blocking, and report to police alongside submitting a digital report here. Your identity is fully protected.",
        "sw": "Usilipe — kulipa mara nyingi kunaendeleza tatizo. Zuia mawasiliano, hifadhi ujumbe na picha zote kabla ya kuzuia, na ripoti polisi pamoja na kutuma ripoti ya kidijitali hapa. Utambulisho wako unalindwa kikamilifu.",
        "escalate": True,
    },
    {
        "tags": [
            "cyberbullying online harassment trolling fake account impersonation social media",
            "unyanyasaji mtandao akaunti bandia kujifanya mtu mwingine mitandao ya kijamii"
        ],
        "en": "Report the account on the platform first, then take screenshots because reporting may hide the evidence. If threats are involved, escalate to law enforcement. Submit a report here with profile links and message screenshots.",
        "sw": "Ripoti akaunti kwenye jukwaa kwanza, kisha piga picha za skrini kwa sababu kuripoti kunaweza kuficha ushahidi. Kama vitisho vipo, peleka kwa mamlaka. Tuma ripoti hapa yenye viungo vya wasifu na picha za skrini za ujumbe.",
        "escalate": False,
    },
    {
        "tags": [
            "evidence screenshot proof what to save how to collect preserve files",
            "ushahidi picha ya skrini nini kuhifadhi jinsi ya kukusanya faili"
        ],
        "en": "Save: screenshots of all messages, transaction IDs, phone numbers, profile links, email headers, URLs, dates, and times. Do not edit any screenshot. Submit a report and attach the original unedited files as evidence.",
        "sw": "Hifadhi: picha za skrini za ujumbe wote, nambari za miamala, namba za simu, viungo vya wasifu, vichwa vya barua pepe, viungo, tarehe na nyakati. Usihariri picha yoyote ya skrini. Tuma ripoti na ambatanisha faili za asili bila marekebisho.",
        "escalate": False,
    },
    {
        "tags": [
            "track case check status tracking code follow up report status",
            "fuatilia kesi hali ya ripoti namba ya ufuatiliaji angalia ripoti yangu"
        ],
        "en": "Use the Track Case page and enter your tracking code (format: TZ-CC-YYYY-XXXX). This shows the current status of your report without exposing your identity.",
        "sw": "Tumia ukurasa wa Fuatilia Kesi na uweke namba yako ya ufuatiliaji (muundo: TZ-CC-MWAKA-XXXX). Hii inaonyesha hali ya sasa ya ripoti yako bila kufichua utambulisho wako.",
        "escalate": False,
    },
    {
        "tags": [
            "identity theft personal information stolen national id documents stolen fraud",
            "utambulisho ulibiwa taarifa binafsi ziliibiwa kitambulisho cha taifa hati"
        ],
        "en": "Report to the relevant authority immediately to flag your ID as potentially compromised. Contact your bank to freeze accounts. Gather all evidence of how your information was used and submit a detailed report.",
        "sw": "Ripoti kwa mamlaka husika mara moja ili kujulisha kwamba kitambulisho chako kinaweza kuwa kimeibiwa. Wasiliana na benki yako ili kusimamisha akaunti. Kusanya ushahidi wote wa jinsi taarifa zako zilivyotumika na tuma ripoti ya kina.",
        "escalate": True,
    },
]

# ---------------------------------------------------------------------------
# Build separate vectorizers for EN and SW at module load time
# ---------------------------------------------------------------------------
def _build(lang_key: str):
    docs = [" ".join(e["tags"]) for e in KB]
    vec = TfidfVectorizer(ngram_range=(1, 2), min_df=1, analyzer="word")
    matrix = vec.fit_transform(docs)
    return vec, matrix


_vec_en, _mat_en = _build("en")
_vec_sw, _mat_sw = _build("sw")

FALLBACK = {
    "en": "I can help with: OTP/PIN scams, SIM swap, fake jobs, phishing, mobile money fraud, blackmail, cyberbullying, evidence collection, and case tracking. Please describe what happened in a few words.",
    "sw": "Naweza kusaidia kuhusu: OTP/PIN, SIM swap, ajira bandia, phishing, utapeli wa fedha, vitisho, unyanyasaji, ushahidi, na kufuatilia kesi. Tafadhali eleza kilichotokea kwa maneno machache.",
}

CONFIDENCE_THRESHOLD = 0.07


def answer(message: str, language: str = "en") -> dict:
    lang = language if language in ("en", "sw") else "en"
    vec = _vec_en if lang == "en" else _vec_sw
    mat = _mat_en if lang == "en" else _mat_sw

    query = vec.transform([message.lower()])
    scores = cosine_similarity(query, mat).flatten()
    best_idx = int(np.argmax(scores))
    best_score = float(scores[best_idx])

    if best_score < CONFIDENCE_THRESHOLD:
        return {"reply": FALLBACK[lang], "escalationRecommended": False, "confidence": 0.0}

    entry = KB[best_idx]
    return {
        "reply": entry[lang],
        "escalationRecommended": entry["escalate"],
        "confidence": round(best_score, 3),
    }
