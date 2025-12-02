export interface CSVPortfolioRow {
  title: string;
  category: string;
  location: string;
  date: string;
  description?: string;
  before_image?: string;
  after_image?: string;
  featured?: string;
}

export function generateTemplateCSV(categories: string[]): string {
  const headers = [
    'title',
    'category',
    'location',
    'date',
    'description',
    'before_image',
    'after_image',
    'featured'
  ];

  const exampleRows = [
    {
      title: 'Voorbeeld Project 1',
      category: categories.length > 0 ? categories[0] : 'Renovatie',
      location: 'Amsterdam',
      date: '2024-01-15',
      description: 'Een mooi afgerond project met geweldige resultaten',
      before_image: 'https://example.com/before.jpg',
      after_image: 'https://example.com/after.jpg',
      featured: 'false'
    },
    {
      title: 'Voorbeeld Project 2',
      category: categories.length > 1 ? categories[1] : 'Nieuwbouw',
      location: 'Rotterdam',
      date: '2024-02-20',
      description: 'Professioneel werk met tevreden klant',
      before_image: '',
      after_image: '',
      featured: 'true'
    }
  ];

  const csvContent = [
    headers.join(','),
    ...exampleRows.map(row =>
      headers.map(header => {
        const value = row[header as keyof typeof row] || '';
        return `"${value.toString().replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string): void {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export interface CSVParseResult {
  data: CSVPortfolioRow[];
  errors: { row: number; message: string }[];
}

export function parseCSV(csvText: string): CSVParseResult {
  const lines = csvText.split('\n').filter(line => line.trim());
  const errors: { row: number; message: string }[] = [];
  const data: CSVPortfolioRow[] = [];

  if (lines.length < 2) {
    errors.push({ row: 0, message: 'CSV bestand is leeg of heeft geen data rijen' });
    return { data, errors };
  }

  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());

  const requiredHeaders = ['title', 'category', 'location', 'date'];
  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

  if (missingHeaders.length > 0) {
    errors.push({
      row: 0,
      message: `Ontbrekende verplichte kolommen: ${missingHeaders.join(', ')}`
    });
    return { data, errors };
  }

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    if (values.length === 0 || values.every(v => !v.trim())) {
      continue;
    }

    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });

    if (!row.title || !row.category || !row.location || !row.date) {
      errors.push({
        row: i + 1,
        message: 'Ontbrekende verplichte velden (title, category, location, date)'
      });
      continue;
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(row.date)) {
      errors.push({
        row: i + 1,
        message: `Ongeldige datum formaat. Gebruik YYYY-MM-DD (bijv. 2024-01-15)`
      });
      continue;
    }

    data.push({
      title: row.title,
      category: row.category,
      location: row.location,
      date: row.date,
      description: row.description || '',
      before_image: row.before_image || '',
      after_image: row.after_image || '',
      featured: row.featured || 'false'
    });
  }

  return { data, errors };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePortfolioRow(
  row: CSVPortfolioRow,
  existingCategories: string[]
): ValidationResult {
  const errors: string[] = [];

  if (!row.title || row.title.length < 3) {
    errors.push('Titel moet minimaal 3 karakters bevatten');
  }

  if (!row.category) {
    errors.push('Categorie is verplicht');
  }

  if (!row.location || row.location.length < 2) {
    errors.push('Locatie moet minimaal 2 karakters bevatten');
  }

  if (row.before_image && !isValidUrl(row.before_image)) {
    errors.push('Voor-foto URL is ongeldig');
  }

  if (row.after_image && !isValidUrl(row.after_image)) {
    errors.push('Na-foto URL is ongeldig');
  }

  if (row.featured && !['true', 'false', ''].includes(row.featured.toLowerCase())) {
    errors.push('Featured moet "true" of "false" zijn');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function isValidUrl(urlString: string): boolean {
  if (!urlString) return true;

  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
