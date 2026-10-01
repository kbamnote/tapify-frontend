/**
 * Lead parsing for the dashboard.
 *
 * GENERATED FROM tapify-app/src/services/leadImport.js — same logic, same
 * edge cases, exported as a browser global instead of an ES module. The app
 * cannot load a file from this site and this page cannot load a React Native
 * module, so the code exists twice; keeping it a mechanical copy is what stops
 * the two drifting into different ideas of a valid phone number.
 *
 * Change the app's copy, then regenerate this one.
 */
(function (global) {
'use strict';

const IN_CC = '91';

/**
 * A phone number as WhatsApp wants it, or '' if it cannot be one.
 *
 * Rejecting is the point: a half-typed number sent to a broadcast is a
 * delivery failure that counts against the business's quality rating.
 */
function normalisePhone(raw) {
  let d = String(raw == null ? '' : raw).replace(/\D+/g, '');
  if (!d) return '';

  // 00 91 … — the international prefix written the old way.
  if (d.startsWith('00')) d = d.slice(2);
  // A domestic trunk '0' before a 10-digit mobile.
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);

  if (d.length === 10) {
    // Indian mobiles start 6–9. A 10-digit number starting 0–5 is a landline
    // or a typo, and WhatsApp will not deliver to it.
    if (!/^[6-9]/.test(d)) return '';
    return IN_CC + d;
  }

  // Already carries a country code.
  if (d.length >= 11 && d.length <= 15) {
    if (d.startsWith(IN_CC) && d.length !== 12) return '';   // 91 + 10 digits, no more
    return d;
  }

  return '';
}

/** A person's name, trimmed and capped. Blank is fine — the server falls back. */
function cleanLeadName(raw) {
  return String(raw == null ? '' : raw).replace(/\s+/g, ' ').trim().slice(0, 60);
}

/**
 * Split delimited text into rows.
 *
 * Hand-rolled rather than pulled from a library because the app ships this
 * over the air: a new dependency would mean a new build. Handles quoted
 * fields, embedded commas and newlines, doubled quotes, and CRLF. The
 * delimiter is detected per file so a tab-separated paste works too.
 */
function parseDelimited(text) {
  const src = String(text == null ? '' : text).replace(/^﻿/, '');
  if (!src.trim()) return [];

  // Guess from the first line, counting only separators outside quotes.
  const firstLine = src.split(/\r?\n/)[0] || '';
  const count = (ch) => {
    let n = 0, q = false;
    for (let i = 0; i < firstLine.length; i++) {
      const c = firstLine[i];
      if (c === '"') q = !q;
      else if (c === ch && !q) n++;
    }
    return n;
  };
  const delim = count('\t') > count(',') ? '\t' : (count(',') >= count(';') ? ',' : ';');

  const rows = [];
  let row = [], field = '', quoted = false;

  for (let i = 0; i < src.length; i++) {
    const c = src[i];

    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; }   // "" is a literal quote
        else quoted = false;
      } else field += c;
      continue;
    }

    if (c === '"') { quoted = true; continue; }
    if (c === delim) { row.push(field); field = ''; continue; }
    if (c === '\r') continue;
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
    field += c;
  }
  row.push(field);
  rows.push(row);

  return rows.filter((r) => r.some((f) => String(f).trim() !== ''));
}

const PHONE_WORDS = ['phone', 'mobile', 'number', 'contact', 'whatsapp', 'msisdn', 'cell', 'tel'];
const NAME_WORDS  = ['name', 'customer', 'client', 'person', 'firstname', 'fullname'];

/**
 * Work out which column holds what.
 *
 * A header row is used when there is one. When there is not — a plain column
 * of numbers pasted out of a spreadsheet is the common case — the column that
 * actually looks like phone numbers is used instead, so the import still works
 * without the customer having to label anything.
 */
