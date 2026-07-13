import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

const VIDEOS = [
    {
        id: "XkbmxG9zdmk",
        label: "Browser work",
        title: "Repetitive browser work, completed from one request",
    },
    {
        id: "kEInGNl-IOA",
        label: "Shopify + QuickBooks",
        title: "Orders to invoices, without the weekly copy-paste",
    },
] as const;

type Direction = "forward" | "backward";

type YouTubePlayer = {
    mute: () => void;
    playVideo: () => void;
    stopVideo: () => void;
};

type YouTubePlayerEvent = {
    target: YouTubePlayer;
};

type YouTubeStateEvent = YouTubePlayerEvent & {
    data: number;
};

type YouTubeApi = {
    Player: new (
        element: HTMLIFrameElement,
        options: {
            events: {
                onReady: (event: YouTubePlayerEvent) => void;
                onStateChange: (event: YouTubeStateEvent) => void;
            };
        },
    ) => YouTubePlayer;
    PlayerState: {
        ENDED: number;
    };
};

declare global {
    interface Window {
        YT?: YouTubeApi;
        onYouTubeIframeAPIReady?: () => void;
    }
}

let youtubeApiPromise: Promise<YouTubeApi> | null = null;

function loadYouTubeApi(): Promise<YouTubeApi> {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (youtubeApiPromise) return youtubeApiPromise;

    youtubeApiPromise = new Promise((resolve, reject) => {
        const previousReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            previousReady?.();
            if (window.YT?.Player) {
                resolve(window.YT);
            } else {
                reject(new Error("YouTube iframe API loaded without a player constructor."));
            }
        };

        if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) return;

        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        script.addEventListener("error", () => {
            youtubeApiPromise = null;
            reject(new Error("Unable to load the YouTube iframe API."));
        });
        document.head.appendChild(script);
    });

    return youtubeApiPromise;
}

export default function HeroVideoCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState<Direction>("forward");
    const touchStartX = useRef<number | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const activeVideo = VIDEOS[activeIndex];

    const move = useCallback((step: number) => {
        setDirection(step > 0 ? "forward" : "backward");
        setActiveIndex((current) => (current + step + VIDEOS.length) % VIDEOS.length);
    }, []);

    const selectVideo = (index: number) => {
        if (index === activeIndex) return;
        setDirection(index > activeIndex ? "forward" : "backward");
        setActiveIndex(index);
    };

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        let disposed = false;
        let player: YouTubePlayer | undefined;

        void loadYouTubeApi()
            .then((youtube) => {
                if (disposed || !iframe.isConnected) return;

                player = new youtube.Player(iframe, {
                    events: {
                        onReady: (event) => {
                            if (disposed) return;
                            event.target.mute();
                            event.target.playVideo();
                        },
                        onStateChange: (event) => {
                            if (
                                disposed ||
                                event.data !== youtube.PlayerState.ENDED ||
                                activeIndex >= VIDEOS.length - 1
                            ) {
                                return;
                            }

                            setDirection("forward");
                            setActiveIndex(activeIndex + 1);
                        },
                    },
                });
            })
            .catch((error: unknown) => {
                if (!disposed) {
                    console.warn("Automatic video advance is unavailable.", error);
                }
            });

        return () => {
            disposed = true;
            player?.stopVideo();
        };
    }, [activeIndex]);

    return (
        <section
            aria-label="Duri product demos"
            className="relative w-full"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    move(-1);
                }
                if (event.key === "ArrowRight") {
                    event.preventDefault();
                    move(1);
                }
            }}
            onTouchStart={(event) => {
                touchStartX.current = event.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
                const startX = touchStartX.current;
                const endX = event.changedTouches[0]?.clientX;
                touchStartX.current = null;
                if (startX === null || endX === undefined) return;

                const distance = endX - startX;
                if (Math.abs(distance) < 48) return;
                move(distance < 0 ? 1 : -1);
            }}
        >
            <div className="relative overflow-hidden rounded-[6px] border-[1.5px] border-on-background bg-background shadow-[0_36px_84px_-32px_rgba(0,50,32,0.28),0_2px_0_0_rgba(0,50,32,0.06)]">
                <div className="relative aspect-video overflow-hidden bg-on-background">
                    <div
                        key={activeVideo.id}
                        className={
                            direction === "forward"
                                ? "duri-video-enter-forward absolute inset-0"
                                : "duri-video-enter-backward absolute inset-0"
                        }
                    >
                        <iframe
                            ref={iframeRef}
                            id={`hero-video-${activeVideo.id}`}
                            src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&mute=1&enablejsapi=1&rel=0&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`}
                            title={`Duri demo: ${activeVideo.title}`}
                            className="h-full w-full border-0"
                            loading="eager"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                </div>

                <div className="grid grid-cols-[52px_minmax(0,1fr)_52px] border-t border-divider bg-background sm:grid-cols-[64px_minmax(0,1fr)_64px]">
                    <button
                        type="button"
                        onClick={() => move(-1)}
                        aria-label="Show previous video"
                        className="group flex min-h-[96px] items-center justify-center border-r border-divider text-on-background transition-colors duration-200 hover:bg-brand-soft cursor-pointer"
                    >
                        <ArrowLeftIcon
                            aria-hidden
                            className="h-5 w-5 transition-transform duration-300 ease-out group-hover:-translate-x-1"
                            strokeWidth={1.8}
                        />
                    </button>

                    <div className="min-w-0 px-4 py-3 sm:px-5" aria-live="polite">
                        <p className="truncate text-[10px] font-semibold tracking-[0.11em] text-on-background-secondary uppercase sm:text-[11px]">
                            {activeVideo.label}
                        </p>
                        <p className="mt-1 truncate text-[13px] font-medium text-on-background sm:text-[15px]">
                            {activeVideo.title}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center gap-1" aria-label="Choose a demo">
                                {VIDEOS.map((video, index) => (
                                    <button
                                        key={video.id}
                                        type="button"
                                        aria-label={`Show video ${index + 1}: ${video.label}`}
                                        aria-current={index === activeIndex ? "true" : undefined}
                                        onClick={() => selectVideo(index)}
                                        className="group flex h-4 items-center px-0.5 cursor-pointer"
                                    >
                                        <span
                                            aria-hidden
                                            className={`block h-[3px] w-6 transition-colors duration-200 sm:w-8 ${
                                                index === activeIndex
                                                    ? "bg-brand"
                                                    : "bg-divider-strong group-hover:bg-on-background-secondary"
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => move(1)}
                        aria-label="Show next video"
                        className="group flex min-h-[96px] items-center justify-center border-l border-divider text-on-background transition-colors duration-200 hover:bg-brand-soft cursor-pointer"
                    >
                        <ArrowRightIcon
                            aria-hidden
                            className="h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1"
                            strokeWidth={1.8}
                        />
                    </button>
                </div>
            </div>

            <div
                className="absolute -right-3 -bottom-3 -z-10 h-full w-full rounded-[6px] bg-on-background pointer-events-none"
                aria-hidden
            />
        </section>
    );
}
