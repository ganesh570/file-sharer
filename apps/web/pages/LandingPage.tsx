import LandingBar from "../components/landing/LandingBar";
import LandingHero from "../components/landing/LandingHero";

const LandingPage=()=>{
    return (
        <main className="h-screen bg-[#0058af] overflow-auto scroll-auto">
         <div className="mx-auto max-w-screen-lg h-full w-full">
        <div className="h-full">
             <LandingBar/>
             <LandingHero/>
        </div>
        </div>
        </main>
    )
}

export default LandingPage;