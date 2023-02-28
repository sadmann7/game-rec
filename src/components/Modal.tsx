import { Dialog, Transition } from "@headlessui/react";
import { PLATFORM } from "@prisma/client";
import { X } from "lucide-react";
import {
  Fragment,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "react-hot-toast";
import ReactPlayer from "react-player/lazy";

// external imports
import { type IGame } from "@/types/globals";
import { api } from "@/utils/api";
import { extractYear } from "@/utils/format";
import Image from "next/image";
import ImageCarousel from "./ImageCarousel";
import LikeButton from "./LikeButton";
import PlatformIcons from "./PlatformIcons";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  game: IGame;
  isLiked: boolean;
  setIsLiked: Dispatch<SetStateAction<boolean>>;
  isDisabled?: boolean;
};

const Modal = ({
  isOpen,
  setIsOpen,
  game,
  isLiked,
  setIsLiked,
  isDisabled = false,
}: ModalProps) => {
  const apiUtils = api.useContext();
  const [dev, setDev] = useState<string>("");
  const [trailerId, setTrailerId] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [platforms, setPlatforms] = useState<PLATFORM[]>();
  const [screenshots, setScreenshots] = useState<string[]>([]);

  // set dev
  useEffect(() => {
    if (!game) return;
    if (game.involved_companies) {
      const dev = game.involved_companies.find((company) => company.developer);
      if (dev) {
        setDev(dev.company.name);
      }
    }
  }, [game]);

  // set trailerId
  useEffect(() => {
    if (!game) return;
    if (game.videos) {
      setTrailerId(game.videos[0]?.video_id ?? "");
    }
  }, [game]);

  // convert platform name to enum of type PLATFORM
  useEffect(() => {
    if (!game) return;
    if (game.platforms) {
      const convertedPlatforms = game.platforms.map((platform) => {
        switch (platform.name.match(/(PC|PlayStation|Xbox|Nintendo)/)?.[0]) {
          case "PC":
            return PLATFORM.PC;
          case "PlayStation":
            return PLATFORM.PLAYSTATION;
          case "Xbox":
            return PLATFORM.XBOX;
          case "Nintendo":
            return PLATFORM.NINTENDO;
          default:
            return PLATFORM.PC;
        }
      });
      setPlatforms(convertedPlatforms);
    }
  }, [game]);

  // set screenshots
  useEffect(() => {
    if (!game) return;
    if (game.screenshots) {
      setScreenshots(
        game.screenshots.map(
          (screenshot) =>
            `https://images.igdb.com/igdb/image/upload/t_screenshot_med_2x/${screenshot.image_id}.jpg`
        )
      );
    }
  }, [game]);

  // update game mutation
  const updateGameMutation = api.games.update.useMutation({
    onMutate: async () => {
      if (isLiked) {
        toast.error("Removed from favorites");
      } else {
        toast.success("Added to favorites");
      }
      await apiUtils.games.getPaginated.cancel();
      apiUtils.games.getPaginated.setInfiniteData({ limit: 10 }, (data) => {
        if (!data) {
          return {
            pages: [],
            pageParams: [],
          };
        }
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            pGames: page.pGames.map((pGame) => ({
              ...pGame,
              favoriteCount: isLiked ? -1 : 1,
            })),
          })),
        };
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-md bg-neutral-900 text-left align-middle shadow-xl transition-all">
                <div className="relative aspect-video">
                  <button
                    type="button"
                    aria-label="close modal"
                    className="group absolute top-4 right-4 z-50 flex items-center rounded-full bg-gray-900/80 p-1 ring-2 ring-white transition-transform hover:scale-105 active:scale-95"
                    onClick={() => setIsOpen(false)}
                  >
                    <X
                      aria-hidden="true"
                      className="h-4 w-4 text-white group-hover:scale-105 group-active:scale-95"
                    />
                  </button>
                  {trailerId ? (
                    <ReactPlayer
                      style={{ position: "absolute", top: 0, left: 0 }}
                      url={`https://www.youtube.com/watch?v=${trailerId}`}
                      width="100%"
                      height="100%"
                      controls={true}
                      muted={false}
                      playing={isPlaying}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  ) : game.screenshots ? (
                    <ImageCarousel data={screenshots} />
                  ) : (
                    <Image
                      src={`https:${game.cover.url.replace(
                        "t_thumb",
                        "t_cover_big"
                      )}`}
                      alt={game.name}
                      width={1920}
                      height={1080}
                      className="aspect-video w-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="mx-6 mt-4 mb-6 grid gap-4">
                  <div className="flex items-center justify-between gap-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-medium leading-6 text-white sm:text-lg"
                    >
                      {game.name}
                    </Dialog.Title>
                    <LikeButton
                      aria-label={
                        isLiked ? "add to favorites" : "remove from favorites"
                      }
                      isLiked={isLiked}
                      likeCount={updateGameMutation.data?.favoriteCount ?? 0}
                      onClick={() => {
                        setIsLiked(!isLiked);
                        updateGameMutation.mutate({
                          igdbId: game.id,
                          name: game.name,
                          description: game.summary ?? "",
                          image: game.cover ? game.cover.url : "",
                          rating: game.aggregated_rating ?? 0,
                          genres: game.genres.map((genre) => genre.name) ?? [],
                          platforms: platforms ?? [],
                          releaseDate:
                            game.release_dates[game.release_dates.length - 1]
                              ?.human ?? "",
                          favoriteCount: isLiked ? -1 : 1,
                        });
                      }}
                      disabled={updateGameMutation.isLoading || isDisabled}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-200 sm:text-sm">
                    {game.aggregated_rating ? (
                      <Fragment>
                        <span className="font-medium text-green-600">
                          {Math.round(Number(game.aggregated_rating))}%
                        </span>
                        <span>|</span>
                      </Fragment>
                    ) : null}
                    {game.release_dates ? (
                      <Fragment>
                        <span>
                          {extractYear(
                            game.release_dates[game.release_dates.length - 1]
                              ?.human ?? "26 Feb 2023"
                          ) ?? "Unknown Release Date"}
                        </span>
                        <span>|</span>
                      </Fragment>
                    ) : null}
                    {dev ? <span>{dev}</span> : null}
                  </div>
                  <p className="text-xs text-white line-clamp-3 sm:text-sm">
                    {game.summary ?? "-"}
                  </p>
                  {game.genres ? (
                    <div className="grid gap-2">
                      <span className="text-xs font-medium text-white sm:text-sm">
                        Genres:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {game.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="rounded-full bg-gray-700 px-2 py-1 text-xs text-white"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {game.game_modes ? (
                    <div className="grid gap-2">
                      <span className="text-xs font-medium text-white sm:text-sm">
                        Game Modes:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {game.game_modes.map((gmode) => (
                          <span
                            key={gmode.id}
                            className="rounded-full bg-gray-700 px-2 py-1 text-xs text-white"
                          >
                            {gmode.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {platforms ? (
                    <div className="grid gap-2">
                      <span className="text-xs font-medium text-white sm:text-sm">
                        Platforms:
                      </span>
                      <PlatformIcons platforms={platforms} />
                    </div>
                  ) : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
