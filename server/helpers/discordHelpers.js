import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const botHeaders = {
  Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
  "Content-Type": "application/json",
};

// Assigns a specific role to a specific user
export const assignRole = async (guildId, userId, roleId) => {
  try {
    await axios.put(
      `https://discord.com/api/v9/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      {},
      {
        headers: botHeaders,
      }
    );
  } catch (err) {
    console.error(`Error assigning role: `, err);
  }
};

// Sends user a DM (Direct message)
export const sendMessageDM = async (userId, content) => {
  try {
    const res = await axios.post(
      "https://discord.com/api/v9/users/@me/channels",
      {
        recipient_id: userId,
      },
      {
        headers: botHeaders,
      }
    );
    const dmChannel = res.data;

    await axios.post(
      `https://discord.com/api/v9/channels/${dmChannel.id}/messages`,
      {
        content: content,
      },
      {
        headers: botHeaders,
      }
    );
  } catch (err) {
    console.error(`Error sending DM: `, err);
  }
};

// Sends a message to a specific guild(server) channel
export const sendMessageToChannel = async (channelId, content) => {
  try {
    await axios.post(
      `https://discord.com/api/v9/channels/${channelId}/messages`,
      {
        content: content,
      },
      {
        headers: botHeaders,
      }
    );
  } catch (err) {
    console.error(`Error sending message to channel: `, err);
  }
};
