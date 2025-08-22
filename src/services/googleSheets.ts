interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey: string;
  clientId: string;
  range: string;
}

interface LeadData {
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: string;
  leadStatus: string;
  projectStage: string;
  source: string;
  value: number;
  assignedTo: string;
  notes: string;
  lastContact: string;
  contactType: string;
}

class GoogleSheetsService {
  private config: GoogleSheetsConfig | null = null;
  private isAuthenticated = false;

  async initialize(config: GoogleSheetsConfig) {
    this.config = config;
    await this.loadGoogleSheetsAPI();
  }

  private async loadGoogleSheetsAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: this.config?.apiKey,
              clientId: this.config?.clientId,
              discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
              scope: 'https://www.googleapis.com/auth/spreadsheets'
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async authenticate(): Promise<boolean> {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }
      this.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  async getLeads(): Promise<LeadData[]> {
    if (!this.isAuthenticated || !this.config) {
      throw new Error('Not authenticated or configured');
    }

    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheetId,
        range: this.config.range || 'Sheet1!A:M',
      });

      const rows = response.result.values || [];
      if (rows.length === 0) return [];

      // Skip header row
      const dataRows = rows.slice(1);
      
      return dataRows.map((row: string[]) => ({
        name: row[0] || '',
        company: row[1] || '',
        email: row[2] || '',
        phone: row[3] || '',
        stage: row[4] || 'new',
        leadStatus: row[5] || 'cold',
        projectStage: row[6] || 'Outreach',
        source: row[7] || '',
        value: parseFloat(row[8]) || 0,
        assignedTo: row[9] || '',
        notes: row[10] || '',
        lastContact: row[11] || new Date().toISOString().split('T')[0],
        contactType: row[12] || 'CEO'
      }));
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      throw error;
    }
  }

  async addLead(lead: Partial<LeadData>): Promise<boolean> {
    if (!this.isAuthenticated || !this.config) {
      throw new Error('Not authenticated or configured');
    }

    try {
      const values = [[
        lead.name || '',
        lead.company || '',
        lead.email || '',
        lead.phone || '',
        lead.stage || 'new',
        lead.leadStatus || 'cold',
        lead.projectStage || 'Outreach',
        lead.source || '',
        lead.value || 0,
        lead.assignedTo || '',
        lead.notes || '',
        lead.lastContact || new Date().toISOString().split('T')[0],
        lead.contactType || 'CEO'
      ]];

      await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: this.config.spreadsheetId,
        range: this.config.range || 'Sheet1!A:M',
        valueInputOption: 'RAW',
        resource: { values }
      });

      return true;
    } catch (error) {
      console.error('Failed to add lead:', error);
      throw error;
    }
  }

  async updateLead(rowIndex: number, lead: Partial<LeadData>): Promise<boolean> {
    if (!this.isAuthenticated || !this.config) {
      throw new Error('Not authenticated or configured');
    }

    try {
      const values = [[
        lead.name || '',
        lead.company || '',
        lead.email || '',
        lead.phone || '',
        lead.stage || 'new',
        lead.leadStatus || 'cold',
        lead.projectStage || 'Outreach',
        lead.source || '',
        lead.value || 0,
        lead.assignedTo || '',
        lead.notes || '',
        lead.lastContact || new Date().toISOString().split('T')[0],
        lead.contactType || 'CEO'
      ]];

      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: this.config.spreadsheetId,
        range: `Sheet1!A${rowIndex + 2}:M${rowIndex + 2}`, // +2 because of 1-indexing and header
        valueInputOption: 'RAW',
        resource: { values }
      });

      return true;
    } catch (error) {
      console.error('Failed to update lead:', error);
      throw error;
    }
  }

  async createSpreadsheetHeaders(): Promise<boolean> {
    if (!this.isAuthenticated || !this.config) {
      throw new Error('Not authenticated or configured');
    }

    try {
      const headers = [[
        'Name', 'Company', 'Email', 'Phone', 'Stage', 'Lead Status', 
        'Project Stage', 'Source', 'Value', 'Assigned To', 'Notes', 
        'Last Contact', 'Contact Type'
      ]];

      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: this.config.spreadsheetId,
        range: 'Sheet1!A1:M1',
        valueInputOption: 'RAW',
        resource: { values: headers }
      });

      return true;
    } catch (error) {
      console.error('Failed to create headers:', error);
      throw error;
    }
  }
}

// Global instance
export const googleSheetsService = new GoogleSheetsService();

// Type declarations for Google APIs
declare global {
  interface Window {
    gapi: any;
  }
}

export type { LeadData, GoogleSheetsConfig };