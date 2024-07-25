import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
      passReqToCallback: true,
      scope: ["identify", "guilds", "guilds.join", "guilds.members.read"],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // defining user object and saving the id
        const user = {
          avatarUrl: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
          discordId: profile.id,
          discordUsername: profile.username,
          isMember: false,
          isSupporter: false,
          guildRoles: [],
          appType: req.query.state,
        };

        // Check if user is a member of the guild
        const guild = !!profile.guilds?.find(
          (g) => g.id === process.env.DISCORD_GUILD_ID
        );
        if (!guild) {
          // User is not a member of the guild, add them and then change user.isMember to true
          await axios.put(
            `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${profile.id}`,
            {
              access_token: accessToken,
            },
            {
              headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );
          user.isMember = true;
        }
        if (guild) {
          user.isMember = true;

          // Get user's roles in the guild
          const response = await axios.get(
            `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          user.guildRoles = response.data.roles;
          user.isSupporter = !!response.data.roles.includes(
            process.env.DISCORD_SUPPORTER_ROLE_ID
          );
        }

        done(null, user);
      } catch (err) {
        console.error("Error in DiscordStrategy:", err);
        done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
