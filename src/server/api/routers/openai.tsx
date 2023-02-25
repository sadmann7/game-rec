import { env } from "@/env.mjs";
import { type IGame } from "@/types/globals";
import { configuration } from "@/utils/openai";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const openaiRouter = createTRPCRouter({
  generate: publicProcedure
    .input(
      z.object({
        show: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!configuration.apiKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "OpenAI API key not configured, please follow instructions in README.md",
        });
      }

      const prompt = `I have watched ${input.show}. Suggest me 5 popular shows of the same genre or mood that I might like. 
      Make sure to add a small description, and type (tv or movie). You can use the following template: 1. Name - Description - Type.
      `;

      if (!prompt) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during your request.",
        });
      }

      const completion = await ctx.openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false,
        n: 1,
      });
      if (!completion.data.choices) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during your request.",
        });
      }
      if (!completion.data.choices[0]?.text) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during your request.",
        });
      }

      return completion.data.choices[0].text;
    }),

  getGames: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const response = await fetch(
        `https://api.igdb.com/v4/games/?search=${input.query}&fields=name,cover.url,genres.name,platforms.name,summary,release_dates.human,aggregated_rating,aggregated_rating_count,game_modes.name,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,involved_companies.company.logo.url,involved_companies.company.websites.url,involved_companies.company.websites,videos.video_id; where rating > 75;
      `,
        {
          method: "POST",
          headers: {
            "Client-ID": env.IGDB_CLIENT_ID,
            Authorization: `Bearer ${env.IGDB_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = (await response.json()) as IGame[];
      return data;
    }),
});
