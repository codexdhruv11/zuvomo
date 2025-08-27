import { googleSheetsService } from '@/services/googleSheets';

// Extract hardcoded lead data for seeding
export const seedLeadData = [
  {
    name: "John Smith",
    company: "TechCorp Inc",
    email: "john.smith@techcorp.com",
    phone: "+1 (555) 123-4567",
    stage: "qualified",
    leadStatus: "warm",
    projectStage: "Proposal",
    source: "website",
    value: 75000,
    assignedTo: "Alice Johnson",
    notes: "Interested in enterprise package",
    lastContact: "2024-01-15",
    contactType: "CEO"
  },
  {
    name: "Sarah Davis",
    company: "Innovate Solutions",
    email: "sarah.davis@innovate.com",
    phone: "+1 (555) 987-6543",
    stage: "proposal",
    leadStatus: "hot",
    projectStage: "Calls",
    source: "referral",
    value: 120000,
    assignedTo: "Bob Wilson",
    notes: "Ready to sign, waiting for approval",
    lastContact: "2024-01-14",
    contactType: "VC"
  },
  {
    name: "Mike Chen",
    company: "Digital Dynamics",
    email: "mike.chen@digital.com",
    phone: "+1 (555) 456-7890",
    stage: "contacted",
    leadStatus: "cold",
    projectStage: "Outreach",
    source: "linkedin",
    value: 45000,
    assignedTo: "Alice Johnson",
    notes: "Initial interest shown",
    lastContact: "2024-01-13",
    contactType: "CEO"
  },
  {
    name: "Lisa Rodriguez",
    company: "Future Systems",
    email: "lisa.r@futuresys.com",
    phone: "+1 (555) 234-5678",
    stage: "negotiation",
    leadStatus: "hot",
    projectStage: "Calls",
    source: "cold-call",
    value: 95000,
    assignedTo: "Charlie Brown",
    notes: "Price negotiation in progress",
    lastContact: "2024-01-12",
    contactType: "VC"
  },
  {
    name: "David Wilson",
    company: "Smart Industries",
    email: "d.wilson@smart.com",
    phone: "+1 (555) 345-6789",
    stage: "closed-won",
    leadStatus: "hot",
    projectStage: "Closed",
    source: "website",
    value: 85000,
    assignedTo: "Bob Wilson",
    notes: "Deal closed successfully",
    lastContact: "2024-01-10",
    contactType: "CEO"
  },
  {
    name: "Emma Thompson",
    company: "Growth Capital",
    email: "emma.t@growthcap.com",
    phone: "+1 (555) 567-8901",
    stage: "qualified",
    leadStatus: "warm",
    projectStage: "Proposal",
    source: "referral",
    value: 150000,
    assignedTo: "Alice Johnson",
    notes: "Interested in full platform suite",
    lastContact: "2024-01-16",
    contactType: "VC"
  },
  {
    name: "Robert Kim",
    company: "NextGen Ventures",
    email: "r.kim@nextgen.com",
    phone: "+1 (555) 678-9012",
    stage: "contacted",
    leadStatus: "cold",
    projectStage: "Outreach",
    source: "linkedin",
    value: 200000,
    assignedTo: "Charlie Brown",
    notes: "Exploring options for portfolio companies",
    lastContact: "2024-01-11",
    contactType: "VC"
  },
  {
    name: "Jennifer Lee",
    company: "Innovation Labs",
    email: "j.lee@innovlabs.com",
    phone: "+1 (555) 789-0123",
    stage: "proposal",
    leadStatus: "warm",
    projectStage: "Proposal",
    source: "website",
    value: 95000,
    assignedTo: "Bob Wilson",
    notes: "Reviewing proposal with board",
    lastContact: "2024-01-09",
    contactType: "CEO"
  }
];

// Function to initialize and seed Google Sheets
export async function initializeGoogleSheetsWithData(): Promise<boolean> {
  try {
    console.log('Initializing Google Sheets service...');
    
    // Auto-initialize with environment variables
    await googleSheetsService.autoInitialize();
    
    console.log('Seeding data to Google Sheets...');
    
    // Seed the hardcoded data
    await googleSheetsService.seedData(seedLeadData);
    
    console.log('✅ Google Sheets initialized and seeded successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Google Sheets:', error);
    throw error;
  }
}

// Function to check if data already exists (to avoid duplicate seeding)
export async function checkIfDataExists(): Promise<boolean> {
  try {
    await googleSheetsService.autoInitialize();
    const leads = await googleSheetsService.getLeads();
    return leads.length > 0;
  } catch (error) {
    console.warn('Could not check existing data:', error);
    return false;
  }
}
