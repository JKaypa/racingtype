import path from 'node:path';
import { Router } from 'express';

import { HTML_FILES_PATH } from '../config.js';

const router = Router();

router.get('/', (_req, res) => {
    const page = path.join(HTML_FILES_PATH, 'signin.html');
    res.sendFile(page);
});

export default router;
