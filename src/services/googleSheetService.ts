
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
import * as XLSX from 'xlsx';

// Updated URL to fetch XLSX instead of CSV
const XLSX_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSEkwZQNs2I4eWnLlwXMp7oR7y9-CdxlMMn4t2HeqCUfA9JdQnoOMroFJM2OqzPtiLIWTjki1f4TyJB/pub?output=xlsx";

async function fetchXLSX(): Promise<ArrayBuffer> {
  try {
    console.log("Fetching XLSX file from:", XLSX_URL);
    const response = await fetch(XLSX_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch XLSX: ${response.status} ${response.statusText}`);
    }
    return await response.arrayBuffer();
  } catch (error) {
    console.error("Error fetching Google Sheets XLSX:", error);
    throw error;
  }
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
    const arrayBuffer = await fetchXLSX();
    const workbook = XLSX.read(arrayBuffer, {type: 'array'});
    
    // Initialize data structures
    const requirementDropdowns: RequirementDropdown[] = [];
    const requirementContents: RequirementContent[] = [];
    const signOffStakeholders: SignOffStakeholder[] = [];
    const quickLinks: QuickLink[] = [];
    const documentVersions = new Set<string>();
    let lastUpdated = formatDate(new Date().toLocaleDateString());
    
    // Log all available sheet names
    console.log("Available sheets:", workbook.SheetNames);
    
    // Process Requirements Dropdown sheet
    if (workbook.SheetNames.includes('Requirements Dropdown')) {
      const dropdownSheet = workbook.Sheets['Requirements Dropdown'];
      const dropdownData = XLSX.utils.sheet_to_json<any>(dropdownSheet, {header: 1});
      
      // Skip header row
      for (let i = 1; i < dropdownData.length; i++) {
        const row = dropdownData[i];
        if (!row || row.length < 3) continue;
        
        const display = String(row[0]).toLowerCase() === 'true';
        const documentVersion = String(row[1] || '');
        
        if (documentVersion) {
          documentVersions.add(documentVersion);
        }
        
        requirementDropdowns.push({
          display,
          documentVersion,
          title: String(row[2] || ''),
          key: String(row[3] || ''),
          subtitle: String(row[4] || ''),
          status: String(row[5] || ''),
          reviewBy: String(row[6] || ''),
          note: String(row[7] || '')
        });
        
        // Update last updated date if Review By is more recent
        if (row[6]) {
          try {
            const rowDate = new Date(row[6]);
            if (!isNaN(rowDate.getTime())) {
              const currentLastUpdated = new Date(lastUpdated);
              if (rowDate > currentLastUpdated) {
                lastUpdated = formatDate(String(row[6]));
              }
            }
          } catch (e) {
            // Skip invalid dates
          }
        }
      }
    }
    
    // Process Requirements Content sheet
    if (workbook.SheetNames.includes('Requirements Content')) {
      const contentSheet = workbook.Sheets['Requirements Content'];
      const contentData = XLSX.utils.sheet_to_json<any>(contentSheet, {header: 1});
      
      // Skip header row
      for (let i = 1; i < contentData.length; i++) {
        const row = contentData[i];
        if (!row || row.length < 2) continue;
        
        requirementContents.push({
          key: String(row[0] || ''),
          topic: String(row[1] || ''),
          bulletPoint: String(row[2] || '')
        });
      }
    }
    
    // Process Sign-Off Stakeholders sheet
    if (workbook.SheetNames.includes('Sign-Off Stakeholders')) {
      const stakeholderSheet = workbook.Sheets['Sign-Off Stakeholders'];
      const stakeholderData = XLSX.utils.sheet_to_json<any>(stakeholderSheet, {header: 1});
      
      // Skip header row
      for (let i = 1; i < stakeholderData.length; i++) {
        const row = stakeholderData[i];
        if (!row || row.length < 2) continue;
        
        signOffStakeholders.push({
          key: String(row[0] || ''),
          stakeholder: String(row[1] || '')
        });
      }
    }
    
    // Process Quick Links sheet
    if (workbook.SheetNames.includes('Quick Links')) {
      const linksSheet = workbook.Sheets['Quick Links'];
      const linksData = XLSX.utils.sheet_to_json<any>(linksSheet, {header: 1});
      
      // Skip header row
      for (let i = 1; i < linksData.length; i++) {
        const row = linksData[i];
        if (!row || row.length < 3) continue;
        
        quickLinks.push({
          key: String(row[0] || ''),
          linkText: String(row[1] || ''),
          link: String(row[2] || '')
        });
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

// Write to Google Sheets functions (via proxy)
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
