// Initial mock user data
export const initialMockUsers = [
  { 
    id: 1, 
    name: "Prajwal Weladi", 
    email: "prajwalweladi1@gmail.com", 
    department: "Engineering", 
    assignedLicenses: [
      { id: "1", name: "Adobe Creative Cloud", status: "active" },
      { id: "2", name: "Microsoft 365", status: "active" }
    ]
  },
  { 
    id: 2, 
    name: "Tanmay Walke", 
    email: "tanmay.walke22@vit.edu", 
    department: "Marketing", 
    assignedLicenses: [
      { id: "3", name: "Slack Enterprise", status: "expired" },
      { id: "5", name: "Figma Enterprise", status: "expiring" }
    ]
  },
  { 
    id: 3, 
    name: "Shlok Sonkusare", 
    email: "shlok.sonkusare22@vit.edu", 
    department: "Sales", 
    assignedLicenses: [
      { id: "7", name: "Salesforce Sales Cloud", status: "active" },
      { id: "8", name: "Zoom Enterprise", status: "active" }
    ]
  },
  { 
    id: 4, 
    name: "Yashsin Patil Bhosale", 
    email: "bhosale.patil22@vit.edu", 
    department: "HR", 
    assignedLicenses: [
      { id: "2", name: "Microsoft 365", status: "active" }
    ]
  },
  { 
    id: 5, 
    name: "Michael Wilson", 
    email: "michael.wilson@example.com", 
    department: "IT", 
    assignedLicenses: [
      { id: "6", name: "AWS Enterprise Support", status: "active" },
      { id: "10", name: "GitHub Enterprise", status: "active" }
    ]
  }
]; 