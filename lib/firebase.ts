import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import bcrypt from 'bcryptjs';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAArAjUxTlFGgA3NxKrpkhQGfQt29zNaHY",
  authDomain: "et-calculators.firebaseapp.com",
  projectId: "et-calculators",
  storageBucket: "et-calculators.firebasestorage.app",
  messagingSenderId: "998562878366",
  appId: "1:998562878366:web:f7e7135f0361ef0a143c8f",
  measurementId: "G-89DJKKJQ81"
};

// Initialize Firebase (prevent re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Collection names
const COLLECTIONS = {
  PAGE_SEO: 'page_seo',
  FAQS: 'faqs',
  SETTINGS: 'settings',
  BANNERS: 'banners',
  SCRIPTS: 'scripts',
  ADMIN_USERS: 'admin_users',
  ADMIN_LOGS: 'admin_logs',
  ADMIN_ROLES: 'admin_roles',
  PAGE_CONTENT: 'page_content'
};

// Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface PageSEO {
  pageId: string;
  pagePath: string;
  pageName: string;
  category: string;

  // Meta tags
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  keywords: string;

  // Page content
  h1Title: string;
  subHeading: string; // Two-liner content below H1
  seoContent: string; // Rich SEO content (HTML)

  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;

  // FAQs
  faqs: FAQ[];
  faqsEnabled: boolean;

  // Status
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
  createdAt: string;
}

// ==================== PAGE SEO FUNCTIONS ====================

/**
 * Get all page SEO entries
 */
export async function getAllPageSEO(): Promise<PageSEO[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PAGE_SEO));
    const pages: PageSEO[] = [];
    querySnapshot.forEach((doc) => {
      pages.push({ pageId: doc.id, ...doc.data() } as PageSEO);
    });
    return pages.sort((a, b) => a.pageName.localeCompare(b.pageName));
  } catch (error) {
    console.error('Error getting all page SEO:', error);
    return [];
  }
}

/**
 * Get page SEO by ID (calculator slug)
 */
export async function getPageSEO(pageId: string): Promise<PageSEO | null> {
  try {
    const docRef = doc(db, COLLECTIONS.PAGE_SEO, pageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { pageId: docSnap.id, ...docSnap.data() } as PageSEO;
    }
    return null;
  } catch (error) {
    console.error('Error getting page SEO:', error);
    return null;
  }
}

/**
 * Get page SEO by path
 */
export async function getPageSEOByPath(pagePath: string): Promise<PageSEO | null> {
  try {
    const q = query(collection(db, COLLECTIONS.PAGE_SEO), where('pagePath', '==', pagePath));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { pageId: doc.id, ...doc.data() } as PageSEO;
    }
    return null;
  } catch (error) {
    console.error('Error getting page SEO by path:', error);
    return null;
  }
}

/**
 * Create or update page SEO
 */
export async function savePageSEO(pageId: string, data: Partial<PageSEO>): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTIONS.PAGE_SEO, pageId);
    const docSnap = await getDoc(docRef);

    const now = new Date().toISOString();

    if (docSnap.exists()) {
      // Update existing
      await updateDoc(docRef, {
        ...data,
        lastUpdated: now
      });
    } else {
      // Create new
      await setDoc(docRef, {
        pageId,
        pagePath: data.pagePath || `/us/tools/calculators/${pageId}`,
        pageName: data.pageName || pageId,
        category: data.category || 'calculators',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        canonical: data.canonical || '',
        keywords: data.keywords || '',
        h1Title: data.h1Title || '',
        subHeading: data.subHeading || '',
        seoContent: data.seoContent || '',
        ogTitle: data.ogTitle || '',
        ogDescription: data.ogDescription || '',
        ogImage: data.ogImage || '',
        faqs: data.faqs || [],
        faqsEnabled: data.faqsEnabled ?? true,
        isActive: data.isActive ?? true,
        lastUpdated: now,
        updatedBy: data.updatedBy || 'admin',
        createdAt: now
      });
    }

    return true;
  } catch (error) {
    console.error('Error saving page SEO:', error);
    return false;
  }
}

/**
 * Delete page SEO
 */
export async function deletePageSEO(pageId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PAGE_SEO, pageId));
    return true;
  } catch (error) {
    console.error('Error deleting page SEO:', error);
    return false;
  }
}

/**
 * Get pages by category
 */
