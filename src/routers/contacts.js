import { Router } from 'express';

import {
  getContactsController,
  getContactsByIdController,
} from '../controllers/contacts';
const router = Router();

router.get('/contacts', getContactsController);

router.get('/contacts/:contactId', getContactsByIdController);

export default router;
