import { Router } from 'express';

import {
  getContactsController,
  getContactsByIdController,
  createContactController,
} from '../controllers/contacts';

import { ctrlWrapper } from '../utils/ctrlWrapper';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactsByIdController));

router.post('/contacts', ctrlWrapper(createContactController));

export default router;
