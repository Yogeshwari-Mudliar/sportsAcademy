import { mockUsers } from "./mockUsers";
import { ROLES, isRole, type Role } from "../constants/roles";

const USERS_KEY = "account_users";
const USER_KEY = "user";
const ACCOUNT_EVENT = "accountUpdated";

export interface AccountUser {
  id: number;
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: Role;
  academyId?: number;
}

function normalizeUser(user: AccountUser): AccountUser {
  const normalizedRole = String(user.role).toLowerCase();
  return {
    ...user,
    role: isRole(normalizedRole) ? normalizedRole : ROLES.student,
  };
}

function readUsers(): AccountUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const stored = (JSON.parse(raw) as AccountUser[]).map(normalizeUser);
      const mockList = (mockUsers as AccountUser[]).map(normalizeUser);
      const merged = [...stored];

      for (const user of mockList) {
        const index = merged.findIndex((u) => u.id === user.id);
        if (index === -1) {
          merged.push(user);
        } else if (user.academyId !== undefined && merged[index].academyId === undefined) {
          merged[index] = { ...merged[index], academyId: user.academyId };
        }
      }

      if (merged.length !== stored.length) {
        localStorage.setItem(USERS_KEY, JSON.stringify(merged));
      }

      return merged.map(normalizeUser);
    }
  } catch {
    /* fall through */
  }
  const users = (mockUsers as AccountUser[]).map(normalizeUser);
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
  return readUsers().filter((u) => u.role === ROLES.superadmin);
}

function canManageAccount(actor: AccountUser | null, target: AccountUser) {
  if (!actor) return false;
  if (actor.role === ROLES.superadmin) return true;
  if (actor.role === ROLES.admin) {
    return target.id === actor.id || target.role === ROLES.student;
  }
  return target.id === actor.id;
}

export function getManageableAccountUsers(): AccountUser[] {
  const currentUser = getCurrentUser();
  return readUsers().filter((user) => canManageAccount(currentUser, user));
}

export function getUserAcademyId(): number | undefined {
  return getCurrentUser()?.academyId;
}

export function logoutUser() {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem("active_academy_id");
}

export function getCurrentUser(): AccountUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? normalizeUser(JSON.parse(raw) as AccountUser) : null;
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
  const currentUser = getCurrentUser();
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return { success: false, error: "User not found." };
  }

  const user = users[index];

  if (!canManageAccount(currentUser, user)) {
    return { success: false, error: "You do not have permission to update this account." };
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
    return { success: false, error: "Select at least one user." };
  }

  const users = readUsers();
  const currentUser = getCurrentUser();
  let count = 0;

  for (const userId of userIds) {
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) continue;

    const user = users[index];
    if (!canManageAccount(currentUser, user)) continue;

    const updated: AccountUser = { ...user, password: newPassword };
    users[index] = updated;
    syncSessionIfNeeded(updated);
    count += 1;
  }

  if (count === 0) {
    return { success: false, error: "No permitted user selected." };
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
