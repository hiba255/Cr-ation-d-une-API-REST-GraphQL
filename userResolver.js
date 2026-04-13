const dbPromise = require('./db');
function toJson(doc) {
return doc ? doc.toJSON() : null;
}
async function findByEmail(usersCollection, email) {
return usersCollection.findOne({
selector: { email }
}).exec();
}
async function ensureUniqueEmail(usersCollection, email, excludedId = null) {
const existing = await findByEmail(usersCollection, email);
if (existing && existing.primary !== excludedId) {
throw new Error('Adresse e-mail déjà utilisée');
}
}
module.exports = {
user: async ({ id }) => {
const { users } = await dbPromise;
const doc = await users.findOne(id).exec();
return toJson(doc);
},
users: async () => {
const { users } = await dbPromise;
const docs = await users.find().exec();
return docs.map((doc) => doc.toJSON());
},
addUser: async ({ name, email, password }) => {
const { users, persistUsers, createId } = await dbPromise;
await ensureUniqueEmail(users, email);
const inserted = await users.insert({
id: createId(),
name,
email,
password
});
await persistUsers(users);
return inserted.toJSON();
},
updateUser: async ({ id, name, email, password }) => {
const { users, persistUsers } = await dbPromise;
const doc = await users.findOne(id).exec();
if (!doc) {
return null;
}
await ensureUniqueEmail(users, email, id);
const updatedDoc = await doc.incrementalPatch({
name,
email,
password
});
await persistUsers(users);
return updatedDoc.toJSON();
},
deleteUser: async ({ id }) => {
const { users, persistUsers } = await dbPromise;
const doc = await users.findOne(id).exec();
if (!doc) {
return false;
}
await doc.remove();
await persistUsers(users);
return true;
}
};