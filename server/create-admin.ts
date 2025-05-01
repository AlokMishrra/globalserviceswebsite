import { hash } from "bcrypt";
import { storage } from "./storage";

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await storage.getUserByUsername("admin");
    
    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }

    // Admin user does not exist, create one
    const hashedPassword = await hash("admin123", 10);
    
    const adminUser = await storage.createUser({
      username: "admin",
      password: hashedPassword,
      email: "admin@globalservices.com",
      name: "Admin User",
      role: "admin"
    });

    console.log("Admin user created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("Please change this password immediately after first login.");
  } catch (error) {
    console.error("Failed to create admin user:", error);
  }
}

// Run the function when this script is executed directly
if (require.main === module) {
  createAdminUser()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });
}

export { createAdminUser };