import '../../index.css'

import Hero from './HeroSection'
import HomeDesc from './HomeDesc/index'
import HomePotcast from './HomePotcast/index'



const index = () => {
  return (
    <div className="overflow-x-hidden w-full max-w-[100vw]">
        <Hero />
        <HomeDesc />
       <div className="bg-gradient-to-br from-black to-stone-900 w-full">
        <HomePotcast />
       </div>
    </div>
  )
}    
export default index