function detectColumns(rows) {
  if (!rows.length) return { phone: -1, name: -1, headerRow: false };

  const first = rows[0].map((h) => String(h).toLowerCase().replace(/[^a-z]/g, ''));
  const findBy = (words) => first.findIndex((h) => h && words.some((w) => h.includes(w)));

  const phoneByHeader = findBy(PHONE_WORDS);
  const nameByHeader  = findBy(NAME_WORDS);
  // A header row names a phone column AND holds no usable number itself.
  if (phoneByHeader !== -1 && !rows[0].some((c) => normalisePhone(c))) {
    return { phone: phoneByHeader, name: nameByHeader, headerRow: true };
  }

  // No header: score each column by how many of its cells are real numbers.
  const width = Math.max(...rows.map((r) => r.length));
  let best = -1, bestHits = 0;
  for (let c = 0; c < width; c++) {
    const hits = rows.reduce((n, r) => n + (normalisePhone(r[c]) ? 1 : 0), 0);
    if (hits > bestHits) { bestHits = hits; best = c; }
  }
  if (best === -1) return { phone: -1, name: -1, headerRow: false };

  // The name is the first other column carrying mostly non-numeric text.
  let name = -1;
  for (let c = 0; c < width; c++) {
    if (c === best) continue;
    const texty = rows.reduce((n, r) => n + (/[a-z]/i.test(String(r[c] || '')) ? 1 : 0), 0);
    if (texty > rows.length / 2) { name = c; break; }
  }
  return { phone: best, name, headerRow: false };
}

/**
 * Delimited text → recipients, with a count of what was dropped and why.
 *
 * The caller shows those counts. An import that silently discards half a list
 * is worse than one that refuses, because the customer only finds out when the
 * campaign under-delivers.
 */
function leadsFromText(text) {
  const rows = parseDelimited(text);
  const cols = detectColumns(rows);
  if (cols.phone === -1) return { leads: [], invalid: rows.length, duplicates: 0 };

  const body = cols.headerRow ? rows.slice(1) : rows;
  const seen = new Set();
  const leads = [];
  let invalid = 0, duplicates = 0;

  body.forEach((r) => {
    const phone = normalisePhone(r[cols.phone]);
    if (!phone) { invalid++; return; }
    if (seen.has(phone)) { duplicates++; return; }
    seen.add(phone);
    leads.push({ phone, name: cols.name >= 0 ? cleanLeadName(r[cols.name]) : '' });
  });

  return { leads, invalid, duplicates };
}

/** Phone-book entries (expo-contacts shape) → recipients. */
function leadsFromContacts(contacts) {
  const seen = new Set();
  const leads = [];
  let invalid = 0, duplicates = 0;

  (contacts || []).forEach((c) => {
    const numbers = Array.isArray(c?.phoneNumbers) ? c.phoneNumbers : [];
    if (!numbers.length) { invalid++; return; }
    // One person, one message: the first number that can receive WhatsApp.
    const phone = numbers.map((n) => normalisePhone(n?.number)).find(Boolean) || '';
    if (!phone) { invalid++; return; }
    if (seen.has(phone)) { duplicates++; return; }
    seen.add(phone);
    leads.push({ phone, name: cleanLeadName(c?.name) });
  });

  return { leads, invalid, duplicates };
}

/**
 * Fold new recipients into the list already on screen.
 *
 * Someone already in the inbox keeps their existing entry — their name there
 * came from WhatsApp itself and is likelier right than a spreadsheet's. A
 * name is only filled in when the existing one is blank.
 */
function mergeLeads(existing, incoming, cap = 500) {
  const out = (existing || []).map((c) => ({ ...c }));
  const index = new Map(out.map((c, i) => [normalisePhone(c.phone) || String(c.phone), i]));

  let added = 0, merged = 0, overflow = 0;

  (incoming || []).forEach((lead) => {
    const key = lead.phone;
    if (index.has(key)) {
      const row = out[index.get(key)];
      if (!String(row.name || '').trim() && lead.name) row.name = lead.name;
      merged++;
      return;
    }
    if (out.length >= cap) { overflow++; return; }
    index.set(key, out.length);
    out.push({ phone: key, name: lead.name || '', imported: true });
    added++;
  });

  return { contacts: out, added, merged, overflow };
}

global.LeadImport = {
  normalisePhone: normalisePhone,
  cleanLeadName: cleanLeadName,
  parseDelimited: parseDelimited,
  detectColumns: detectColumns,
  leadsFromText: leadsFromText,
  leadsFromContacts: leadsFromContacts,
  mergeLeads: mergeLeads,
};
})(typeof window !== 'undefined' ? window : this);
