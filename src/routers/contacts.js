import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema } from '../validation/contact.js';
import {
  getContactsController,
  getContactsByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { isValidId } from '../middlewares/ isValidId.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactsByIdController),
);

router.post(
  '/contacts',
  validateBody(contactSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(contactSchema),
  ctrlWrapper(patchContactController),
);

router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;
