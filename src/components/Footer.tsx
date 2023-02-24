const Footer = () => {
  return (
    <footer aria-label="footer">
      <div className="grid place-items-center py-5">
        <h1 className="text-sm text-gray-600 sm:text-base">
          Powered by{" "}
          <a
            aria-label="navigate to openai"
            href="https://openai.com/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-gray-700 transition-colors hover:text-black active:text-gray-700"
          >
            OpenAI
          </a>
          {", "}
          <a
            aria-label="navigate to igdb"
            href="https://api-docs.igdb.com/#getting-started"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-gray-700 transition-colors hover:text-black active:text-gray-700"
          >
            IGDB
          </a>
          {", and "}
          <a
            aria-label="navigate to vercel"
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-gray-700 transition-colors hover:text-black active:text-gray-700"
          >
            Vercel
          </a>
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
