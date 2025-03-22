
interface RequirementDropdown {
  display: boolean;
  title: string;
  subtitle: string;
  status: string;
  reviewBy: string;
  note: string;
}

interface RequirementContent {
  title: string;
  topic: string;
  bulletPoint: string;
}

interface SignOffStakeholder {
  title: string;
  stakeholder: string;
}

interface QuickLink {
  title: string;
  linkText: string;
  link: string;
}

interface SheetData {
  requirementDropdowns: RequirementDropdown[];
  requirementContents: RequirementContent[];
  signOffStakeholders: SignOffStakeholder[];
  quickLinks: QuickLink[];
}

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSEkwZQNs2I4eWnLlwXMp7oR7y9-CdxlMMn4t2HeqCUfA9JdQnoOMroFJM2OqzPtiLIWTjki1f4TyJB/pub?output=csv";

async function fetchCSV(): Promise<string> {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error fetching Google Sheets CSV:", error);
    throw error;
  }
}

function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n');
  return lines.map(line => {
    // Handle quoted fields properly (they might contain commas)
    const result = [];
    let currentField = "";
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(currentField);
        currentField = "";
      } else {
        currentField += char;
      }
    }
    
    result.push(currentField);
    return result;
  });
}

export async function getSheetData(): Promise<SheetData> {
  try {
    const csvText = await fetchCSV();
    const parsedCSV = parseCSV(csvText);
    
    // Initialize data structures
    const requirementDropdowns: RequirementDropdown[] = [];
    const requirementContents: RequirementContent[] = [];
    const signOffStakeholders: SignOffStakeholder[] = [];
    const quickLinks: QuickLink[] = [];
    
    // Process row by row directly without trying to identify sheet names
    // The first row contains headers, so we start from the second row
    if (parsedCSV.length > 1) {
      // Process Requirements Dropdown data (first section in the CSV)
      for (let i = 1; i < parsedCSV.length; i++) {
        const row = parsedCSV[i];
        if (row.length < 2 || !row[0] || !row[1]) break;
        
        requirementDropdowns.push({
          display: row[0].toLowerCase() === "true",
          title: row[1],
          subtitle: row[2] || "",
          status: row[3] || "",
          reviewBy: row[4] || "",
          note: row[5] || ""
        });
      }
    }
    
    console.log("Parsed requirements:", requirementDropdowns);
    
    return {
      requirementDropdowns,
      requirementContents,
      signOffStakeholders,
      quickLinks
    };
  } catch (error) {
    console.error("Error processing Google Sheets data:", error);
    throw error;
  }
}