export async function getPagesByCategory(category: string): Promise<PageSEO[]> {
  try {
    const q = query(collection(db, COLLECTIONS.PAGE_SEO), where('category', '==', category));
    const querySnapshot = await getDocs(q);

    const pages: PageSEO[] = [];
    querySnapshot.forEach((doc) => {
      pages.push({ pageId: doc.id, ...doc.data() } as PageSEO);
    });
    return pages.sort((a, b) => a.pageName.localeCompare(b.pageName));
  } catch (error) {
    console.error('Error getting pages by category:', error);
    return [];
  }
}

// ==================== FAQ FUNCTIONS ====================

/**
 * Get FAQs for a page
 */
export async function getPageFAQs(pageId: string): Promise<FAQ[]> {
  try {
    const pageSEO = await getPageSEO(pageId);
    if (pageSEO && pageSEO.faqsEnabled && pageSEO.faqs) {
      return pageSEO.faqs.sort((a, b) => a.order - b.order);
    }
    return [];
  } catch (error) {
    console.error('Error getting page FAQs:', error);
    return [];
  }
}

/**
 * Update FAQs for a page
 */
export async function updatePageFAQs(pageId: string, faqs: FAQ[]): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTIONS.PAGE_SEO, pageId);
    await updateDoc(docRef, {
      faqs,
      lastUpdated: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating page FAQs:', error);
    return false;
  }
}

/**
 * Add a single FAQ to a page
 */
export async function addFAQToPage(pageId: string, faq: Omit<FAQ, 'id'>): Promise<boolean> {
  try {
    const pageSEO = await getPageSEO(pageId);
    if (!pageSEO) return false;

    const newFaq: FAQ = {
      ...faq,
      id: `faq-${Date.now()}`
    };

    const updatedFaqs = [...(pageSEO.faqs || []), newFaq];
    return await updatePageFAQs(pageId, updatedFaqs);
  } catch (error) {
    console.error('Error adding FAQ to page:', error);
    return false;
  }
}

/**
 * Update a single FAQ
 */
export async function updateFAQ(pageId: string, faqId: string, updates: Partial<FAQ>): Promise<boolean> {
  try {
    const pageSEO = await getPageSEO(pageId);
    if (!pageSEO || !pageSEO.faqs) return false;

    const updatedFaqs = pageSEO.faqs.map(faq =>
      faq.id === faqId ? { ...faq, ...updates } : faq
    );

    return await updatePageFAQs(pageId, updatedFaqs);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return false;
  }
}

/**
 * Delete a single FAQ
 */
export async function deleteFAQ(pageId: string, faqId: string): Promise<boolean> {
  try {
    const pageSEO = await getPageSEO(pageId);
    if (!pageSEO || !pageSEO.faqs) return false;

    const updatedFaqs = pageSEO.faqs.filter(faq => faq.id !== faqId);
    return await updatePageFAQs(pageId, updatedFaqs);
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return false;
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Initialize default SEO data for a calculator (if not exists)
 */
export async function initializePageSEO(pageId: string, pageName: string, pagePath: string): Promise<boolean> {
  try {
    const existing = await getPageSEO(pageId);
    if (existing) return true; // Already exists

    return await savePageSEO(pageId, {
      pageName,
      pagePath,
      category: 'calculators',
      isActive: true,
      faqsEnabled: true,
      faqs: []
    });
  } catch (error) {
    console.error('Error initializing page SEO:', error);
    return false;
  }
}

/**
 * Bulk import page SEO data
 */
export async function bulkImportPageSEO(pages: Partial<PageSEO>[]): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const page of pages) {
    if (page.pageId) {
      const result = await savePageSEO(page.pageId, page);
      if (result) {
        success++;
      } else {
        failed++;
      }
    } else {
      failed++;
    }
  }

  return { success, failed };
}

// ==================== BANNER TYPES & FUNCTIONS ====================

export interface Banner {
  id: string;
  name: string;
  enabled: boolean;
  script: string;
  dimensions: string;
  platform?: string;
  category?: string;
  minContainerSize?: string;
  fallbackAd: {
    text: string;
    width: number;
    height: number;
  };
}

/**
 * Get all banners
 */
export async function getAllBanners(): Promise<{ [key: string]: Banner }> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.BANNERS));
    const banners: { [key: string]: Banner } = {};
    querySnapshot.forEach((doc) => {
      banners[doc.id] = { id: doc.id, ...doc.data() } as Banner;
    });
    return banners;
  } catch (error) {
    console.error('Error getting all banners:', error);
    return {};
  }
}

