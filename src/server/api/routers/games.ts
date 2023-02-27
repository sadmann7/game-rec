import { env } from "@/env.mjs";
import type { IGame, RGame } from "@/types/globals";
import { PLATFORM } from "@prisma/client";
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
        `https://api.igdb.com/v4/games/?search=${input.query}&fields=name,cover.url,genres.name,platforms.name,summary,release_dates.human,aggregated_rating,aggregated_rating_count,game_modes.name,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,involved_companies.company.logo.url,involved_companies.company.websites.url,involved_companies.company.websites,videos.video_id; where rating > 75; sort aggregated_rating desc; limit 1;`,
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
      `https://api.rawg.io/api/games?key=${env.RAWG_API_KEY}&dates=${currentYear}-01-01,${currentYear}-12-31&ordering=-rating&page_size=20`
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

  getTopIgdb: publicProcedure.query(async () => {
    const body = `fields name, cover.url, genres.name, platforms.name, summary, release_dates.human, first_release_date, aggregated_rating, aggregated_rating_count, game_modes.name, involved_companies.company.name, involved_companies.company.logo.url, involved_companies.company.websites.url, videos.video_id;
    where aggregated_rating_count > 10; sort total_rating desc; limit 10;`;
    const response = await fetch(`https://api.igdb.com/v4/games`, {
      method: "POST",
      headers: {
        "Client-ID": env.IGDB_CLIENT_ID,
        Authorization: `Bearer ${env.IGDB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `IGDB returned ${response.status} ${response.statusText}`,
      });
    }
    const games = (await response.json()) as IGame[];
    return games;
  }),

  getPaginated: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.string().nullish(),
        platform: z.nativeEnum(PLATFORM).optional().nullable(),
      })
    )
    .query(async ({ ctx, input }) => {
      const pGames = await ctx.prisma.pGame.findMany({
        take: input.limit + 1,
        where: {
          platforms: {
            has: input.platform ?? null,
          },
        },
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
        rating: z.number().min(0),
        genres: z.array(z.string()),
        platforms: z.array(z.nativeEnum(PLATFORM)).default([PLATFORM.PC]),
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
          image: input.image,
          rating: input.rating,
          genres: input.genres,
          platforms: input.platforms,
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
