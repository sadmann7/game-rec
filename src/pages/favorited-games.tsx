import type { PLATFORM } from "@prisma/client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { NextPageWithLayout } from "./_app";

// external imports
import Button from "@/components/Button";
import Tabs from "@/components/Tabs";
import DefaultLayout from "@/layouts/DefaultLayout";
import ErrorScreen from "@/screens/ErrorScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import { api } from "@/utils/api";

const FavoritedGames: NextPageWithLayout = () => {
  const [platform, setPlatform] = useState<PLATFORM | undefined>(undefined);

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

  // infinite scroll
  const { ref, inView } = useInView();
  useEffect(() => {
    if (!inView && gamesQuery.hasNextPage) return;
    if (inView) {
      void gamesQuery.fetchNextPage();
    }
  }, [inView, gamesQuery]);

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
      <main className="container mx-auto mt-20 mb-10 grid w-full max-w-7xl gap-5 px-4">
        <Tabs
          data={gamesQuery.data.pages}
          platform={platform}
          setPlatform={setPlatform}
        />
        <Button
          aria-label="load more games"
          variant="secondary"
          className={gamesQuery.hasNextPage ? "block" : "hidden"}
          ref={ref}
          onClick={() => void gamesQuery.fetchNextPage()}
          isLoading={gamesQuery.isFetchingNextPage}
          loadingVariant="dots"
          disabled={!gamesQuery.hasNextPage || gamesQuery.isFetchingNextPage}
        >
          {!gamesQuery.isFetchingNextPage && gamesQuery.hasNextPage
            ? null
            : gamesQuery.hasNextPage
            ? "Load more games"
            : `That's all folks!`}
        </Button>
      </main>
    </>
  );
};

export default FavoritedGames;

FavoritedGames.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
