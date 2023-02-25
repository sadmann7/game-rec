import Head from "next/head";
import type { NextPageWithLayout } from "./_app";

// external imports
import DefaultLayout from "@/layouts/DefaultLayout";

const FavoritedGames: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Favorited Games | Game Recommender</title>
      </Head>
      <main className="grid min-h-screen place-items-center gap-5">
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
