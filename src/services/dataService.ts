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
      console.log("Retrieved licenses from localStorage, JSON length:", savedLicenses.length);

      // Parse the JSON
      const licenses = JSON.parse(savedLicenses);

      // Debug: Check for documents with dataUrl
      let hasDocuments = false;
      let dataUrlSizes = [];

      for (const license of licenses) {
        if (license.documents && license.documents.length > 0) {
          hasDocuments = true;
          for (const doc of license.documents) {
            dataUrlSizes.push({
              licenseId: license.id,
              docId: doc.id,
              docName: doc.name,
              dataUrlExists: !!doc.dataUrl,
              dataUrlLength: doc.dataUrl?.length || 0
            });
          }
        }
      }

      if (hasDocuments) {
        console.log("Retrieved licenses with documents:", dataUrlSizes);
      }

      return licenses;
    } else {
      console.log("No licenses found in localStorage, initializing with mock data");
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
    // Debug: Check if any license has documents with dataUrl
    let hasDocuments = false;
    let dataUrlSizes = [];

    for (const license of licenses) {
      if (license.documents && license.documents.length > 0) {
        hasDocuments = true;
        for (const doc of license.documents) {
          dataUrlSizes.push({
            licenseId: license.id,
            docId: doc.id,
            docName: doc.name,
            dataUrlExists: !!doc.dataUrl,
            dataUrlLength: doc.dataUrl?.length || 0
          });
        }
      }
    }

    if (hasDocuments) {
      console.log("Saving licenses with documents:", dataUrlSizes);
    }

    // Check for large dataUrls that might exceed localStorage limits
    const MAX_SAFE_SIZE = 2 * 1024 * 1024; // 2MB is a safe limit for most browsers

    // Create a copy of licenses to modify for storage
    const licensesToSave = JSON.parse(JSON.stringify(licenses));

    // Check if we need to compress or truncate any dataUrls
    let totalSize = 0;
    let largeDataUrlsFound = false;

    for (const license of licensesToSave) {
      if (license.documents) {
        for (const doc of license.documents) {
          if (doc.dataUrl) {
            totalSize += doc.dataUrl.length;

            // If a single dataUrl is too large, we need to handle it
            if (doc.dataUrl.length > MAX_SAFE_SIZE / 2) {
              console.warn(`Large dataUrl found for document ${doc.name} (${doc.dataUrl.length} chars)`);
              largeDataUrlsFound = true;

              // For now, we'll keep a reference that the document exists but remove the actual data
              // In a real app, you'd want to store this in a different way (e.g., IndexedDB)
              doc.dataUrl = `[Large document data - size: ${doc.dataUrl.length} chars]`;
            }
          }
        }
      }
    }

    console.log(`Total size of all dataUrls: ${totalSize} chars`);

    if (largeDataUrlsFound) {
      console.warn("Some documents were too large for localStorage and their data was removed");
    }

    // Convert to JSON string
    const licensesJson = JSON.stringify(licensesToSave);
    console.log("JSON string length:", licensesJson.length);

    // Check if the entire JSON is too large
    if (licensesJson.length > MAX_SAFE_SIZE) {
      console.error("Total JSON size exceeds safe localStorage limit");
    }

    try {
      // Save to localStorage
      localStorage.setItem(LICENSES_KEY, licensesJson);

      // Verify save
      const savedJson = localStorage.getItem(LICENSES_KEY);
      console.log("Saved JSON length:", savedJson?.length || 0);
      console.log("Save successful:", savedJson === licensesJson);
    } catch (e) {
      console.error("Error saving to localStorage:", e);

      if (e instanceof DOMException &&
          (e.name === 'QuotaExceededError' ||
           e.message.includes('quota') ||
           e.message.includes('storage'))) {
        console.error("localStorage quota exceeded - data was not saved");
      }
    }
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