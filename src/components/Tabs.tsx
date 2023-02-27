import { Tab } from "@headlessui/react";
import { PLATFORM, type PGame } from "@prisma/client";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-hot-toast";
import { twMerge } from "tailwind-merge";

// external imports
import Modal from "@/components/Modal";
import { api, type RouterOutputs } from "@/utils/api";
import { containerReveal, itemPopUp } from "@/utils/constants";
import { GrWindows } from "react-icons/gr";
import { IoLogoPlaystation, IoLogoXbox } from "react-icons/io5";
import { SiNintendoswitch } from "react-icons/si";

type TabsProps = {
  data: RouterOutputs["games"]["getPaginated"][];
  platform: PLATFORM | undefined;
  setPlatform: Dispatch<SetStateAction<PLATFORM | undefined>>;
};

const Tabs = ({ data, platform, setPlatform }: TabsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useMemo(() => {
    if (platform === PLATFORM.PC) {
      setSelectedIndex(1);
    } else if (platform === PLATFORM.PLAYSTATION) {
      setSelectedIndex(2);
    } else if (platform === PLATFORM.XBOX) {
      setSelectedIndex(3);
    } else if (platform === PLATFORM.NINTENDO) {
      setSelectedIndex(4);
    } else {
      setSelectedIndex(0);
    }
  }, [platform]);

  const tabs = [
    {
      name: "All",
      onClick: () => {
        setPlatform(undefined);
        setSelectedIndex(0);
      },
      content: <Games data={data} />,
    },
    {
      name: "PC",
      onClick: () => {
        setPlatform(PLATFORM.PC);
        setSelectedIndex(1);
      },
      content: <Games data={data} />,
    },
    {
      name: "Playstation",
      onClick: () => {
        setPlatform(PLATFORM.PLAYSTATION);
        setSelectedIndex(2);
      },
      content: <Games data={data} />,
    },
    {
      name: "Xbox",
      onClick: () => {
        setPlatform(PLATFORM.XBOX);
        setSelectedIndex(3);
      },
      content: <Games data={data} />,
    },
    {
      name: "Nintendo",
      onClick: () => {
        setPlatform(PLATFORM.NINTENDO);
        setSelectedIndex(4);
      },
      content: <Games data={data} />,
    },
  ];

  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <Tab.List className="mx-auto flex w-full gap-2 overflow-x-auto whitespace-nowrap rounded-xl bg-blue-900/80 p-1 sm:max-w-md">
        {tabs.map((tab) => (
          <Tab
            key={tab.name}
            onClick={tab.onClick}
            className={twMerge(
              "w-full rounded-lg py-2.5 px-4 text-sm font-medium leading-5 text-blue-700",
              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
              "ui-selected:bg-white ui-selected:shadow",
              "ui-not-selected:text-blue-100 ui-not-selected:hover:bg-white/[0.12] ui-not-selected:hover:text-white"
            )}
          >
            {tab.name}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-5 text-lg text-white">
        {tabs.map((tab) => (
          <Tab.Panel key={tab.name}>{tab.content}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Tabs;

// Games component
const Games = ({
  data,
}: {
  data: RouterOutputs["games"]["getPaginated"][];
}) => {
  return (
    <motion.div
      className="grid w-full grid-cols-1 gap-5 xxs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      initial="hidden"
      animate="visible"
      variants={containerReveal}
    >
      {data[0]?.pGames.length ? (
        data.map((page) =>
          page.pGames.map((game) => <GameCard key={game.id} game={game} />)
        )
      ) : (
        <div className="col-span-full mx-auto text-base text-gray-100 sm:text-lg">
          No games favorited yet for this platform
        </div>
      )}
    </motion.div>
  );
};

// GameCard component
const GameCard = ({ game }: { game: PGame }) => {
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
    <motion.div
      className="rounded-md bg-blue-900/20"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      variants={itemPopUp}
    >
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
        aria-label={`view ${game.name} details`}
        className="grid cursor-pointer gap-2 overflow-hidden rounded-md bg-neutral-700/80 shadow-md"
        onClick={() => {
          if (!game.name) return;
          findGameMutation.mutate({
            query: game.name,
          });
          setIsOpen(true);
        }}
      >
        <div className="relative">
          <Image
            src={
              game.image
                ? `https:${game.image.replace("t_thumb", "t_cover_big")}`
                : "/images/placeholder.webp"
            }
            alt={game.name}
            width={220}
            height={330}
            className="h-60 w-full object-cover"
            priority
          />
          <div className="absolute -bottom-3 right-3 grid h-7 w-7 place-items-center rounded-full bg-black/80 text-xs font-medium text-white ring-2 ring-gray-200 sm:text-sm">
            {game.favoriteCount}
          </div>
        </div>
        <div className="mx-4 mb-5 grid gap-1">
          <h3 className="flex-1 text-sm font-semibold text-white line-clamp-1 sm:text-base">
            {game.name}
          </h3>
          <p className="text-xs text-gray-200 sm:text-sm">
            {game.releaseDate
              ? dayjs(game.releaseDate).format("DD/MM/YYYY")
              : "TBA"}
          </p>
          <div className="mt-1 flex items-center gap-2">
            {game.platforms.map((platform) =>
              platform === PLATFORM.PC ? (
                <GrWindows key={platform} className="text-white" size={20} />
              ) : platform === PLATFORM.PLAYSTATION ? (
                <IoLogoPlaystation
                  key={platform}
                  className="text-white"
                  size={22}
                />
              ) : platform === PLATFORM.XBOX ? (
                <IoLogoXbox key={platform} className="text-white" size={20} />
              ) : platform === PLATFORM.NINTENDO ? (
                <SiNintendoswitch
                  key={platform}
                  className="text-white"
                  size={20}
                />
              ) : null
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
