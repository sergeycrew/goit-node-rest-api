const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "../db/contacts.json");

const updateContactsJSON = async (contacts) =>
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

async function getAll() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

async function getById(contactId) {
  const contacts = await getAll();
  const result = contacts.find((i) => i.id === contactId);
  return result || null;
}

async function deleteById(contactId) {
  const contacts = await getAll();
  const index = contacts.findIndex((i) => i.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await updateContactsJSON(contacts);
  return result;
}

async function addContact({ name, email, phone }) {
  const contacts = await getAll();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContactsJSON(contacts);
  return newContact;
}

async function updateById(id, data) {
  const contacts = await getAll();
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { id, ...data };
  await updateContactsJSON(contacts);
  return contacts[index];
}

module.exports = {
  getAll,
  getById,
  deleteById,
  addContact,
  updateById,
};
