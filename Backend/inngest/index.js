import { Inngest } from "inngest";
import { User } from "../Models/User.js"; // ✅ add .js extension for ES modules

// Create a single Inngest client
export const inngest = new Inngest({
  id: "pingup-app",
  name: "PingUp App",
});

// Function: Sync new Clerk user to MongoDB
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    let username = email_addresses[0].email_address.split("@")[0];

    // Check if username already exists
    const user = await User.findOne({ username });
    if (user) {
      username = username + Math.floor(Math.random() * 10000);
    }

    // Save user in MongoDB
    await User.create({
      _id: id,
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
      username,
    });
  }
);

// Function: Sync updates from Clerk
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    await User.findByIdAndUpdate(id, {
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
    });
  }
);

// Function: Delete user if removed in Clerk
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await User.findByIdAndDelete(event.data.id);
  }
);

// Export all functions
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
];
