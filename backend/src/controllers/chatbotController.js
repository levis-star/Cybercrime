import { z } from 'zod';
import { callPython } from '../utils/pythonBridge.js';

export const chatbotSchema = z.object({
  body: z.object({
    message: z.string().min(2).max(1000),
    language: z.enum(['en', 'sw']).default('en')
  })
});

// JS keyword fallback used when Python service is unavailable
const jsFallbackReplies = [
  {
    match: ['otp', 'pin', 'password', 'namba ya siri'],
    en: 'Never share OTPs, PINs, or passwords. If someone requested them, report the incident and contact your provider immediately.',
    sw: 'Usitoe OTP, PIN, au nenosiri. Kama mtu ameziomba, ripoti tukio na wasiliana na mtoa huduma mara moja.',
    escalate: true
  },
  {
    match: ['sim swap', 'line', 'simu'],
    en: 'For suspected SIM swap, call your mobile network provider, freeze mobile money activity, then submit a report.',
    sw: 'Kwa tuhuma za SIM swap, piga huduma kwa wateja, simamisha miamala ya fedha, kisha tuma ripoti.',
    escalate: true
  },
  {
    match: ['job', 'ajira', 'interview'],
    en: 'Legitimate employers do not request personal mobile money payments. Save screenshots and submit a report.',
    sw: 'Waajiri halali hawapaswi kuomba malipo binafsi. Hifadhi picha za skrini na tuma ripoti.',
    escalate: false
  },
  {
    match: ['phishing', 'link', 'kiungo', 'email'],
    en: 'Avoid opening suspicious links. Check the sender, domain spelling, and any requests for private information.',
    sw: 'Epuka kufungua viungo vya kutiliwa shaka. Kagua mtumaji, jina la tovuti, na maombi ya taarifa binafsi.',
    escalate: false
  }
];

function jsFallback(message, language) {
  const normalized = message.toLowerCase();
  const hit = jsFallbackReplies.find((r) => r.match.some((w) => normalized.includes(w)));
  const fallback = {
    en: 'I can help with scam prevention, reporting steps, evidence collection, and case tracking. Describe what happened.',
    sw: 'Naweza kusaidia kuhusu kujikinga na utapeli, hatua za kuripoti, ushahidi, na kufuatilia kesi. Eleza kilichotokea.'
  };
  return {
    reply: hit ? hit[language] : fallback[language],
    escalationRecommended: hit ? hit.escalate : false,
    source: 'js-fallback'
  };
}

export async function answerChatbot(req, res) {
  const { message, language } = req.validated.body;

  const python = await callPython('/chatbot', { message, language });
  if (python) {
    return res.json({ ...python, source: 'python-nlp' });
  }

  return res.json(jsFallback(message, language));
}
