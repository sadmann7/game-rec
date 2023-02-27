import Head from "next/head";
import type { NextPageWithLayout } from "./_app";

// external imports
import Tabs from "@/components/Tabs";
import type { PLATFORM } from "@prisma/client";
import { useState } from "react";

// external imports
import DefaultLayout from "@/layouts/DefaultLayout";
import ErrorScreen from "@/screens/ErrorScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import { api } from "@/utils/api";

const FavoritedGames: NextPageWithLayout = () => {
  const [platform, setPlatform] = useState<PLATFORM | null>(null);

  // games query
  const gamesQuery = api.games.getPaginated.useInfiniteQuery(
    {
      limit: 10,
      platform,
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage) return undefined;
        if (lastPage.nextCursor) {
          return lastPage.nextCursor;
        }
        return undefined;
      },
    }
  );

  if (gamesQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (gamesQuery.isError) {
    return <ErrorScreen error={gamesQuery.error} />;
  }

  return (
    <>
      <Head>
        <title>Favorited Games | Game Recommender</title>
      </Head>
      <main className="grid min-h-screen place-items-center gap-5">
        <Tabs
          data={gamesQuery.data.pages}
          platform={platform}
          setPlatform={setPlatform}
        />
        <div className="grid max-w-md place-items-center gap-2.5">
          <h1 className="text-center text-2xl font-bold text-white sm:text-3xl">
            Favorited Games Page
          </h1>
          <p className="text-center text-gray-300">
            Under construction. This page will show all of the games that you
            have favorited.
          </p>
        </div>
      </main>
    </>
  );
};

export default FavoritedGames;

FavoritedGames.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
