export interface CsvColumn<T> {
  key: keyof T;
  header: string;
}

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv<T extends Record<string, any>>(
  rows: T[],
  columns: CsvColumn<T>[]
): string {
  const header = columns.map((c) => escapeCsvValue(c.header)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => escapeCsvValue(row[c.key])).join(",")
  );
  return [header, ...lines].join("\n");
}