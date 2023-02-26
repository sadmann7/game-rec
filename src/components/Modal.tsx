import { Dialog, Transition } from "@headlessui/react";
import {
  Fragment,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "react-hot-toast";
import ReactPlayer from "react-player/lazy";
// import { toast } from "react-toastify";

// external imports
import { api } from "@/utils/api";
import { X } from "lucide-react";
import LikeButton from "./LikeButton";
import { type IGame } from "@/types/globals";
import { extractYear } from "@/utils/format";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  game: IGame;
  isLiked: boolean;
  setIsLiked: Dispatch<SetStateAction<boolean>>;
};

const Modal = ({
  isOpen,
  setIsOpen,
  game,
  isLiked,
  setIsLiked,
}: ModalProps) => {
  const apiUtils = api.useContext();
  const [dev, setDev] = useState<string>("");
  const [trailerId, setTrailerId] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-md bg-neutral-900 text-left align-middle shadow-xl transition-all">
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
                </div>
                <div className="mx-6 mt-4 mb-6 grid gap-2">
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
                      onClick={() => {
                        setIsLiked(!isLiked);
                        updateGameMutation.mutate({
                          igdbId: game.id,
                          name: game.name,
                          description: game.summary ?? "",
                          image: game.cover.url ?? "",
                          avgRating: game.aggregated_rating ?? 0,
                          avgRatingCount: game.aggregated_rating_count ?? 0,
                          gameModes:
                            game.game_modes.map((mode) => mode.name) ?? [],
                          genres: game.genres.map((genre) => genre.name) ?? [],
                          platforms:
                            game.platforms.map((platform) => platform.name) ??
                            [],
                          developer: dev ?? "Unknown Dev",
                          trailerId: trailerId,
                          releaseDate:
                            game.release_dates[game.release_dates.length - 1]
                              ?.human ?? "",
                          favoriteCount: isLiked ? -1 : 1,
                        });
                      }}
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
                    {game.game_modes ? (
                      <Fragment>
                        <span>
                          {game.game_modes
                            .map((gmode) => gmode.name)
                            .join(", ")}
                        </span>
                        <span>|</span>
                      </Fragment>
                    ) : null}
                    {dev ? <span>{dev}</span> : null}
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="font-medium text-white">Buy on:</span>{" "}
                    <a
                      aria-label="buy on steam"
                      href={`https://store.steampowered.com/search/?term=${game.name}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Steam
                    </a>
                  </div>
                  <p className="text-xs text-white line-clamp-3 sm:text-sm">
                    {game.summary ?? "-"}
                  </p>
                  {game.genres ? (
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="font-medium text-white">Genres:</span>
                      <span className="text-gray-100">
                        {game.genres.map((genre) => genre.name).join(", ")}
                      </span>
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
