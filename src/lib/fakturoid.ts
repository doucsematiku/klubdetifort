// Fakturoid API v3 — minimalistický klient pro klubdetifort.cz.
// Vystavuje fakturu na Doučse vzdělávací centrum (slug v env).
// Docs: https://www.fakturoid.cz/api/v3

import crypto from "crypto";

const BASE_URL = "https://app.fakturoid.cz/api/v3/accounts";
const TOKEN_URL = "https://app.fakturoid.cz/api/v3/oauth/token";
const USER_AGENT = "KlubDetiFort (reditel@doucse.cz)";

function getSlug(): string {
  const slug = process.env.FAKTUROID_SLUG;
  if (!slug) throw new Error("FAKTUROID_SLUG není nastavený v env");
  return slug;
}

function getOAuthCreds(): { clientId: string; clientSecret: string } {
  const clientId = process.env.FAKTUROID_CLIENT_ID;
  const clientSecret = process.env.FAKTUROID_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("FAKTUROID_CLIENT_ID + FAKTUROID_CLIENT_SECRET musí být nastavené");
  }
  return { clientId, clientSecret };
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;

  const { clientId, clientSecret } = getOAuthCreds();
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
    },
    body: JSON.stringify({ grant_type: "client_credentials" }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Fakturoid OAuth: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return cachedToken;
}

async function fakturoidHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return {
    "User-Agent": USER_AGENT,
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export type FakturoidInvoiceLine = {
  name: string;
  quantity: number;
  unit_name?: string;
  unit_price: number;
  vat_rate?: number;
};

export type FakturoidInlineSubject = {
  name: string;
  email: string;
  phone?: string;
  type?: "customer" | "supplier" | "both";
};

export type CreateInvoiceParams = {
  subject: FakturoidInlineSubject;
  variable_symbol?: string;
  payment_method?: "bank" | "card" | "cash" | "cod" | "paypal";
  due?: number;
  issued_on?: string;
  note?: string;
  footer_note?: string;
  tags?: string[];
  lines: FakturoidInvoiceLine[];
  issue_invoice_email?: boolean;
  custom_id?: string;
};

export type FakturoidInvoice = {
  id: number;
  number: string;
  variable_symbol: string | null;
  custom_id: string | null;
  subject_id: number;
  status: "open" | "sent" | "overdue" | "paid" | "cancelled" | "uncollectible";
  total: string;
  subtotal: string;
  due_on: string | null;
  paid_on: string | null;
  issued_on: string;
  currency: string;
  html_url: string;
  public_html_url: string | null;
  pdf_url: string;
  url: string;
  iban: string | null;
  bank_account: string | null;
};

async function fakturoidPost<T>(endpoint: string, body: unknown): Promise<T> {
  const url = `${BASE_URL}/${getSlug()}${endpoint}`;
  const headers = await fakturoidHeaders();

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fakturoid POST ${endpoint}: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

async function fakturoidGet<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}/${getSlug()}${endpoint}`;
  const headers = await fakturoidHeaders();

  const res = await fetch(url, { method: "GET", headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fakturoid GET ${endpoint}: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

// Fakturoid v3 nepodporuje inline subjects při tvorbě faktury — musíme 2-step.
async function createOrFindSubject(subject: FakturoidInlineSubject): Promise<number> {
  if (subject.email) {
    try {
      const found = await fakturoidGet<Array<{ id: number; email: string | null }>>(
        `/subjects/search.json?query=${encodeURIComponent(subject.email)}`,
      );
      const exact = found.find(
        (s) => (s.email ?? "").toLowerCase() === subject.email.toLowerCase(),
      );
      if (exact) return exact.id;
    } catch (e) {
      console.warn("[fakturoid] subject search failed, creating new:", e);
    }
  }

  const body: Record<string, unknown> = {
    name: subject.name,
    type: subject.type ?? "customer",
    email: subject.email,
  };
  if (subject.phone) body.phone = subject.phone;

  const created = await fakturoidPost<{ id: number }>("/subjects.json", body);
  return created.id;
}

export async function createInvoice(params: CreateInvoiceParams): Promise<FakturoidInvoice> {
  if (!params.lines || params.lines.length === 0) {
    throw new Error("createInvoice: musí být alespoň 1 položka");
  }

  const subjectId = await createOrFindSubject(params.subject);

  const body: Record<string, unknown> = {
    subject_id: subjectId,
    payment_method: params.payment_method ?? "bank",
    due: params.due ?? 7,
    currency: "CZK",
    lines: params.lines.map((l) => ({
      name: l.name,
      quantity: l.quantity,
      unit_name: l.unit_name ?? "ks",
      unit_price: l.unit_price,
      vat_rate: l.vat_rate ?? 0,
    })),
  };

  if (params.variable_symbol) body.variable_symbol = params.variable_symbol;
  if (params.issued_on) body.issued_on = params.issued_on;
  if (params.note) body.note = params.note;
  if (params.footer_note) body.footer_note = params.footer_note;
  if (params.tags) body.tags = params.tags;
  if (params.issue_invoice_email !== undefined) body.issue_invoice_email = params.issue_invoice_email;
  if (params.custom_id) body.custom_id = params.custom_id;

  return fakturoidPost<FakturoidInvoice>("/invoices.json", body);
}

// HMAC ověření webhookového podpisu (Fakturoid posílá v hlavičce X-Fakturoid-Signature).
export function verifyFakturoidWebhookSignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
  secret: string | undefined = process.env.FAKTUROID_WEBHOOK_SECRET,
): boolean {
  if (!signatureHeader || !secret) return false;

  const computed = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  const a = Buffer.from(computed, "hex");
  const b = Buffer.from(signatureHeader.toLowerCase(), "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Reálná struktura webhooku Fakturoid v3 (ověřeno 2026-07-07 zachycením payloadu):
//   { "body": { "invoice": { custom_id, status, paid_on, number, ... } } }
// POZOR: payload NEMÁ pole `event_type`. Typ dokumentu (faktura vs náklad) se pozná
// podle klíče uvnitř `body` (invoice / expense / …). My subscribujeme jen na
// invoice události (Zaplacena + Platba přidána), takže čteme `body.invoice`.
export type FakturoidWebhookPayload = {
  body?: {
    invoice?: {
      id?: number;
      number?: string;
      custom_id?: string | null;
      status?: string;        // 'open' | 'sent' | 'paid' | 'overdue' | 'cancelled' | …
      paid_on?: string | null;
      total?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
};