/**
 * Get banner by ID
 */
export async function getBanner(bannerId: string): Promise<Banner | null> {
  try {
    const docRef = doc(db, COLLECTIONS.BANNERS, bannerId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Banner;
    }
    return null;
  } catch (error) {
    console.error('Error getting banner:', error);
    return null;
  }
}

/**
 * Save banner
 */
export async function saveBanner(bannerId: string, data: Partial<Banner>): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTIONS.BANNERS, bannerId);
    await setDoc(docRef, {
      id: bannerId,
      name: data.name || bannerId,
      enabled: data.enabled ?? true,
      script: data.script || '',
      dimensions: data.dimensions || '300x250',
      platform: data.platform || 'desktop',
      category: data.category || 'desktop',
      minContainerSize: data.minContainerSize || '300x250',
      fallbackAd: data.fallbackAd || { text: 'Advertisement', width: 300, height: 250 }
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving banner:', error);
    return false;
  }
}

/**
 * Delete banner
 */
export async function deleteBanner(bannerId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.BANNERS, bannerId));
    return true;
  } catch (error) {
    console.error('Error deleting banner:', error);
    return false;
  }
}

// ==================== SCRIPT TYPES & FUNCTIONS ====================

export interface Script {
  id: string;
  name: string;
  enabled: boolean;
  script: string;
  location: 'header' | 'body';
}

/**
 * Get all scripts
 */
export async function getAllScripts(): Promise<{ headerScripts: Script[]; bodyScripts: Script[] }> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.SCRIPTS));
    const headerScripts: Script[] = [];
    const bodyScripts: Script[] = [];

    querySnapshot.forEach((doc) => {
      const data = { id: doc.id, ...doc.data() } as Script;
      if (data.location === 'header') {
        headerScripts.push(data);
      } else {
        bodyScripts.push(data);
      }
    });

    return { headerScripts, bodyScripts };
  } catch (error) {
    console.error('Error getting all scripts:', error);
    return { headerScripts: [], bodyScripts: [] };
  }
}

/**
 * Get script by ID
 */
export async function getScript(scriptId: string): Promise<Script | null> {
  try {
    const docRef = doc(db, COLLECTIONS.SCRIPTS, scriptId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Script;
    }
    return null;
  } catch (error) {
    console.error('Error getting script:', error);
    return null;
  }
}

/**
 * Save script
 */
export async function saveScript(scriptId: string, data: Partial<Script>): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTIONS.SCRIPTS, scriptId);
    await setDoc(docRef, {
      id: scriptId,
      name: data.name || scriptId,
      enabled: data.enabled ?? false,
      script: data.script || '',
      location: data.location || 'header'
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving script:', error);
    return false;
  }
}

/**
 * Delete script
 */
export async function deleteScript(scriptId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SCRIPTS, scriptId));
    return true;
  } catch (error) {
    console.error('Error deleting script:', error);
    return false;
  }
}

// ==================== ADMIN USER TYPES & FUNCTIONS ====================

export type AdminRole = 'super_admin' | 'admin' | 'content_manager' | 'seo_manager';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  name: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
  createdBy: string;
}

export interface AdminUserPublic {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  name: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
}

// Role permissions
export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ['*'], // All permissions
  admin: ['seo', 'banners', 'scripts', 'users_view'],
  content_manager: ['seo', 'banners'],
  seo_manager: ['seo']
};

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  content_manager: 'Content Manager',
  seo_manager: 'SEO Manager'
};

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Get all admin users
 */
export async function getAllAdminUsers(): Promise<AdminUserPublic[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.ADMIN_USERS));
    const users: AdminUserPublic[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        username: data.username,
        email: data.email,
        role: data.role,
        name: data.name,
        isActive: data.isActive,
        createdAt: data.createdAt,
        lastLogin: data.lastLogin
      });
    });
    return users.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error getting admin users:', error);
    return [];
  }
}

/**
 * Get admin user by ID
 */
