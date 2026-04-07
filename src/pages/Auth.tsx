function Auth() {
    return (
        <div className="grid min-h-dvh w-full grid-cols-1 md:grid-cols-[1fr_1fr]">
            <div className="relative z-10 mx-auto flex w-full max-w-[500px] flex-col items-center justify-center bg-background px-8">
                <header className="absolute top-9 left-9">
                    <img alt="Duri Text Logo" loading="lazy" src={`${import.meta.env.BASE_URL}logos/duri.svg`} className="w-[50px] h-auto" />
                </header>
                <div className="flex min-h-dvh w-full flex-col items-center bg-background">
                    <div className="flex h-full w-full flex-col items-center justify-center">
                        <section className="w-full rounded-sm bg-background">
                            <h1 className="mb-4 text-xl font-medium text-on-background">Welcome!</h1>
                            <form className="flex flex-col gap-y-6" name="login">
                                <div className="flex flex-col gap-y-3">
                                    <label htmlFor="email" className="">
                                        <div className="mb-1 flex justify-between text-xs text-on-background-secondary">Email
                                            {/* <a className="text-xs" href="/reset-password">Forgot password?</a> */}
                                        </div>
                                        <input className="border-on-background-secondary bg-background placeholder:text-on-background-secondary flex h-10 w-full rounded-sm border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50" data-testid="sign-in-email-input" type="email" name="email" placeholder="your_business@gmail.com" />
                                    </label>
                                    <label htmlFor="password" className="">
                                        <div className="mb-1 flex justify-between text-xs text-on-background-secondary">Password
                                        </div>
                                        <input className="border-on-background-secondary bg-background placeholder:text-on-background-secondary flex h-10 w-full rounded-sm border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50" data-testid="sign-in-email-input" type="password" name="password" placeholder="********" />
                                    </label>
                                </div>
                                <button className="gap-2 cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-80 flex rounded-sm border border-brand bg-brand text-on-brand hover:bg-brand-variant h-10 px-4 py-2" type="submit" data-testid="sign-in-email-submit-button">Sign in</button>
                                <div className="text-center text-xs">Don't have an account?
                                    <a className="text-highlight" href="/">{" "}Request a Demo</a>
                                </div>
                            </form>
                            <footer className="mt-4 max-w-[600px] text-center text-xs text-on-background-secondary">By continuing, you agree to Duri’s{" "}
                                {/* TODO: Update href */}
                                <a target="_blank" className="underline" href="#">Terms of Service</a> with {" "}
                                {/* TODO: Update href */}
                                <a target="_blank" className="underline" href="#">Privacy Policy</a> and to receive periodic emails with updates.
                            </footer>
                        </section>
                    </div>
                </div>
            </div>
            <div className="z-0 hidden flex-col overflow-hidden md:flex">
                <div className="relative flex flex-1 bg-cover bg-center bg-[url('/Duri_Landing_Page/background/wave.jpg')]">
                    <div className="flex flex-1 flex-col items-start justify-end px-8 py-12 lg:px-12 max-w-[720px]">
                        <div className="flex flex-col gap-8 pb-10">
                            <div>
                                <h2 className="text-left text-xl font-medium text-on-background">Duri will save you time.</h2>
                                <p className="mt-2 text-left text-sm text-on-background-secondary">Focus on what matters the most, let Duri handle the rest.</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-1/2 right-0 left-0 flex -translate-y-1/2 justify-start px-8 lg:px-12 max-w-[720px] mt-[-100px]">
                        <img src={`${import.meta.env.BASE_URL}logos/d.svg`} alt="Duri Initial Logo" className="w-full max-w-[100px]" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth;