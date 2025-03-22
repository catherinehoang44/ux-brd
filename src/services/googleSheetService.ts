
interface RequirementDropdown {
  display: boolean;
  documentVersion: string;
  title: string;
  key: string;
  subtitle: string;
  status: string;
  reviewBy: string;
  note: string;
}

interface RequirementContent {
  key: string;
  topic: string;
  bulletPoint: string;
}

interface SignOffStakeholder {
  key: string;
  stakeholder: string;
}

interface QuickLink {
  key: string;
  linkText: string;
  link: string;
}

interface EmailUpdate {
  email: string;
  type: string;
}

interface DocumentApproval {
  type: string;
  documentVersion: string;
  timestamp: string;
}

interface SheetData {
  requirementDropdowns: RequirementDropdown[];
  requirementContents: RequirementContent[];
  signOffStakeholders: SignOffStakeholder[];
  quickLinks: QuickLink[];
  documentVersions: string[];
  lastUpdated: string;
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
    const documentVersions = new Set<string>();
    let lastUpdated = new Date().toLocaleDateString();
    
    // Process data
    if (parsedCSV.length > 1) {
      // Process Requirements Dropdown data
      for (let i = 1; i < parsedCSV.length; i++) {
        const row = parsedCSV[i];
        if (row.length < 5 || !row[0]) break;
        
        // Check if this is a requirements row (we're checking the Display? column)
        if (row[0].toLowerCase() === "true" || row[0].toLowerCase() === "false") {
          // Add to document versions set
          if (row[1]) {
            documentVersions.add(row[1]);
          }
          
          requirementDropdowns.push({
            display: row[0].toLowerCase() === "true",
            documentVersion: row[1] || "",
            title: row[2] || "",
            key: row[3] || "",
            subtitle: row[4] || "",
            status: row[5] || "",
            reviewBy: row[6] || "",
            note: row[7] || ""
          });
        }
        // Check if this is a requirement content row
        else if (row[0] && row[0].startsWith("content")) {
          requirementContents.push({
            key: row[1] || "",
            topic: row[2] || "",
            bulletPoint: row[3] || ""
          });
        }
        // Check if this is a stakeholder row
        else if (row[0] && row[0].startsWith("stakeholder")) {
          signOffStakeholders.push({
            key: row[1] || "",
            stakeholder: row[2] || ""
          });
        }
        // Check if this is a quick link row
        else if (row[0] && row[0].startsWith("link")) {
          quickLinks.push({
            key: row[1] || "",
            linkText: row[2] || "",
            link: row[3] || ""
          });
        }
        
        // Update last updated date if Review By is more recent
        if (row[6]) {
          try {
            const rowDate = new Date(row[6]);
            if (!isNaN(rowDate.getTime())) {
              const currentLastUpdated = new Date(lastUpdated);
              if (rowDate > currentLastUpdated) {
                lastUpdated = rowDate.toLocaleDateString();
              }
            }
          } catch (e) {
            // Skip invalid dates
          }
        }
      }
    }
    
    console.log("Parsed requirements:", requirementDropdowns);
    console.log("Parsed contents:", requirementContents);
    console.log("Parsed stakeholders:", signOffStakeholders);
    console.log("Parsed quick links:", quickLinks);
    console.log("Available document versions:", Array.from(documentVersions));
    
    return {
      requirementDropdowns,
      requirementContents,
      signOffStakeholders,
      quickLinks,
      documentVersions: Array.from(documentVersions),
      lastUpdated
    };
  } catch (error) {
    console.error("Error processing Google Sheets data:", error);
    throw error;
  }
}

// New functions for writing to Google Sheets (via proxy)
export async function addEmailUpdate(email: string, type: string = "Document Updates"): Promise<boolean> {
  try {
    console.log(`Email subscription added: ${email} for ${type}`);
    // In a real implementation, this would send the data to a server endpoint that updates Google Sheets
    // For now, just log and return success
    return true;
  } catch (error) {
    console.error("Error adding email update:", error);
    return false;
  }
}

export async function recordDocumentApproval(type: string, documentVersion: string): Promise<boolean> {
  try {
    const timestamp = new Date().toISOString();
    console.log(`Document approval recorded: ${type} for ${documentVersion} at ${timestamp}`);
    // In a real implementation, this would send the data to a server endpoint that updates Google Sheets
    // For now, just log and return success
    return true;
  } catch (error) {
    console.error("Error recording document approval:", error);
    return false;
  }
}
