import { env } from "@/env.mjs";
import type { IGame, RGame } from "@/types/globals";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const gamesRouter = createTRPCRouter({
  findOne: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const response = await fetch(
        `https://api.igdb.com/v4/games/?search=${input.query}&fields=name,cover.url,genres.name,platforms.name,summary,release_dates.human,aggregated_rating,aggregated_rating_count,game_modes.name,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,involved_companies.company.logo.url,involved_companies.company.websites.url,involved_companies.company.websites,videos.video_id; where rating > 75;`,
        {
          method: "POST",
          headers: {
            "Client-ID": env.IGDB_CLIENT_ID,
            Authorization: `Bearer ${env.IGDB_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `IGDB returned ${response.status} ${response.statusText}`,
        });
      }
      const games = (await response.json()) as IGame[];
      const firstGame = games[0] as IGame;
      return firstGame;
    }),

  getTop: publicProcedure.query(async () => {
    const currentYear = new Date().getFullYear();
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${env.RAWG_API_KEY}&dates=${currentYear}-01-01,${currentYear}-12-31&ordering=-rating&page_size=10`
    );
    if (!response.ok) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `RAWG returned ${response.status} ${response.statusText}`,
      });
    }
    const games = (await response.json()) as RGame;
    return games.results;
  }),

  getPaginated: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const pGames = await ctx.prisma.pGame.findMany({
        take: input.limit + 1,
        where: {},
        distinct: ["id"],
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          favoriteCount: "desc",
        },
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (pGames.length > input.limit) {
        const nextItem = pGames.pop();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = nextItem!.id;
      }
      return {
        pGames,
        nextCursor,
      };
    }),

  update: publicProcedure
    .input(
      z.object({
        igdbId: z.number(),
        name: z.string(),
        description: z.string(),
        image: z.string(),
        avgRating: z.number().min(0),
        avgRatingCount: z.number().min(0),
        gameModes: z.array(z.string()),
        genres: z.array(z.string()),
        platforms: z.array(z.string()),
        developer: z.string(),
        trailerId: z.string(),
        releaseDate: z.string(),
        favoriteCount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const pGame = await ctx.prisma.pGame.upsert({
        where: {
          igdbId: input.igdbId,
        },
        update: {
          favoriteCount: {
            increment: input.favoriteCount,
          },
        },
        create: {
          igdbId: input.igdbId,
          name: input.name,
          description: input.description,
          image: input.image,
          avgRating: input.avgRating,
          avgRatingCount: input.avgRatingCount,
          gameModes: input.gameModes,
          genres: input.genres,
          platforms: input.platforms,
          developer: input.developer,
          trailerId: input.trailerId,
          releaseDate: input.releaseDate,
          favoriteCount: input.favoriteCount,
        },
      });
      if (!pGame) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not save game",
        });
      }
      if (pGame.favoriteCount <= 0) {
        await ctx.prisma.pGame.delete({
          where: {
            id: pGame.id,
          },
        });
      }

      return pGame;
    }),
});
