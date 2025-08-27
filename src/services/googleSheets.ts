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
  private accessToken: string | null = null;
  private tokenClient: any = null;

  async initialize(config?: GoogleSheetsConfig) {
    // Use environment variables if no config provided
    this.config = config || {
      spreadsheetId: import.meta.env.VITE_GOOGLE_SPREADSHEET_ID,
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      range: import.meta.env.VITE_GOOGLE_SHEET_RANGE || 'Sheet1!A:M'
    };
    await this.loadGoogleAPIs();
  }

  async autoInitialize() {
    if (!this.config) {
      await this.initialize();
    }
    if (!this.isAuthenticated) {
      await this.authenticate();
    }
  }

  private async loadGoogleAPIs(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Load Google API Client Library for JavaScript
      const loadGapiScript = () => {
        return new Promise<void>((resolve, reject) => {
          if (window.gapi && window.gapi.client) {
            console.log('Google API client already loaded');
            resolve();
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = () => {
            window.gapi.load('client', async () => {
              try {
                await window.gapi.client.init({
                  apiKey: this.config?.apiKey,
                  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                });
                console.log('Google API client initialized');
                resolve();
              } catch (error) {
                console.error('Failed to initialize Google API client:', error);
                reject(error);
              }
            });
          };
          script.onerror = () => reject(new Error('Failed to load Google API script'));
          document.head.appendChild(script);
        });
      };

      // Load Google Identity Services (GIS) for authentication
      const loadGisScript = () => {
        return new Promise<void>((resolve, reject) => {
          if (window.google && window.google.accounts) {
            console.log('Google Identity Services already loaded');
            resolve();
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.onload = () => {
            console.log('Google Identity Services loaded');
            resolve();
          };
          script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
          document.head.appendChild(script);
        });
      };

      // Load both scripts
      Promise.all([loadGapiScript(), loadGisScript()])
        .then(() => {
          console.log('All Google APIs loaded successfully');
          resolve();
        })
        .catch(reject);
    });
  }

  async authenticate(): Promise<boolean> {
    try {
      if (!window.google || !window.google.accounts) {
        throw new Error('Google Identity Services not loaded. Please check your internet connection.');
      }

      return new Promise((resolve, reject) => {
        // Initialize the token client for OAuth 2.0 access token flow
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: this.config?.clientId,
          scope: 'https://www.googleapis.com/auth/spreadsheets',
          callback: (response: any) => {
            if (response.error) {
              console.error('Token request error:', response);
              reject(new Error(`Authentication failed: ${response.error_description || response.error}`));
              return;
            }
            
            console.log('Successfully obtained access token');
            this.accessToken = response.access_token;
            
            // Set the access token for the Google API client
            window.gapi.client.setToken({
              access_token: response.access_token
            });
            
            this.isAuthenticated = true;
            resolve(true);
          },
          error_callback: (error: any) => {
            console.error('Token client error:', error);
            reject(new Error(`Authentication error: ${error.type || 'Unknown error'}`));
          }
        });

        // Request access token
        console.log('Requesting access token...');
        this.tokenClient.requestAccessToken({
          prompt: 'consent'
        });
      });
      
    } catch (error) {
      console.error('Authentication failed:', error);
      
      // Enhanced error handling
      let errorMessage = 'Authentication failed: ';
      
      if (error instanceof Error) {
        errorMessage += error.message;
      } else if (typeof error === 'object' && error !== null) {
        if ('error' in error) {
          errorMessage += String(error.error);
        } else if ('message' in error) {
          errorMessage += String(error.message);
        } else {
          errorMessage += JSON.stringify(error);
        }
      } else {
        errorMessage += String(error);
      }
      
      // Check for specific issues
      if (errorMessage.includes('popup_blocked')) {
        throw new Error('Popup was blocked by browser. Please allow popups for this site and try again.');
      } else if (errorMessage.includes('access_denied')) {
        throw new Error('Access denied. Please grant permission to access Google Sheets.');
      } else if (errorMessage.includes('client_id')) {
        throw new Error('Invalid Client ID. Please check your Google OAuth configuration.');
      }
      
      throw new Error(errorMessage);
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

  async seedData(seedLeads: Partial<LeadData>[]): Promise<boolean> {
    if (!this.isAuthenticated || !this.config) {
      throw new Error('Not authenticated or configured');
    }

    try {
      // First ensure headers exist
      await this.createSpreadsheetHeaders();

      // Convert lead data to rows
      const rows = seedLeads.map(lead => [
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
      ]);

      // Clear existing data (except headers)
      await window.gapi.client.sheets.spreadsheets.values.clear({
        spreadsheetId: this.config.spreadsheetId,
        range: 'Sheet1!A2:M'
      });

      // Add all seed data
      if (rows.length > 0) {
        await window.gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: this.config.spreadsheetId,
          range: `Sheet1!A2:M${rows.length + 1}`,
          valueInputOption: 'RAW',
          resource: { values: rows }
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to seed data:', error);
      throw error;
    }
  }

  async deleteLead(rowIndex: number): Promise<boolean> {
    if (!this.isAuthenticated || !this.config) {
      throw new Error('Not authenticated or configured');
    }

    try {
      // Google Sheets API doesn't have a direct delete row method
      // We need to use batchUpdate to delete the row
      const deleteRequest = {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: 0, // First sheet
              dimension: 'ROWS',
              startIndex: rowIndex + 1, // +1 because header is row 0, data starts at row 1
              endIndex: rowIndex + 2 // endIndex is exclusive
            }
          }
        }]
      };

      await window.gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.config.spreadsheetId,
        resource: deleteRequest
      });

      console.log(`Lead at row ${rowIndex + 2} deleted successfully`);
      return true;
    } catch (error) {
      console.error('Failed to delete lead:', error);
      throw error;
    }
  }

  async updateLeadStage(rowIndex: number, newStage: string): Promise<boolean> {
    if (!this.isAuthenticated || !this.config) {
      throw new Error('Not authenticated or configured');
    }

    try {
      // Update only the stage column (column E, index 4)
      const values = [[newStage]];

      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: this.config.spreadsheetId,
        range: `Sheet1!E${rowIndex + 2}:E${rowIndex + 2}`, // +2 because of 1-indexing and header
        valueInputOption: 'RAW',
        resource: { values }
      });

      console.log(`Lead stage updated to: ${newStage}`);
      return true;
    } catch (error) {
      console.error('Failed to update lead stage:', error);
      throw error;
    }
  }

  async updateLeadField(rowIndex: number, field: keyof LeadData, value: any): Promise<boolean> {
    if (!this.isAuthenticated || !this.config) {
      throw new Error('Not authenticated or configured');
    }

    try {
      // Map field names to column letters
      const fieldMapping: { [K in keyof LeadData]: string } = {
        name: 'A',
        company: 'B', 
        email: 'C',
        phone: 'D',
        stage: 'E',
        leadStatus: 'F',
        projectStage: 'G',
        source: 'H',
        value: 'I',
        assignedTo: 'J',
        notes: 'K',
        lastContact: 'L',
        contactType: 'M'
      };

      const column = fieldMapping[field];
      if (!column) {
        throw new Error(`Unknown field: ${field}`);
      }

      const values = [[value]];
      const range = `Sheet1!${column}${rowIndex + 2}:${column}${rowIndex + 2}`;

      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: this.config.spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: { values }
      });

      console.log(`Lead ${field} updated to: ${value}`);
      return true;
    } catch (error) {
      console.error(`Failed to update lead ${field}:`, error);
      throw error;
    }
  }

  // Utility method to refresh token if needed
  async refreshTokenIfNeeded(): Promise<void> {
    if (this.tokenClient && !this.isAuthenticated) {
      await this.authenticate();
    }
  }

  // Method to revoke access
  revokeAccess(): void {
    if (this.accessToken) {
      window.google.accounts.oauth2.revoke(this.accessToken, () => {
        console.log('Access revoked');
        this.accessToken = null;
        this.isAuthenticated = false;
      });
    }
  }
}

// Global instance
export const googleSheetsService = new GoogleSheetsService();

// Type declarations for Google APIs
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export type { LeadData, GoogleSheetsConfig };