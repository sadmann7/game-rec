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
  const [trailerId, setTrailerId] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all">
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
                      className="text-base font-medium leading-6 text-gray-900 sm:text-lg"
                    >
                      {game.name}
                    </Dialog.Title>
                    {/* <LikeButton
                        aria-label={
                          isLiked ? "add to favorites" : "remove from favorites"
                        }
                        isLiked={isLiked}
                        onClick={() => {
                          setIsLiked(!isLiked);
                          updateGameMutation.mutate({
                            tmdbId: show.id,
                            name:
                              show.title ?? show.original_title ?? show.name,
                            description: show.overview ?? "",
                            image: show.poster_path ?? show.backdrop_path ?? "",
                            mediaType: mediaType,
                            favoriteCount: isLiked ? -1 : 1,
                            trailerId: trailerId,
                            genres: show.genres.map(
                              (genre) => genre.name ?? ""
                            ),
                            releaseDate:
                              show.release_date ?? show.first_air_date ?? "",
                            voteAverage: show.vote_average ?? 0,
                            voteCount: show.vote_count ?? 0,
                          });
                        }}
                      /> */}
                  </div>
                  {/*                   
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    {show.vote_average ? (
                      <Fragment>
                        <span className="font-medium text-green-600">
                          {Math.round((Number(show.vote_average) / 10) * 100)}%
                        </span>
                        <span>|</span>
                      </Fragment>
                    ) : null}
                    {show.release_date || show.first_air_date ? (
                      <Fragment>
                        <span>
                          {extractYear(
                            show.release_date ?? show.first_air_date
                          )}
                        </span>
                        <span>|</span>
                      </Fragment>
                    ) : null}
                    {show.number_of_seasons ? (
                      <Fragment>
                        <span>{show.number_of_seasons} Seasons</span>
                        <span>|</span>
                      </Fragment>
                    ) : null}
                    {show.original_language ? (
                      <span>{show.original_language.toUpperCase()}</span>
                    ) : null}
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="font-medium text-gray-900">Watch on:</span>{" "}
                    <a
                      href={show.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {show.homepage ?? "-"}
                    </a>
                  </div>
                  <p className="text-xs line-clamp-3 sm:text-sm">
                    {show.overview ?? "-"}
                  </p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="font-medium text-gray-900">Genres:</span>
                    {show.genres.map((genre) => genre.name).join(", ")}
                  </div> */}
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
