import Head from "next/head";

type MetaProps = {
  title?: string;
  description?: string;
  image?: string;
};

const Meta = ({
  title = "Game Recommender",
  description = "Discover your next favorite game with AI",
  image = "https://gamerec.vercel.app/api/og?title=Game%20Recommender&description=Discover%20your%20next%20favorite%20game%20with%20AI",
}: MetaProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:site_name" content="WatchCopilot" />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Meta;
