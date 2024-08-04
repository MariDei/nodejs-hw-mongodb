import { Router } from 'express';

import {
  getContactsController,
  getContactsByIdController,
} from '../controllers/contacts';

import { ctrlWrapper } from '../utils/ctrlWrapper';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:contactId', ctrlWrapper(getContactsByIdController));

export default router;