export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  try {
    const docRef = doc(db, COLLECTIONS.ADMIN_USERS, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as AdminUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
}

/**
 * Get admin user by username
 */
export async function getAdminUserByUsername(username: string): Promise<AdminUser | null> {
  try {
    const q = query(collection(db, COLLECTIONS.ADMIN_USERS), where('username', '==', username.toLowerCase()));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as AdminUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting admin user by username:', error);
    return null;
  }
}

/**
 * Authenticate admin user
 */
export async function authenticateAdmin(username: string, password: string): Promise<{ success: boolean; user?: AdminUserPublic; error?: string }> {
  try {
    const user = await getAdminUserByUsername(username);

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is disabled' };
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Update last login
    await updateDoc(doc(db, COLLECTIONS.ADMIN_USERS, user.id), {
      lastLogin: new Date().toISOString()
    });

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error authenticating admin:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

/**
 * Create admin user
 */
export async function createAdminUser(data: {
  username: string;
  email: string;
  password: string;
  role: AdminRole;
  name: string;
  createdBy: string;
}): Promise<{ success: boolean; user?: AdminUserPublic; error?: string }> {
  try {
    // Check if username already exists
    const existing = await getAdminUserByUsername(data.username);
    if (existing) {
      return { success: false, error: 'Username already exists' };
    }

    const userId = `admin-${Date.now()}`;
    const passwordHash = await hashPassword(data.password);
    const now = new Date().toISOString();

    await setDoc(doc(db, COLLECTIONS.ADMIN_USERS, userId), {
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      name: data.name,
      isActive: true,
      createdAt: now,
      lastLogin: null,
      createdBy: data.createdBy
    });

    return {
      success: true,
      user: {
        id: userId,
        username: data.username.toLowerCase(),
        email: data.email.toLowerCase(),
        role: data.role,
        name: data.name,
        isActive: true,
        createdAt: now,
        lastLogin: null
      }
    };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

/**
 * Update admin user
 */
export async function updateAdminUser(userId: string, data: Partial<{
  email: string;
  role: AdminRole;
  name: string;
  isActive: boolean;
  password: string;
}>): Promise<boolean> {
  try {
    const updateData: any = {};

    if (data.email) updateData.email = data.email.toLowerCase();
    if (data.role) updateData.role = data.role;
    if (data.name) updateData.name = data.name;
    if (typeof data.isActive === 'boolean') updateData.isActive = data.isActive;
    if (data.password) updateData.passwordHash = await hashPassword(data.password);

    await updateDoc(doc(db, COLLECTIONS.ADMIN_USERS, userId), updateData);
    return true;
  } catch (error) {
    console.error('Error updating admin user:', error);
    return false;
  }
}

/**
 * Delete admin user
 */
export async function deleteAdminUser(userId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.ADMIN_USERS, userId));
    return true;
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return false;
  }
}

/**
 * Check if user has permission
 */
export function hasPermission(role: AdminRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes('*') || permissions.includes(permission);
}

/**
 * Initialize super admin (run once)
 */
export async function initializeSuperAdmin(): Promise<boolean> {
  try {
    // Check if any super admin exists
    const q = query(collection(db, COLLECTIONS.ADMIN_USERS), where('role', '==', 'super_admin'));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log('Super admin already exists');
      return true;
    }

    // Create default super admin with email as username
    const result = await createAdminUser({
      username: 'anil.kumar6@timesinternet.in',
      email: 'anil.kumar6@timesinternet.in',
      password: 'SAINIpiet@199207',
      role: 'super_admin',
      name: 'Anil Kumar',
      createdBy: 'system'
    });

    return result.success;
  } catch (error) {
    console.error('Error initializing super admin:', error);
    return false;
  }
}

// ==================== ADMIN ACTIVITY LOGS ====================

export type AdminLogAction =
  | 'login'
  | 'logout'
  | 'seo_create'
  | 'seo_update'
  | 'seo_delete'
  | 'banner_create'
  | 'banner_update'
  | 'banner_delete'
  | 'script_create'
  | 'script_update'
  | 'script_delete'
  | 'user_create'
  | 'user_update'
  | 'user_delete';

export interface AdminLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: AdminRole;
  action: AdminLogAction;
  actionLabel: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export const ACTION_LABELS: Record<AdminLogAction, string> = {
  login: 'Logged In',
  logout: 'Logged Out',
  seo_create: 'Created SEO Entry',
  seo_update: 'Updated SEO Entry',
  seo_delete: 'Deleted SEO Entry',
  banner_create: 'Created Banner',
  banner_update: 'Updated Banner',
  banner_delete: 'Deleted Banner',
  script_create: 'Created Script',
  script_update: 'Updated Script',
  script_delete: 'Deleted Script',
  user_create: 'Created User',
  user_update: 'Updated User',
  user_delete: 'Deleted User'
};

/**
 * Log admin activity
 */
export async function logAdminActivity(data: {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: AdminRole;
  action: AdminLogAction;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<boolean> {
  try {
    const logId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    await setDoc(doc(db, COLLECTIONS.ADMIN_LOGS, logId), {
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      userRole: data.userRole,
      action: data.action,
      actionLabel: ACTION_LABELS[data.action],
      details: data.details,
      ipAddress: data.ipAddress || '',
      userAgent: data.userAgent || '',
      timestamp
    });

    return true;
  } catch (error) {
    console.error('Error logging admin activity:', error);
    return false;
  }
}

/**
 * Get admin activity logs (super admin only)
 */
export async function getAdminLogs(limit: number = 100): Promise<AdminLog[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.ADMIN_LOGS),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const logs: AdminLog[] = [];
    let count = 0;
    querySnapshot.forEach((doc) => {
      if (count < limit) {
        logs.push({ id: doc.id, ...doc.data() } as AdminLog);
        count++;
      }
    });

    return logs;
  } catch (error) {
    console.error('Error getting admin logs:', error);
    return [];
  }
}

/**
 * Get admin logs by user
 */
export async function getAdminLogsByUser(userId: string, limit: number = 50): Promise<AdminLog[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.ADMIN_LOGS),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const logs: AdminLog[] = [];
    let count = 0;
    querySnapshot.forEach((doc) => {
      if (count < limit) {
        logs.push({ id: doc.id, ...doc.data() } as AdminLog);
        count++;
      }
    });

    return logs;
  } catch (error) {
    console.error('Error getting admin logs by user:', error);
    return [];
  }
}

