
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

interface EmailUpdate {
  email: string;
  type: string;
}

interface DocumentApproval {
  type: string;
  documentVersion: string;
}

interface SheetData {
  requirementDropdowns: RequirementDropdown[];
  requirementContents: RequirementContent[];
  signOffStakeholders: SignOffStakeholder[];
  quickLinks: QuickLink[];
  emailUpdates: EmailUpdate[];
  documentApprovals: DocumentApproval[];
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
    const emailUpdates: EmailUpdate[] = [];
    const documentApprovals: DocumentApproval[] = [];
    
    // Extract headers row
    const headers = parsedCSV[0];
    
    // Process data from CSV
    // First row is headers, so start from the second row
    for (let i = 1; i < parsedCSV.length; i++) {
      const row = parsedCSV[i];
      
      // Skip empty rows
      if (row.length < 2 || !row[0] || !row[1]) continue;
      
      // Check which table we're in based on headers
      if (headers[0] === 'Display?' && headers[1] === 'Requirement Title') {
        requirementDropdowns.push({
          display: row[0].toLowerCase() === "true",
          title: row[1],
          subtitle: row[2] || "",
          status: row[3] || "",
          reviewBy: row[4] || "",
          note: row[5] || ""
        });
      } else if (headers[0] === 'Requirement Title' && headers[1] === 'Requirement Topic') {
        requirementContents.push({
          title: row[0],
          topic: row[1] || "",
          bulletPoint: row[2] || ""
        });
      } else if (headers[0] === 'Requirement Title' && headers[1] === 'Sign-Off Stakeholder') {
        signOffStakeholders.push({
          title: row[0],
          stakeholder: row[1] || ""
        });
      } else if (headers[0] === 'Requirement Title' && headers[1] === 'Link Text') {
        quickLinks.push({
          title: row[0],
          linkText: row[1] || "",
          link: row[2] || ""
        });
      } else if (headers[0] === 'Email' && headers[1] === 'Type') {
        emailUpdates.push({
          email: row[0],
          type: row[1] || "Document Updates"
        });
      } else if (headers[0] === 'Type' && headers[1] === 'Document Version') {
        documentApprovals.push({
          type: row[0],
          documentVersion: row[1] || "FY25 Q2"
        });
      }
    }
    
    // Generate last updated date
    const lastUpdated = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return {
      requirementDropdowns,
      requirementContents,
      signOffStakeholders,
      quickLinks,
      emailUpdates,
      documentApprovals,
      lastUpdated
    };
  } catch (error) {
    console.error("Error processing Google Sheets data:", error);
    throw error;
  }
}

// Function to add email to Google Sheets
export async function addEmailUpdate(email: string): Promise<void> {
  try {
    // In a real app, you would use Google Sheets API to update the sheet
    // For now, we'll just log the email that would be added
    console.log(`Adding email to Google Sheets: ${email}, Type: Document Updates`);
    
    // URL to a web service that would handle the update (you would need to set this up)
    // const updateEndpoint = "https://example.com/api/update-sheet";
    // await fetch(updateEndpoint, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, type: 'Document Updates' })
    // });
  } catch (error) {
    console.error("Error adding email to Google Sheets:", error);
    throw error;
  }
}

// Function to track document approvals
export async function trackDocumentApproval(isApproved: boolean, version: string): Promise<void> {
  try {
    // In a real app, you would use Google Sheets API to update the sheet
    const actionType = isApproved ? "Approval Given" : "Approval Removed";
    console.log(`Tracking document approval: ${actionType}, Version: ${version}`);
    
    // URL to a web service that would handle the update (you would need to set this up)
    // const updateEndpoint = "https://example.com/api/track-approval";
    // await fetch(updateEndpoint, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ type: actionType, documentVersion: version })
    // });
  } catch (error) {
    console.error("Error tracking document approval:", error);
    throw error;
  }
}
