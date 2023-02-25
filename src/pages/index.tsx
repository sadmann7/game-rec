import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useAnimation } from "framer-motion";
import Head from "next/head";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import Balancer from "react-wrap-balancer";
import { z } from "zod";
import type { NextPageWithLayout } from "./_app";

// external imports
import Button from "@/components/Button";
import DefaultLayout from "@/layouts/DefaultLayout";
import { containerReveal, itemFadeDown } from "@/utils/constants";

const schema = z.object({
  game: z.string().min(1, { message: "Please enter a game" }),
});
type Inputs = z.infer<typeof schema>;

const Home: NextPageWithLayout = () => {
  // react-hook-form
  const { register, handleSubmit, formState } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

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

  return (
    <>
      <Head>
        <title>Game Recommender</title>
      </Head>
      <motion.main
        className="container mx-auto mt-28 mb-10 grid w-full max-w-5xl justify-items-center px-4"
        initial="hidden"
        whileInView="visible"
        animate="visible"
        viewport={{ once: true }}
        variants={containerReveal}
      >
        <motion.div
          className="flex flex-col items-center gap-6"
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
          className="mt-8 grid w-full max-w-3xl gap-5"
          variants={itemFadeDown}
          onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
        >
          <fieldset className="grid gap-3">
            <label htmlFor="show" className="text-base font-medium text-white">
              What show have you already watched?
            </label>
            <input
              type="text"
              id="show"
              className="w-full rounded-md border-gray-300 bg-transparent px-4 py-2.5 text-base text-white transition-colors placeholder:text-gray-300"
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
          >
            Discover your games
          </Button>
        </motion.form>
      </motion.main>
    </>
  );
};

export default Home;

Home.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
