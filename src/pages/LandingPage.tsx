import { useRef, useState } from "react";
import { ChevronRightIcon, PartyPopperIcon, PlayIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { thirdPartyLogos, features } from "../utils/marketingContent";
import { supabase } from "../utils/supabase";

function LandingPage() {
    const [activeFeature, setActiveFeature] = useState<number>(0);
    const [email, setEmail] = useState<string>("");
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const featuresSectionRef = useRef<HTMLElement | null>(null);
    const footerRef = useRef<HTMLElement | null>(null);

    const scrollToFeatures = () => {
        featuresSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const scrollToFooter = () => {
        footerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) return;
        const formattedEmail = email.trim().toLowerCase();

        const { data, error } = await supabase
            .from('demo_requests')
            .insert([
                { email: formattedEmail },
            ])
            .select()

        if (error) {
            console.error(error);
        } else {
            console.log(data);
            setIsSubmitted(true);
        }
    };

    return (
        <>
            {/* Navigation */}
            <nav className="bg-background sticky w-full z-20 top-0 border-b border-divider min-w-xs">
                <div className="flex items-center justify-between p-4 md:py-0 md:px-8">

                    <a href="/">
                        <img src={`${import.meta.env.BASE_URL}logos/duri.svg`} className="h-5" alt="Duri Text Logo" />
                    </a >

                    <div className="inline-flex items-center gap-3 md:py-4">
                        {/* TODO: Update href */}
                        <Link to="/auth" className="text-on-background font-normal text-sm hover:opacity-70">Log in</Link>

                        <a
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToFooter();
                            }}
                        >
                            <button type="button" className="text-on-brand bg-brand hover:bg-transparent hover:text-brand box-border border-2 border-transparent hover:border-brand font-normal leading-5 rounded-xs text-sm px-3 py-[5px] md:px-5 md:py-2.5 transition-colors duration-500 cursor-pointer">Request a Demo</button>
                        </a>
                    </div>

                </div>
            </nav>

            {/* First Section - Hero Section */}
            <section className="w-full min-w-xs relative">
                <div className="absolute inset-0 bg-size-[105px_105px] bg-[linear-gradient(90deg,rgba(0,0,0,.55)_1px,transparent_0),linear-gradient(180deg,rgba(0,0,0,.55)_1px,transparent_0)] opacity-10 z-5" />

                <div className="absolute inset-0 bg-[linear-gradient(0deg,#fff,transparent)] z-10" />

                <div className="w-full py-22.5 flex flex-col justify-center items-center text-center relative z-15">
                    <div className="mb-14 border border-divider rounded-xs py-3 px-4 bg-background flex justify-center items-center gap-2 text-on-background hover:bg-on-background hover:text-on-brand hover:cursor-pointer w-full max-w-2xs sm:max-w-xs md:max-w-md lg:w-auto lg:max-w-none"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToFeatures();
                        }}>
                        <PartyPopperIcon className="w-5 h-5 transition-colors duration-200" />
                        <span className="text-xl transition-colors duration-200 hidden lg:inline">Introducing Duri: AI business operator with a collaborative workspace</span>
                        <span className="text-xl transition-colors duration-200 inline lg:hidden">Introducing Duri AI</span>
                        <ChevronRightIcon className="w-5 h-5 transition-colors duration-200" />
                    </div>
                    <img src={`${import.meta.env.BASE_URL}logos/d.svg`} className="h-20" alt="Duri Initial Logo" />
                    <h1 className="mt-5 text-4xl sm:text-4xl md:text-5xl lg:text-7xl text-on-background max-w-2xs sm:max-w-xs md:max-w-md lg:max-w-xl xl:max-w-none">We automate back-office tasks.</h1>
                    <p className="mt-3.75 text-lg sm:text-xl md:text-2xl text-on-background-secondary max-w-2xs sm:max-w-xs md:max-w-md lg:max-w-2xl xl:max-w-none">An AI business operator for small and medium businesses.</p>
                    <div className="mt-10 flex flex-col items-center lg:flex-row lg:items-start gap-6">
                        <a
                            href="https://duristorage.blob.core.windows.net/releases/desktop/latest/Duri-latest-mac.zip"
                        >
                            <button type="button" className="text-on-brand bg-brand hover:bg-transparent hover:text-brand box-border border border-transparent hover:border-brand font-normal leading-5 rounded-xs text-2xl px-8 py-6 transition-colors duration-500 cursor-pointer min-w-2xs sm:min-w-xs md:min-w-md lg:min-w-0">Download for Mac</button>
                        </a>
                        <a
                            href="https://duristorage.blob.core.windows.net/releases/desktop/latest/Duri-latest-win.exe"
                        >
                            <button type="button" className="text-on-background bg-transparent box-border border border-on-background hover:bg-on-background hover:text-on-brand font-normal leading-5 rounded-xs text-2xl px-8 py-6 transition-colors duration-500 cursor-pointer min-w-2xs sm:min-w-xs md:min-w-md lg:min-w-0">Download for Windows</button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Spacer */}
            <div className="w-full h-6" />

            {/* Second Section - Built in Third Party Integration Section */}
            <section className="w-full mt-[26px] mb-[80px] flex flex-col items-center min-w-xs">
                <h4 className="mb-[48px] text-on-background text-[16px] text-center max-w-2xs sm:max-w-xs md:max-w-md lg:max-w-none">Built-in Integrations with Your Favorite Tools</h4>

                <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-8 gap-2 min-[421px]:gap-4">
                    {
                        thirdPartyLogos.map((party) => {
                            return (
                                <div className="bg-transparent box-border border border-on-background w-[140px] min-[421px]:w-[150px] md:w-[165px] h-[100px] flex justify-center items-center" key={party.name}>
                                    <img src={party.logo} alt={party.name} className="w-[120px]" />
                                </div>
                            )
                        })
                    }
                </div>
            </section>

            {/* Spacer */}
            <div className="w-full h-6" />

            {/* Third Section - Features Section */}
            <section ref={featuresSectionRef} className="w-full mt-[26px] pb-[63px] md:pb-[100px] relative min-w-xs">
                <div className="absolute inset-0 bg-[url('/Duri_Landing_Page/background/grid.svg')] bg-size-[160px_92px] bg-position-[80px_0px] z-5" />

                <div className="absolute inset-0 top-0 bg-[linear-gradient(180deg,#fff,transparent)] z-10 h-1/2" />

                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,#fff,transparent)] z-10 h-1/10" />

                <div className="z-15 relative overflow-x-hidden">

                    <div className="flex justify-center items-center mb-[40px] md:mb-[64px]">
                        <h2 className="text-on-background text-3xl sm:text-3xl md:text-4xl lg:text-6xl">Features</h2>
                    </div>

                    <div className="flex w-full px-[16px] md:flex-col mx-auto md:max-w-4xl xl:max-w-5xl">
                        <ul className="flex flex-col-reverse justify-between md:flex-row">
                            {
                                features.map((feature) => {
                                    return (
                                        <li key={feature.id}>
                                            <button className="flex items-center flex-col md:flex-row rotate-180 md:rotate-0 hover:cursor-pointer" onClick={() => setActiveFeature(feature.id)}>

                                                <span className={`box-border border border-on-background border-b-0 border-l-0 md:border-l md:border-r-0 w-[50px] md:w-auto md:h-[50px] xl:h-[70px] px-[16px] py-[12px] [writing-mode:vertical-rl] md:[writing-mode:horizontal-tb] ${activeFeature === feature.id ? "bg-on-background text-on-brand" : "bg-divider text-on-background"} text-[18px] md:text-[16px] xl:text-[26px]`}>
                                                    {feature.title}
                                                </span>

                                                {
                                                    activeFeature === feature.id ?
                                                        <img alt="triangle" loading="lazy" src={`${import.meta.env.BASE_URL}misc_images/triangle.png`} className="w-[50px] h-[50px] xl:w-[70px] xl:h-[70px] rotate-90 md:rotate-0" /> :
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 70 70" className="w-[50px] h-[50px] xl:w-[70px] xl:h-[70px] rotate-90 md:rotate-0">
                                                            <path className="fill-on-background-secondary-variant" stroke="#100D0D" d="M.5.5h.968l67.345 69H.5z"></path>
                                                        </svg>
                                                }
                                            </button>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <article className="box-border border border-on-background p-[16px] md:p-[32px] xl:py-[56px] xl:pr-[113px] flex flex-col xl:flex-row gap-6 xl:gap-12 w-full bg-background">
                            <div className="w-full py-[64px] flex justify-center items-center">
                                <img src={features[activeFeature].logo} alt={features[activeFeature].title} className="w-2/3 h-auto" />
                            </div>
                            <div className="flex flex-col gap-6">
                                <ul className="list-[square] pl-[16px] flex flex-col gap-[16px]">
                                    {features[activeFeature].descriptions.map((description) => {
                                        return (
                                            <li key={description} className="text-on-background-secondary text-[16px] md:text-[18px]">
                                                {description}
                                            </li>
                                        )
                                    })}
                                </ul>
                                <a className="group mt-[32px] min-w-4xs max-w-2xs hover:cursor-pointer relative" onClick={(e) => {
                                    e.preventDefault();
                                    scrollToFooter();
                                }}>
                                    <div className="relative box-border border border-on-background py-[16px] px-[24px] z-2 bg-background hover:translate-x-[10px] hover:translate-y-[-10px] transition-transform duration-300">
                                        <span className="text-[14px]">Request a Demo</span>
                                        <div className="flex justify-end items-center">
                                            <span className="text-on-background box-border border-2 border-on-background p-[8px] w-[40px] h-[40px] flex justify-center items-center group-hover:bg-on-background">
                                                <PlayIcon className="w-full h-full group-hover:text-on-brand" strokeWidth={"3px"} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-on-background z-1 rounded-xs" />
                                </a>
                            </div>
                        </article>
                    </div>
                </div>

            </section>

            {/* Fourth Section - Footer Section */}
            <footer ref={footerRef} className="w-full px-[14px] lg:px-[48px] bg-brand-variant min-w-xs">

                <div className="border-x border-divider">
                    <div className="flex flex-col items-center">
                        <div className="border-divider border-b-0 px-[24px] pt-[46px] pb-[30px] text-on-brand max-w-sm sm:max-w-md md:max-w-lg">
                            {!isSubmitted ?
                                (
                                    <>
                                        <h3 className="font-bold mb-[8px] text-md">Request a Demo</h3>
                                        <p className="text-md">Enter your email below and we’ll reach out shortly to schedule a personalized demo tailored to your business.</p>
                                    </>
                                ) :
                                (
                                    <>
                                        <h3 className="font-bold mb-[8px] text-md">Thank you for your interest!</h3>
                                        <p className="text-md">We’re reviewing your request and will reach out shortly to get your demo scheduled.</p>
                                    </>
                                )
                            }
                        </div>

                        <div className="px-[24px] pb-[46px] sm:pt-0 text-on-brand w-full max-w-sm sm:max-w-md md:max-w-lg">
                            {!isSubmitted && (
                                <form onSubmit={handleSubmit}>
                                    <label htmlFor="input-group-1" className="block mb-2.5 text-md font-medium">Your Email*</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                                            <svg className="w-4 h-4 text-on-background" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" /></svg>
                                        </div>
                                        <input type="email" id="input-group-1" className="block w-full ps-9 pe-3 py-2.5 bg-background border border-default-medium border-divider text-on-background text-heading text-md rounded-base shadow-xs placeholder:text-body placeholder:text-on-background-secondary" placeholder="your_business@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>

                                    <button type="submit" className="text-on-brand bg-on-background box-border border border-transparent hover:bg-brand-strong shadow-xs font-medium leading-5 rounded-base text-md px-4 py-2.5 w-full mt-[8px] hover:cursor-pointer hover:bg-background hover:text-on-background transition-colors duration-300">Submit</button>
                                </form>)}
                        </div>
                    </div>

                    <div className="px-[39px] pt-[30px] md:pt-[30px] flex justify-center border-t border-divider">
                        <img src={`${import.meta.env.BASE_URL}logos/duri_white.svg`} className="w-auto h-full" alt="Duri Text Logo" />
                    </div>
                </div>

            </footer>
        </>
    )
}

export default LandingPage;