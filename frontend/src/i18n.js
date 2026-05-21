import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      report: 'Report incident',
      awareness: 'Awareness',
      chatbot: 'Guidance',
      track: 'Track case',
      admin: 'Admin',
      about: 'About us',
      login: 'Login',
      headline: 'Report cybercrime, learn prevention, and follow your case safely.',
      subhead: 'A mobile-first public safety portal for scams, mobile money fraud, harassment, phishing, and identity theft.'
    }
  },
  sw: {
    translation: {
      report: 'Ripoti tukio',
      awareness: 'Elimu',
      chatbot: 'Msaada',
      track: 'Fuatilia kesi',
      admin: 'Usimamizi',
      about: 'Kuhusu sisi',
      login: 'Ingia',
      headline: 'Ripoti uhalifu mtandao, jifunze kujikinga, na fuatilia kesi yako kwa usalama.',
      subhead: 'Mfumo rahisi kwa simu kwa utapeli, wizi wa fedha mtandao, unyanyasaji, hadaa, na wizi wa utambulisho.'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