// ==================== CUSTOM ROLE MANAGEMENT ====================

export interface CustomRole {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  isSystem: boolean; // System roles cannot be deleted
  createdAt: string;
  updatedBy: string;
}

// Available permissions for roles
export const AVAILABLE_PERMISSIONS = [
  { id: 'seo', label: 'SEO Management', description: 'Manage meta titles, descriptions, FAQs' },
  { id: 'banners', label: 'Banner Management', description: 'Manage ad banners' },
  { id: 'scripts', label: 'Script Management', description: 'Manage GTM, Analytics scripts' },
  { id: 'users', label: 'User Management', description: 'View admin users' },
  { id: 'users_manage', label: 'User Management (Full)', description: 'Create, edit, delete users' },
  { id: 'roles', label: 'Role Management', description: 'Manage roles and permissions' },
  { id: 'logs', label: 'Activity Logs', description: 'View activity logs' },
  { id: 'content', label: 'Page Content', description: 'Edit page content' },
];

/**
 * Get all custom roles
 */
export async function getAllRoles(): Promise<CustomRole[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.ADMIN_ROLES));
    const roles: CustomRole[] = [];
    querySnapshot.forEach((doc) => {
      roles.push({ id: doc.id, ...doc.data() } as CustomRole);
    });
    return roles.sort((a, b) => a.displayName.localeCompare(b.displayName));
  } catch (error) {
    console.error('Error getting roles:', error);
    return [];
  }
}

/**
 * Get role by ID
 */
export async function getRole(roleId: string): Promise<CustomRole | null> {
  try {
    const docRef = doc(db, COLLECTIONS.ADMIN_ROLES, roleId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CustomRole;
    }
    return null;
  } catch (error) {
    console.error('Error getting role:', error);
    return null;
  }
}

/**
 * Create a new role
 */
export async function createRole(data: {
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  updatedBy: string;
}): Promise<{ success: boolean; role?: CustomRole; error?: string }> {
  try {
    // Check if role name already exists
    const q = query(collection(db, COLLECTIONS.ADMIN_ROLES), where('name', '==', data.name.toLowerCase()));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { success: false, error: 'Role name already exists' };
    }

    const roleId = `role-${Date.now()}`;
    const now = new Date().toISOString();

    await setDoc(doc(db, COLLECTIONS.ADMIN_ROLES, roleId), {
      name: data.name.toLowerCase(),
      displayName: data.displayName,
      description: data.description,
      permissions: data.permissions,
      isSystem: false,
      createdAt: now,
      updatedBy: data.updatedBy
    });

    return {
      success: true,
      role: {
        id: roleId,
        name: data.name.toLowerCase(),
        displayName: data.displayName,
        description: data.description,
        permissions: data.permissions,
        isSystem: false,
        createdAt: now,
        updatedBy: data.updatedBy
      }
    };
  } catch (error) {
    console.error('Error creating role:', error);
    return { success: false, error: 'Failed to create role' };
  }
}

