// Fallback seed data in case JSON Server is offline or deployed to static hosting (Vercel)
import dbData from '../../db.json';

export const getInitialData = () => {
  return JSON.parse(JSON.stringify(dbData));
};
