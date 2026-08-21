export function clp(n: number): string {
  return '$' + Math.round(n).toLocaleString('es-CL');
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'tienda'
  );
}

/** SQLite datetime('now') es UTC 'YYYY-MM-DD HH:MM:SS' */
function parseDbDate(s: string): Date {
  return new Date(s.replace(' ', 'T') + 'Z');
}

export function fmtDate(s: string): string {
  return parseDbDate(s).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Santiago',
  });
}

export function fmtDateTime(s: string): string {
  return parseDbDate(s).toLocaleString('es-CL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Santiago',
  });
}

export function timeAgo(s: string): string {
  const diff = Date.now() - parseDbDate(s).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'recién';
  if (min < 60) return 'hace ' + min + ' min';
  const h = Math.floor(min / 60);
  if (h < 24) return 'hace ' + h + ' h';
  const d = Math.floor(h / 24);
  if (d < 30) return 'hace ' + d + ' d';
  const m = Math.floor(d / 30);
  if (m < 12) return 'hace ' + m + ' meses';
  return 'hace ' + Math.floor(m / 12) + ' años';
}
