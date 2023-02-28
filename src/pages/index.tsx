import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useAnimation } from "framer-motion";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import Balancer from "react-wrap-balancer";
import { z } from "zod";
import type { NextPageWithLayout } from "./_app";

// external imports
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import Modal from "@/components/Modal";
import DefaultLayout from "@/layouts/DefaultLayout";
import ErrorScreen from "@/screens/ErrorScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import { type OGame } from "@/types/globals";
import { api } from "@/utils/api";
import { containerReveal, itemFadeDown } from "@/utils/constants";

const schema = z.object({
  game: z.string().min(1, { message: "Please enter a game" }),
});
type Inputs = z.infer<typeof schema>;

const Home: NextPageWithLayout = () => {
  // generate game mutation
  const generateGameMutation = api.openai.generate.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
    onError: () => {
      toast.error("Failed to generate game");
    },
  });

  // get top games query
  const topGamesQuery = api.games.getTop.useQuery();

  // react-hook-form
  const { register, handleSubmit, formState } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // console.log(data);
    await generateGameMutation.mutateAsync({ ...data });
  };

  // scroll to recommended shows
  const generatedRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!generatedRef.current || !generateGameMutation.data) return;
    const offset = generatedRef.current.offsetTop - 90;
    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  }, [generateGameMutation.data]);

  // framer-motion
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: "-100px",
  });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      void controls.start("visible");
    } else {
      void controls.start("hidden");
    }
    return () => controls.stop();
  }, [controls, inView]);

  if (topGamesQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (topGamesQuery.isError) {
    return <ErrorScreen error={topGamesQuery.error} />;
  }

  return (
    <>
      <Head>
        <title>Game Recommender</title>
      </Head>
      <motion.main
        className="mb-5"
        initial="hidden"
        whileInView="visible"
        animate="visible"
        viewport={{ once: true }}
        variants={containerReveal}
      >
        <Hero
          data={topGamesQuery.data.filter((game) => game.background_image)}
        />
        <div className="container mx-auto grid w-full max-w-6xl place-items-center gap-10 px-4">
          <motion.div
            className="flex max-w-5xl flex-col items-center gap-6"
            variants={itemFadeDown}
          >
            <h1 className="mx-auto text-center text-4xl font-bold text-white sm:text-6xl">
              <Balancer ratio={0.5}>Discover your next favorite game</Balancer>
            </h1>
            <p className="w-full max-w-3xl text-center text-base text-gray-300 sm:text-lg">
              Enter a game you have already played and we will recommend you
              similar games with AI
            </p>
          </motion.div>
          <motion.form
            aria-label="generate show from"
            className="grid w-full max-w-3xl gap-5"
            variants={itemFadeDown}
            onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
          >
            <fieldset className="grid gap-3">
              <label
                htmlFor="show"
                className="text-base font-medium text-gray-100"
              >
                What game have you played?
              </label>
              <input
                type="text"
                id="show"
                className="w-full rounded-md border-gray-300 bg-transparent px-4 py-2.5 text-base text-white transition-colors placeholder:text-gray-400"
                placeholder="e.g. Half-Life 2"
                {...register("game")}
              />
              {formState.errors.game ? (
                <p className="-mt-1 text-sm font-medium text-red-500">
                  {formState.errors.game.message}
                </p>
              ) : null}
            </fieldset>
            <Button
              aria-label="discover your shows"
              variant="primary"
              className="w-full"
              loadingVariant="dots"
              isLoading={generateGameMutation.isLoading}
              disabled={generateGameMutation.isLoading}
            >
              Discover your games
            </Button>
          </motion.form>
          <motion.div
            className="w-full max-w-3xl"
            ref={generatedRef}
            variants={itemFadeDown}
          >
            {generateGameMutation.isError ? (
              <p className="text-red-500">
                {generateGameMutation.error?.message}
              </p>
            ) : generateGameMutation.isSuccess ? (
              <div className="grid place-items-center gap-8">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Recommended games
                </h2>
                <motion.div
                  className="grid w-full gap-3"
                  ref={ref}
                  variants={containerReveal}
                >
                  {generateGameMutation.data.formattedData
                    .filter((game) => !!game.name)
                    .map((game) => (
                      <GameCard key={game.name} game={game} />
                    ))}
                </motion.div>
              </div>
            ) : null}
          </motion.div>
        </div>
      </motion.main>
    </>
  );
};

export default Home;

Home.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

const GameCard = ({ game }: { game: OGame }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // find show mutation
  const findGameMutation = api.games.findOne.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (findGameMutation.isError) {
    toast.error(findGameMutation.error?.message);
    return null;
  }

  return (
    <motion.div className="rounded-md bg-blue-900/20" variants={itemFadeDown}>
      {findGameMutation.isSuccess ? (
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          game={findGameMutation.data}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
        />
      ) : null}
      <div
        role="button"
        aria-label={`view ${game.name ?? ""} details`}
        className="flex cursor-pointer flex-col gap-2 rounded-md bg-neutral-700 p-4 shadow-md ring-1 ring-gray-400 transition-colors hover:bg-neutral-800 active:bg-neutral-700"
        onClick={() => {
          if (!game.name) return;
          findGameMutation.mutate({
            query: game.name,
          });
          setIsOpen(true);
        }}
      >
        <h3 className="flex-1 text-base font-medium text-white sm:text-lg">
          {game.name}
        </h3>
        <p className="text-xs text-gray-100 line-clamp-2 sm:text-sm">
          {game.description}
        </p>
      </div>
    </motion.div>
  );
};
