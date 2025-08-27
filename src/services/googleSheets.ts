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
      // Determine priority level based on lead status and value
      const priority = this.calculatePriority(lead.leadStatus, lead.value || 0);
      
      // Determine next action based on stage
      const nextAction = this.determineNextAction(lead.stage || 'new', lead.projectStage || 'Outreach');

      // Enhanced data structure for better boss readability
      const values = [[
        lead.name || '',
        lead.company || '',
        lead.email || '',
        lead.phone || '',
        this.formatStage(lead.stage || 'new'),
        this.formatLeadStatus(lead.leadStatus || 'cold'),
        lead.projectStage || 'Outreach',
        lead.source || 'Unknown',
        this.formatCurrency(lead.value || 0),
        lead.assignedTo || 'Unassigned',
        this.formatDate(lead.lastContact || new Date().toISOString().split('T')[0]),
        lead.contactType || 'Lead',
        priority,
        lead.notes || '',
        nextAction
      ]];

      await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: this.config.spreadsheetId,
        range: this.config.range || 'Sheet1!A:O',
        valueInputOption: 'RAW',
        resource: { values }
      });

      return true;
    } catch (error) {
      console.error('Failed to add lead:', error);
      throw error;
    }
  }

  // Helper methods for better data formatting
  private calculatePriority(leadStatus?: string, value?: number): string {
    if (leadStatus === 'hot' || (value && value > 50000)) return '🔴 HIGH';
    if (leadStatus === 'warm' || (value && value > 10000)) return '🟡 MEDIUM';
    return '🟢 LOW';
  }

  private determineNextAction(stage?: string, projectStage?: string): string {
    if (stage === 'new') return '📧 Send Initial Email';
    if (stage === 'contacted') return '📞 Schedule Follow-up Call';
    if (stage === 'qualified') return '📋 Send Proposal';
    if (stage === 'proposal') return '💼 Schedule Meeting';
    if (stage === 'negotiation') return '✍️ Finalize Contract';
    if (projectStage === 'Calls') return '📞 Follow-up Call Needed';
    return '👀 Review Status';
  }

  private formatStage(stage: string): string {
    const stageMap: { [key: string]: string } = {
      'new': '🆕 New Lead',
      'contacted': '📞 Contacted',
      'qualified': '✅ Qualified',
      'proposal': '📋 Proposal Sent',
      'negotiation': '💼 In Negotiation',
      'closed-won': '🎉 Closed Won',
      'closed-lost': '❌ Closed Lost'
    };
    return stageMap[stage] || stage;
  }

  private formatLeadStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'hot': '🔥 Hot',
      'warm': '🟡 Warm',
      'cold': '🧊 Cold'
    };
    return statusMap[status] || status;
  }

  private formatCurrency(value: number): string {
    return value > 0 ? `$${value.toLocaleString()}` : '$0';
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  async updateLead(rowIndex: number, lead: Partial<LeadData>): Promise<boolean> {
    if (!this.isAuthenticated || !this.config) {
      throw new Error('Not authenticated or configured');
    }

    try {
      // Use the same formatting as addLead for consistency
      const priority = this.calculatePriority(lead.leadStatus, lead.value || 0);
      const nextAction = this.determineNextAction(lead.stage || 'new', lead.projectStage || 'Outreach');

      const values = [[
        lead.name || '',
        lead.company || '',
        lead.email || '',
        lead.phone || '',
        this.formatStage(lead.stage || 'new'),
        this.formatLeadStatus(lead.leadStatus || 'cold'),
        lead.projectStage || 'Outreach',
        lead.source || 'Unknown',
        this.formatCurrency(lead.value || 0),
        lead.assignedTo || 'Unassigned',
        this.formatDate(lead.lastContact || new Date().toISOString().split('T')[0]),
        lead.contactType || 'Lead',
        priority,
        lead.notes || '',
        nextAction
      ]];

      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: this.config.spreadsheetId,
        range: `Sheet1!A${rowIndex + 2}:O${rowIndex + 2}`, // +2 because of 1-indexing and header
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
      // Enhanced headers for better boss readability
      const headers = [[
        '📝 Full Name', 
        '🏢 Company', 
        '📧 Email', 
        '📞 Phone', 
        '🎯 Current Stage', 
        '🌡️ Lead Temperature', 
        '📊 Project Status', 
        '📍 Lead Source', 
        '💰 Potential Value ($)', 
        '👤 Assigned Sales Rep', 
        '📅 Last Contact Date',
        '🔖 Contact Type',
        '💼 Priority Level',
        '📝 Notes & Comments',
        '📈 Next Action Required'
      ]];

      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: this.config.spreadsheetId,
        range: 'Sheet1!A1:O1',
        valueInputOption: 'RAW',
        resource: { values: headers }
      });

      // Add formatting to make it more boss-friendly
      await this.formatHeadersForBoss();

      // Create the executive summary sheet for the boss
      await this.createBossSummarySheet();

      return true;
    } catch (error) {
      console.error('Failed to create headers:', error);
      throw error;
    }
  }

  // New method to format the spreadsheet for better boss readability
  async formatHeadersForBoss(): Promise<void> {
    try {
      const requests = [
        // Make header row bold and colored
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 0.2,
                  green: 0.6,
                  blue: 0.9
                },
                textFormat: {
                  foregroundColor: {
                    red: 1,
                    green: 1,
                    blue: 1
                  },
                  fontSize: 12,
                  bold: true
                },
                horizontalAlignment: 'CENTER'
              }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
          }
        },
        // Auto-resize columns
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: 0,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: 15
            }
          }
        },
        // Freeze header row
        {
          updateSheetProperties: {
            properties: {
              sheetId: 0,
              gridProperties: {
                frozenRowCount: 1
              }
            },
            fields: 'gridProperties.frozenRowCount'
          }
        }
      ];

      await window.gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.config.spreadsheetId,
        resource: { requests }
      });
    } catch (error) {
      console.error('Failed to format headers:', error);
      // Don't throw error - formatting is optional
    }
  }

  // Create a boss-friendly summary sheet with key metrics
  async createBossSummarySheet(): Promise<void> {
    try {
      // Create a new sheet for the summary
      const addSheetRequest = {
        requests: [{
          addSheet: {
            properties: {
              title: '📊 EXECUTIVE SUMMARY',
              gridProperties: {
                rowCount: 50,
                columnCount: 10
              }
            }
          }
        }]
      };

      await window.gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.config.spreadsheetId,
        resource: addSheetRequest
      });

      // Add summary data
      const summaryData = [
        ['🏆 ZUVOMO CRM - EXECUTIVE DASHBOARD', '', '', '', '', '', '', '', ''],
        [''],
        ['📈 KEY PERFORMANCE INDICATORS', '', '', '', '', '', '', '', ''],
        [''],
        ['Metric', 'Value', 'Status', '', 'Target', 'Achievement', '', '', ''],
        ['Total Leads', '=COUNTA(Sheet1!A:A)-1', '✅ Active', '', '100', '=B6/E6', '', '', ''],
        ['Hot Leads', '=COUNTIF(Sheet1!F:F,"🔥 Hot")', '🔥 Priority', '', '20', '=B7/E7', '', '', ''],
        ['Warm Leads', '=COUNTIF(Sheet1!F:F,"🟡 Warm")', '🟡 Follow-up', '', '40', '=B8/E8', '', '', ''],
        ['Cold Leads', '=COUNTIF(Sheet1!F:F,"🧊 Cold")', '🧊 Nurture', '', '40', '=B9/E9', '', '', ''],
        [''],
        ['💰 REVENUE PIPELINE', '', '', '', '', '', '', '', ''],
        [''],
        ['Total Pipeline Value', '=SUMVALUE(Sheet1!I:I)', '💵 Current', '', '$500,000', '=B13/E13', '', '', ''],
        ['High Priority Deals', '=SUMIF(Sheet1!M:M,"🔴 HIGH",Sheet1!I:I)', '🎯 Focus', '', '$200,000', '=B14/E14', '', '', ''],
        ['Closed Won', '=SUMIF(Sheet1!E:E,"🎉 Closed Won",Sheet1!I:I)', '✅ Success', '', '$100,000', '=B15/E15', '', '', ''],
        [''],
        ['👥 TEAM PERFORMANCE', '', '', '', '', '', '', '', ''],
        [''],
        ['Assigned Leads', '=COUNTA(Sheet1!J:J)-COUNTIF(Sheet1!J:J,"Unassigned")', '👤 Active', '', '', '', '', '', ''],
        ['Unassigned Leads', '=COUNTIF(Sheet1!J:J,"Unassigned")', '⚠️ Needs Assignment', '', '', '', '', '', ''],
        [''],
        ['🎯 NEXT ACTIONS REQUIRED', '', '', '', '', '', '', '', ''],
        [''],
        ['Follow-up Calls', '=COUNTIF(Sheet1!O:O,"📞*")', '📞 Priority', '', '', '', '', '', ''],
        ['Send Proposals', '=COUNTIF(Sheet1!O:O,"📋*")', '📋 Action', '', '', '', '', '', ''],
        ['Schedule Meetings', '=COUNTIF(Sheet1!O:O,"💼*")', '💼 Important', '', '', '', '', '', ''],
        [''],
        ['📊 LEAD SOURCES', '', '', '', '', '', '', '', ''],
        [''],
        ['Website', '=COUNTIF(Sheet1!H:H,"website")', '', '', '', '', '', '', ''],
        ['LinkedIn', '=COUNTIF(Sheet1!H:H,"linkedin")', '', '', '', '', '', '', ''],
        ['Referral', '=COUNTIF(Sheet1!H:H,"referral")', '', '', '', '', '', '', ''],
        ['Cold Email', '=COUNTIF(Sheet1!H:H,"cold-email")', '', '', '', '', '', '', ''],
        [''],
        ['📅 Last Updated: ' + new Date().toLocaleDateString(), '', '', '', '', '', '', '', '']
      ];

      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: this.config.spreadsheetId,
        range: '📊 EXECUTIVE SUMMARY!A1:I32',
        valueInputOption: 'USER_ENTERED', // Use USER_ENTERED to process formulas
        resource: { values: summaryData }
      });

      // Format the summary sheet
      await this.formatSummarySheet();

    } catch (error) {
      console.error('Failed to create boss summary sheet:', error);
      // Don't throw - this is optional
    }
  }

  async formatSummarySheet(): Promise<void> {
    try {
      const requests = [
        // Title formatting
        {
          repeatCell: {
            range: {
              sheetId: 1, // Summary sheet
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 9
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.1, green: 0.4, blue: 0.8 },
                textFormat: {
                  foregroundColor: { red: 1, green: 1, blue: 1 },
                  fontSize: 16,
                  bold: true
                },
                horizontalAlignment: 'CENTER'
              }
            },
            fields: 'userEnteredFormat'
          }
        },
        // Section headers
        {
          repeatCell: {
            range: {
              sheetId: 1,
              startRowIndex: 2,
              endRowIndex: 3
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                textFormat: { bold: true, fontSize: 12 }
              }
            },
            fields: 'userEnteredFormat'
          }
        }
      ];

      await window.gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.config.spreadsheetId,
        resource: { requests }
      });
    } catch (error) {
      console.error('Failed to format summary sheet:', error);
    }
  }

  // Method to upgrade existing spreadsheet to boss-friendly format
  async upgradeToBossFriendlyFormat(): Promise<boolean> {
    if (!this.isAuthenticated || !this.config) {
      throw new Error('Not authenticated or configured');
    }

    try {
      console.log('Upgrading spreadsheet to boss-friendly format...');
      
      // Step 1: Update headers
      await this.createSpreadsheetHeaders();
      
      // Step 2: Get existing data
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheetId,
        range: 'Sheet1!A2:M1000', // Get all data rows (old format)
      });

      const rows = response.result.values || [];
      
      // Step 3: Convert existing data to new format
      if (rows.length > 0) {
        const upgradedData = rows.map(row => [
          row[0] || '', // Name
          row[1] || '', // Company
          row[2] || '', // Email
          row[3] || '', // Phone
          this.formatStage(row[4] || 'new'), // Stage (formatted)
          this.formatLeadStatus(row[5] || 'cold'), // Lead Status (formatted)
          row[6] || 'Outreach', // Project Stage
          row[7] || 'Unknown', // Source
          this.formatCurrency(parseFloat(row[8]) || 0), // Value (formatted)
          row[9] || 'Unassigned', // Assigned To
          this.formatDate(row[11] || new Date().toISOString().split('T')[0]), // Last Contact (formatted)
          row[12] || 'Lead', // Contact Type
          this.calculatePriority(row[5], parseFloat(row[8]) || 0), // Priority (new)
          row[10] || '', // Notes
          this.determineNextAction(row[4], row[6]) // Next Action (new)
        ]);

        // Clear old data and insert upgraded data
        await window.gapi.client.sheets.spreadsheets.values.clear({
          spreadsheetId: this.config.spreadsheetId,
          range: 'Sheet1!A2:O1000'
        });

        await window.gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: this.config.spreadsheetId,
          range: 'Sheet1!A2:O' + (upgradedData.length + 1),
          valueInputOption: 'RAW',
          resource: { values: upgradedData }
        });
      }

      console.log('✅ Spreadsheet successfully upgraded to boss-friendly format!');
      return true;
    } catch (error) {
      console.error('Failed to upgrade spreadsheet format:', error);
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