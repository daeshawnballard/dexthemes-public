import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { isProtectedThemeId } from "./protectedThemes";

function assertAdminSecret(secret: string) {
  const configured = process.env.ADMIN_SECRET;
  if (!configured || secret !== configured) {
    throw new Error("Unauthorized");
  }
}

export const deleteThemeByName = internalMutation({
  args: {
    adminSecret: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    assertAdminSecret(args.adminSecret);

    const themes = await ctx.db.query("themes").collect();
    const theme = themes.find((t) => t.name === args.name);
    if (!theme) {
      throw new Error(`Theme "${args.name}" not found`);
    }

    const flags = await ctx.db
      .query("flags")
      .withIndex("by_theme_user", (q) => q.eq("themeId", theme._id))
      .collect();
    for (const flag of flags) {
      await ctx.db.delete(flag._id);
    }

    const likes = await ctx.db
      .query("likes")
      .withIndex("by_theme", (q) => q.eq("themeId", theme.themeId))
      .collect();
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    await ctx.db.delete(theme._id);
    return { deleted: theme.name, themeId: theme.themeId };
  },
});

export const updateAuthorName = internalMutation({
  args: {
    adminSecret: v.string(),
    fromName: v.string(),
    toName: v.string(),
  },
  handler: async (ctx, args) => {
    assertAdminSecret(args.adminSecret);

    const themes = await ctx.db.query("themes").collect();
    const matches = themes.filter((t) => t.authorName === args.fromName);
    for (const theme of matches) {
      await ctx.db.patch(theme._id, { authorName: args.toName });
    }
    return { updated: matches.length, fromName: args.fromName, toName: args.toName };
  },
});

export const protectAllThemes = internalMutation({
  args: {
    adminSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertAdminSecret(args.adminSecret);

    const themes = await ctx.db
      .query("themes")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    let count = 0;
    for (const theme of themes) {
      const shouldProtect = isProtectedThemeId(theme.themeId);
      if (!!theme.protected !== shouldProtect) {
        await ctx.db.patch(theme._id, { protected: shouldProtect });
        count++;
      }
    }
    return { updatedCount: count, totalPublished: themes.length };
  },
});
