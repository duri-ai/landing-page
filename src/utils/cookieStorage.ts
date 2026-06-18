/**
 * Cookie-backed Supabase auth storage scoped to a shared parent domain
 * so the session is readable across subdomains (e.g. duri-ai.com ↔
 * app.duri-ai.com). Values are base64-encoded and chunked to stay under
 * the ~4KB per-cookie limit; a normal Duri session fits in one cookie.
 * ``getItem`` falls back to localStorage once so a pre-existing session
 * migrates seamlessly on first load.
 */

const CHUNK = 3200;
const MAX_AGE = 60 * 60 * 24 * 400; // 400 days

function encode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function decode(b64: string): string {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function readRaw(name: string): string | null {
  const prefix = `${name}=`;
  for (const part of document.cookie.split("; ")) {
    if (part.startsWith(prefix)) return part.slice(prefix.length);
  }
  return null;
}

function write(name: string, value: string, domain: string): void {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value}; Domain=${domain}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
}

function erase(name: string, domain: string): void {
  document.cookie = `${name}=; Domain=${domain}; Path=/; Max-Age=0; SameSite=Lax`;
}

export function createCookieStorage(domain: string) {
  function clearChunks(key: string): void {
    erase(key, domain);
    for (let i = 0; readRaw(`${key}.${i}`) !== null; i++) {
      erase(`${key}.${i}`, domain);
    }
  }

  return {
    getItem(key: string): string | null {
      const single = readRaw(key);
      if (single !== null) return decode(single);
      let joined = "";
      let found = false;
      for (let i = 0; ; i++) {
        const part = readRaw(`${key}.${i}`);
        if (part === null) break;
        joined += part;
        found = true;
      }
      if (found) return decode(joined);
      return window.localStorage.getItem(key);
    },
    setItem(key: string, value: string): void {
      clearChunks(key);
      const encoded = encode(value);
      if (encoded.length <= CHUNK) {
        write(key, encoded, domain);
      } else {
        for (let i = 0; i * CHUNK < encoded.length; i++) {
          write(`${key}.${i}`, encoded.slice(i * CHUNK, (i + 1) * CHUNK), domain);
        }
      }
      window.localStorage.removeItem(key);
    },
    removeItem(key: string): void {
      clearChunks(key);
      window.localStorage.removeItem(key);
    },
  };
}
