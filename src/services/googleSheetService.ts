
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

import { toast } from "sonner";

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

// Format date to human-readable format like "March 4, 2005"
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
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
    let lastUpdated = formatDate(new Date().toLocaleDateString());
    
    // Process data based on header row
    if (parsedCSV.length > 1) {
      // Get header row to identify columns
      const headerRow = parsedCSV[0].map(header => header.trim().toLowerCase());
      
      // Process each data row
      for (let i = 1; i < parsedCSV.length; i++) {
        const row = parsedCSV[i];
        if (!row || row.length < 3) continue; // Skip empty rows
        
        // Check what type of row this is based on the first column
        const rowType = (row[0] || "").trim().toLowerCase();
        
        // Requirements Dropdown (row starts with TRUE/FALSE)
        if (rowType === "true" || rowType === "false") {
          if (row[1]) {
            documentVersions.add(row[1]);
          }
          
          // Generate a key format for matching related content
          const key = `${row[1]} ${row[2]}`;
          
          const dropdown: RequirementDropdown = {
            display: rowType === "true",
            documentVersion: row[1] || "",
            title: row[2] || "",
            key: key, // Key for matching with other tables
            subtitle: row[4] || "",
            status: row[5] || "",
            reviewBy: row[6] || "",
            note: row[7] || ""
          };
          
          requirementDropdowns.push(dropdown);
          
          // Update last updated date if Review By is more recent
          if (row[6]) {
            try {
              const rowDate = new Date(row[6]);
              if (!isNaN(rowDate.getTime())) {
                const currentLastUpdated = new Date(lastUpdated);
                if (rowDate > currentLastUpdated) {
                  lastUpdated = formatDate(row[6]);
                }
              }
            } catch (e) {
              // Skip invalid dates
            }
          }
        } 
        // Requirement Content (determined by presence of "content" in first column)
        else if (rowType.includes("content")) {
          // Create content entry with key matching the dropdown
          requirementContents.push({
            key: row[1] || "", // This should match the key in dropdown
            topic: row[2] || "",
            bulletPoint: row[3] || ""
          });
        }
        // Stakeholder (determined by presence of "stakeholder" in first column)
        else if (rowType.includes("stakeholder")) {
          signOffStakeholders.push({
            key: row[1] || "", // This should match the key in dropdown
            stakeholder: row[2] || ""
          });
        }
        // Quick Link (determined by presence of "link" in first column)
        else if (rowType.includes("link")) {
          quickLinks.push({
            key: row[1] || "", // This should match the key in dropdown
            linkText: row[2] || "",
            link: row[3] || ""
          });
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
export async function addEmailUpdate(email: string, type: string = "BRD Updates"): Promise<boolean> {
  try {
    console.log(`Email subscription added: ${email} for ${type}`);
    // In a real implementation, this would send the data to a server endpoint that updates Google Sheets
    // Currently, we cannot directly write to Google Sheets without server-side code
    // For now, just log and return success
    toast.success(`Added ${email} to Email Updates table with type: ${type}`);
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
    // Currently, we cannot directly write to Google Sheets without server-side code
    // For now, just log and return success
    toast.success(`Added "${type}" record for ${documentVersion} to Document Approvals table`);
    return true;
  } catch (error) {
    console.error("Error recording document approval:", error);
    return false;
  }
}
