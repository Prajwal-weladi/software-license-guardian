import { License } from "@/data/mockData";

// Type definitions
export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  assignedLicenses: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

// Keys for localStorage
const LICENSES_KEY = 'slg_licenses';
const USERS_KEY = 'slg_users';

// Initial data from mockData to use if no saved data exists
import { licenses as initialLicenses } from "@/data/mockData";

// Initial mock user data
const initialMockUsers = [
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

// Get licenses from localStorage or use initial data
export const getLicenses = (): License[] => {
  try {
    const savedLicenses = localStorage.getItem(LICENSES_KEY);
    if (savedLicenses) {
      return JSON.parse(savedLicenses);
    } else {
      // If no saved data, initialize with mock data and save to localStorage
      saveLicenses([...initialLicenses]);
      return [...initialLicenses];
    }
  } catch (error) {
    console.error("Error getting licenses:", error);
    return [...initialLicenses];
  }
};

// Save licenses to localStorage
export const saveLicenses = (licenses: License[]): void => {
  try {
    localStorage.setItem(LICENSES_KEY, JSON.stringify(licenses));
  } catch (error) {
    console.error("Error saving licenses:", error);
  }
};

// Get users from localStorage or use initial data
export const getUsers = (): User[] => {
  try {
    const savedUsers = localStorage.getItem(USERS_KEY);
    if (savedUsers) {
      return JSON.parse(savedUsers);
    } else {
      // If no saved data, initialize with mock data and save to localStorage
      saveUsers([...initialMockUsers]);
      return [...initialMockUsers];
    }
  } catch (error) {
    console.error("Error getting users:", error);
    return [...initialMockUsers];
  }
};

// Save users to localStorage
export const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users:", error);
  }
};

// Add a new license
export const addLicense = (license: License): void => {
  try {
    const licenses = getLicenses();
    licenses.unshift(license); // Add to beginning of array
    saveLicenses(licenses);
  } catch (error) {
    console.error("Error adding license:", error);
  }
};

// Update a license
export const updateLicense = (updatedLicense: License): void => {
  try {
    const licenses = getLicenses();
    const index = licenses.findIndex(license => license.id === updatedLicense.id);
    if (index !== -1) {
      licenses[index] = updatedLicense;
      saveLicenses(licenses);
    }
  } catch (error) {
    console.error("Error updating license:", error);
  }
};

// Delete a license
export const deleteLicense = (licenseId: string): void => {
  try {
    const licenses = getLicenses();
    const filteredLicenses = licenses.filter(license => license.id !== licenseId);
    saveLicenses(filteredLicenses);
  } catch (error) {
    console.error("Error deleting license:", error);
  }
};

// Add a new user
export const addUser = (user: User): void => {
  try {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Update a user
export const updateUser = (updatedUser: User): void => {
  try {
    const users = getUsers();
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      saveUsers(users);
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

// Delete a user
export const deleteUser = (userId: number): void => {
  try {
    const users = getUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    saveUsers(filteredUsers);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

// Update license seat counts when assigning/removing licenses
export const updateLicenseSeats = (): void => {
  try {
    const licenses = getLicenses();
    const users = getUsers();
    
    // Reset used seats to 0
    licenses.forEach(license => {
      license.usedSeats = 0;
    });
    
    // Count seat usage from user assignments
    users.forEach(user => {
      user.assignedLicenses.forEach(assignment => {
        const license = licenses.find(lic => lic.id === assignment.id);
        if (license) {
          license.usedSeats += 1;
        }
      });
    });
    
    // Update license status based on expiration and current date
    const today = new Date();
    licenses.forEach(license => {
      const expiryDate = new Date(license.expiryDate);
      const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToExpiry < 0) {
        license.status = 'expired';
      } else if (daysToExpiry <= 30) {
        license.status = 'expiring';
      } else {
        license.status = 'active';
      }
    });
    
    saveLicenses(licenses);
  } catch (error) {
    console.error("Error updating license seats:", error);
  }
};

// Assign licenses to a user and update seat counts
export const assignLicensesToUser = (userId: number, licenseIds: string[]): void => {
  try {
    const users = getUsers();
    const licenses = getLicenses();
    
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) return;
    
    // Update user's assigned licenses
    users[userIndex].assignedLicenses = licenseIds.map(id => {
      const license = licenses.find(lic => lic.id === id);
      return {
        id,
        name: license?.name || "Unknown License",
        status: license?.status || "active"
      };
    });
    
    saveUsers(users);
    updateLicenseSeats(); // Update seat counts
  } catch (error) {
    console.error("Error assigning licenses to user:", error);
  }
}; 