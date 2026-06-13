import fs from 'fs';
import path from 'path';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { dataUrl, filename } = req.body;
  if (!dataUrl || !filename) {
    return res.status(400).json({ error: 'dataUrl and filename required' });
  }

  const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches) return res.status(400).json({ error: 'Invalid data URL' });

  const ext = filename.split('.').pop().toLowerCase();
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  if (!allowedExts.includes(ext)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  const safeFilename = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const buffer = Buffer.from(matches[2], 'base64');
  fs.writeFileSync(path.join(uploadDir, safeFilename), buffer);

  return res.status(200).json({ url: `/uploads/${safeFilename}` });
}
