import { Contact } from '../db/models/contact.js';

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    console.log('Contacts:', contacts);
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};