/**
 * Update a role
 */
export async function updateRole(roleId: string, data: Partial<{
  displayName: string;
  description: string;
  permissions: string[];
  updatedBy: string;
}>): Promise<boolean> {
  try {
    const role = await getRole(roleId);
    if (!role) return false;

    await updateDoc(doc(db, COLLECTIONS.ADMIN_ROLES, roleId), {
      ...data,
      updatedBy: data.updatedBy
    });
    return true;
  } catch (error) {
    console.error('Error updating role:', error);
    return false;
  }
}

/**
 * Delete a role
 */
export async function deleteRole(roleId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const role = await getRole(roleId);
    if (!role) {
      return { success: false, error: 'Role not found' };
    }
    if (role.isSystem) {
      return { success: false, error: 'Cannot delete system roles' };
    }

    await deleteDoc(doc(db, COLLECTIONS.ADMIN_ROLES, roleId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting role:', error);
    return { success: false, error: 'Failed to delete role' };
  }
}

/**
 * Initialize default system roles
 */
export async function initializeSystemRoles(): Promise<boolean> {
  try {
    const existingRoles = await getAllRoles();
    if (existingRoles.length > 0) {
      return true; // Already initialized
    }

    const now = new Date().toISOString();
    const systemRoles = [
      {
        id: 'super_admin',
        name: 'super_admin',
        displayName: 'Super Admin',
        description: 'Full access to all features',
        permissions: ['*'],
        isSystem: true,
        createdAt: now,
        updatedBy: 'system'
      },
      {
        id: 'admin',
        name: 'admin',
        displayName: 'Admin',
        description: 'Access to SEO, banners, scripts, and view users',
        permissions: ['seo', 'banners', 'scripts', 'users'],
        isSystem: true,
        createdAt: now,
        updatedBy: 'system'
      },
      {
        id: 'content_manager',
        name: 'content_manager',
        displayName: 'Content Manager',
        description: 'Access to SEO and banners',
        permissions: ['seo', 'banners', 'content'],
        isSystem: true,
        createdAt: now,
        updatedBy: 'system'
      },
      {
        id: 'seo_manager',
        name: 'seo_manager',
        displayName: 'SEO Manager',
        description: 'Access to SEO management only',
        permissions: ['seo'],
        isSystem: true,
        createdAt: now,
        updatedBy: 'system'
      }
    ];

    for (const role of systemRoles) {
      await setDoc(doc(db, COLLECTIONS.ADMIN_ROLES, role.id), role);
    }

    return true;
  } catch (error) {
    console.error('Error initializing system roles:', error);
    return false;
  }
}

// ==================== PAGE CONTENT MANAGEMENT ====================

export interface PageContent {
  pageId: string;
  pagePath: string;
  pageName: string;
  content: {
    h1Title?: string;
    subHeading?: string;
    mainContent?: string;
    sidebarContent?: string;
    footerContent?: string;
  };
  lastUpdated: string;
  updatedBy: string;
}

/**
 * Get page content by ID
 */
export async function getPageContent(pageId: string): Promise<PageContent | null> {
  try {
    const docRef = doc(db, COLLECTIONS.PAGE_CONTENT, pageId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { pageId: docSnap.id, ...docSnap.data() } as PageContent;
    }
    return null;
  } catch (error) {
    console.error('Error getting page content:', error);
    return null;
  }
}

/**
 * Save page content
 */
export async function savePageContent(pageId: string, data: Partial<PageContent>): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTIONS.PAGE_CONTENT, pageId);
    const now = new Date().toISOString();

    await setDoc(docRef, {
      pageId,
      pagePath: data.pagePath || '',
      pageName: data.pageName || pageId,
      content: data.content || {},
      lastUpdated: now,
      updatedBy: data.updatedBy || 'admin'
    }, { merge: true });

    return true;
  } catch (error) {
    console.error('Error saving page content:', error);
    return false;
  }
}

/**
 * Get all page content entries
 */
export async function getAllPageContent(): Promise<PageContent[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PAGE_CONTENT));
    const pages: PageContent[] = [];
    querySnapshot.forEach((doc) => {
      pages.push({ pageId: doc.id, ...doc.data() } as PageContent);
    });
    return pages.sort((a, b) => a.pageName.localeCompare(b.pageName));
  } catch (error) {
    console.error('Error getting all page content:', error);
    return [];
  }
}

// Export Firestore and Auth instances for advanced usage
export { db, auth, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, COLLECTIONS };
