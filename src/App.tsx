import { ChevronRightIcon, PartyPopperIcon } from "lucide-react";

function App() {

  return (
    <>
      {/* Navigation */}
      <nav className="bg-background fixed w-full z-20 top-0 border-b border-divider min-w-xs">
        <div className="flex items-center justify-between p-4 md:py-0 md:px-8">

          <a href="/">
            <img src="/logos/duri.svg" className="h-5" alt="Duri Text Logo" />
          </a >

          <div className="inline-flex items-center gap-3 md:py-4">
            {/* TODO: Update href */}
            <a href="/" className="text-on-background font-normal text-sm hover:opacity-70">Log in</a>

            {/* TODO: Update href */}
            <a href="/">
              <button type="button" className="text-on-brand bg-brand hover:bg-transparent hover:text-brand box-border border-2 border-transparent hover:border-brand font-normal leading-5 rounded-xs text-sm px-3 py-[5px] md:px-5 md:py-2.5 focus:outline-none transition-colors duration-500 cursor-pointer">Sign Up</button>
            </a>
          </div>

        </div>
      </nav>

      <div className="w-full mt-[67px] md:mt-[77px] min-w-xs relative">
        <div className="absolute inset-0 bg-size-[105px_105px] bg-[linear-gradient(90deg,rgba(0,0,0,.55)_1px,transparent_0),linear-gradient(180deg,rgba(0,0,0,.55)_1px,transparent_0)] opacity-10 z-5" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#fff,transparent)] z-10" />
        <div className="w-full py-22.5 flex flex-col justify-center items-center text-center relative z-15">
          {/* TODO: Add onClick handler */}
          <div className="mb-14 border border-divider rounded-xs py-3 px-4 bg-background flex items-center gap-2 text-on-background hover:bg-on-background hover:text-on-brand hover:cursor-pointer">
            <PartyPopperIcon className="w-5 h-5 transition-colors duration-200" />
            <span className="text-xl transition-colors duration-200">Introducing Duri: AI business operator with a collaborative workspace.</span>
            <ChevronRightIcon className="w-5 h-5 transition-colors duration-200" />
          </div>
          <img src="/logos/d.svg" className="h-20" alt="Duri Initial Logo" />
          <h1 className="mt-5 text-7xl text-on-background">We automate back-office tasks.</h1>
          <p className="mt-3.75 text-2xl text-on-background-secondary">An AI business operator for small and medium businesses.</p>
          <div className="mt-10 flex items-start gap-6">
            <div>
              {/* TODO: Update href */}
              <a href="/">
                <button type="button" className="text-on-brand bg-brand hover:bg-transparent hover:text-brand box-border border border-transparent hover:border-brand font-normal leading-5 rounded-xs text-2xl px-3 py-[5px] md:px-8 md:py-6 focus:outline-none transition-colors duration-500 cursor-pointer">Try for free</button>
              </a>
              <p className="mt-3 text-sm text-on-background-secondary">No credit card required.</p>
            </div>
            {/* TODO: Update href */}
            <a href="/">
              <button type="button" className="text-on-background bg-transparent box-border border border-on-background hover:bg-on-background hover:text-on-brand font-normal leading-5 rounded-xs text-2xl px-3 py-[5px] md:px-8 md:py-6 focus:outline-none transition-colors duration-500 cursor-pointer">Log in</button>
            </a>
          </div>
        </div>
      </div >
    </>
  )
}

export default App
