import { mockUsers } from "./mockUsers";

const USERS_KEY = "account_users";
const USER_KEY = "user";
const ACCOUNT_EVENT = "accountUpdated";

export interface AccountUser {
  id: number;
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
}

function readUsers(): AccountUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as AccountUser[];
      const mockList = mockUsers as AccountUser[];
      const merged = [...stored];

      for (const user of mockList) {
        const exists = merged.some((u) => u.id === user.id);
        if (!exists) merged.push(user);
      }

      if (merged.length !== stored.length) {
        localStorage.setItem(USERS_KEY, JSON.stringify(merged));
      }

      return merged;
    }
  } catch {
    /* fall through */
  }
  const users = mockUsers as AccountUser[];
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return users;
}

function writeUsers(users: AccountUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event(ACCOUNT_EVENT));
}

export function getStoredUsers(): AccountUser[] {
  return readUsers();
}

export function getSuperAdmins(): AccountUser[] {
  return readUsers().filter((u) => u.role === "superadmin");
}

export function getCurrentUser(): AccountUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AccountUser) : null;
  } catch {
    return null;
  }
}

export function authenticateUser(
  identifier: string,
  password: string
): AccountUser | undefined {
  const trimmed = identifier.trim();
  const users = readUsers();
  return users.find(
    (u) =>
      (u.email.toLowerCase() === trimmed.toLowerCase() || u.mobile === trimmed) &&
      u.password === password
  );
}

function syncSessionIfNeeded(updated: AccountUser) {
  const session = getCurrentUser();
  if (session?.id === updated.id) {
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  }
}

export function updateAdminEmail(
  userId: number,
  newEmail: string
): { success: true; user: AccountUser } | { success: false; error: string } {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return { success: false, error: "Super admin not found." };
  }

  const user = users[index];

  if (user.role !== "superadmin") {
    return { success: false, error: "Only super admin accounts can be updated here." };
  }

  const emailTaken = users.some(
    (u) => u.id !== userId && u.email.toLowerCase() === newEmail.toLowerCase()
  );
  if (emailTaken) {
    return { success: false, error: "This email is already in use." };
  }

  if (user.email.toLowerCase() === newEmail.toLowerCase()) {
    return { success: false, error: "New email must be different from current email." };
  }

  const updated: AccountUser = { ...user, email: newEmail };
  users[index] = updated;
  writeUsers(users);
  syncSessionIfNeeded(updated);

  return { success: true, user: updated };
}

export function updateAdminPasswords(
  userIds: number[],
  newPassword: string
): { success: true; count: number } | { success: false; error: string } {
  if (userIds.length === 0) {
    return { success: false, error: "Select at least one super admin." };
  }

  const users = readUsers();
  let count = 0;

  for (const userId of userIds) {
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) continue;

    const user = users[index];
    if (user.role !== "superadmin") continue;

    const updated: AccountUser = { ...user, password: newPassword };
    users[index] = updated;
    syncSessionIfNeeded(updated);
    count += 1;
  }

  if (count === 0) {
    return { success: false, error: "No valid super admin selected." };
  }

  writeUsers(users);
  return { success: true, count };
}

export function validateEmail(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return "Email is required";
  if (trimmed.includes(" ")) return "Spaces are not allowed in email";

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(trimmed)) return "Please enter a valid email address";

  return "";
}

export function validatePasswordStrength(password: string): string {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain a special character";
  }
  return "";
}

export const ACCOUNT_UPDATED_EVENT = ACCOUNT_EVENT;
