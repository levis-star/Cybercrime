import { store } from '../data/store.js';

export function listAwareness(req, res) {
  const { language, category } = req.query;
  const content = store.awarenessContent.filter((item) => {
    const languageMatch = language ? item.language === language : true;
    const categoryMatch = category ? item.category === category : true;
    return languageMatch && categoryMatch;
  });
  return res.json({ content });
}
