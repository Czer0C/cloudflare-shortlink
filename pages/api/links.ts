// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Link } from '@/lib/types';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  links?: Link[];
  error?: string;
  ok?: boolean;
};

const API_URL = process.env.CLOUDFLARE_WORKER;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    switch (req.method) {
      case 'GET':
        {
          const response = await fetch(`${API_URL}`, {
            headers: {
              auth: process.env.TOKEN || '',
            },
          });

          const data = await response.json();

          const links = data?.results || [];

          res.status(200).json(links);
        }

        break;

      case 'POST':
        {
          const body = req.body;

          const response = await fetch(`${API_URL}`, {
            headers: {
              auth: process.env.TOKEN || '',
            },
            method: 'POST',
            body: JSON.stringify(body),
          });

          const data = await response.json();

          const ok = data?.meta?.changed_db;

          res.status(200).json({ ok });
        }

        break;

      case 'PUT':
        {
          const body = req.body;
          const code = req.query.code;

          const response = await fetch(`${API_URL}/${code}`, {
            headers: {
              auth: process.env.TOKEN || '',
            },
            method: 'PUT',
            body: JSON.stringify(body),
          });

          const data = await response.json();

          const ok = data?.meta?.changed_db;

          res.status(200).json({ ok });
        }

        break;
      case 'DELETE':
        {
          const code = req.query.code;

          const response = await fetch(`${API_URL}/${code}`, {
            headers: {
              auth: process.env.TOKEN || '',
            },
            method: 'DELETE',
          });

          const data = await response.json();

          const ok = data?.meta?.changed_db;

          res.status(200).json({ ok });
        }

        break;

      default:
        res.status(500).json({ error: 'Method not allowed' });

        break;
    }
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: `${error || ''}` });
  }
}
