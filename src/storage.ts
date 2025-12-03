export type User = { id: string; name: string };
export type Category = { id: string; name: string };
export type RecordItem = {
  id: string;
  userId: string;
  categoryId: string;
  createdAt: string; // ISO
  amount: number;
};

let userSeq = 1;
let categorySeq = 1;
let recordSeq = 1;

const users = new Map<string, User>();
const categories = new Map<string, Category>();
const records = new Map<string, RecordItem>();

(function seed() {
  const u1 = createUser("Alice");
  const u2 = createUser("Bob");

  const c1 = createCategory("Food");
  const c2 = createCategory("Transport");

  createRecord(u1.id, c1.id, 120);
  createRecord(u1.id, c2.id, 55);
  createRecord(u2.id, c1.id, 200);
})();

export function createUser(name: string): User {
  const id = `u${userSeq++}`;
  const user: User = { id, name };
  users.set(id, user);
  return user;
}

export function getUser(id: string): User | undefined {
  return users.get(id);
}

export function listUsers(): User[] {
  return Array.from(users.values());
}

export function deleteUser(id: string): boolean {
  const existed = users.delete(id);
  if (!existed) return false;

  // чистим записи пользователя
  for (const [rid, r] of records.entries()) {
    if (r.userId === id) records.delete(rid);
  }
  return true;
}

export function createCategory(name: string): Category {
  const id = `c${categorySeq++}`;
  const category: Category = { id, name };
  categories.set(id, category);
  return category;
}

export function listCategories(): Category[] {
  return Array.from(categories.values());
}

export function getCategory(id: string): Category | undefined {
  return categories.get(id);
}

export function deleteCategory(id: string): boolean {
  const existed = categories.delete(id);
  if (!existed) return false;

  // чистим записи категории
  for (const [rid, r] of records.entries()) {
    if (r.categoryId === id) records.delete(rid);
  }
  return true;
}

export function createRecord(userId: string, categoryId: string, amount: number): RecordItem {
  const id = `r${recordSeq++}`;
  const rec: RecordItem = {
    id,
    userId,
    categoryId,
    createdAt: new Date().toISOString(),
    amount,
  };
  records.set(id, rec);
  return rec;
}

export function getRecord(id: string): RecordItem | undefined {
  return records.get(id);
}

export function deleteRecord(id: string): boolean {
  return records.delete(id);
}

export function listRecordsFiltered(filters: { userId?: string; categoryId?: string }): RecordItem[] {
  const all = Array.from(records.values());

  return all.filter((r) => {
    if (filters.userId && r.userId !== filters.userId) return false;
    if (filters.categoryId && r.categoryId !== filters.categoryId) return false;
    return true;
  });
}
