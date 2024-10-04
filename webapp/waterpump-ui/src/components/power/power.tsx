// import { useState } from "react"
import { FC } from 'react';
// import powerIcon from '/thunder-svgrepo-com.svg';
// import CostIcon from '/coin-coins-svgrepo-com.svg';
const PowerComponents: FC = () => {
    return (
        <>
            {/* <div className="flex flex-warp h-full rounded-lg shadow-2xl bg-gradient-to-r from-cyan-500 to-blue-500 lg:w-auto mt-auto mb-auto">
              */}
  <div className='text-center text-3xl h-10 font-semibold'> <p className='mt-10'>Power Meter</p></div>
            <div className="flex px-2">
          
                <div className="mx-auto mt-12 grid grid-cols-2 gap-10">
                
                    <div className="rounded-3xl text-center font-semibold h-44 w-44 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-xl">
                        <div className="flex flex-row">
                          
                        </div>

                        {/* <div className="bg-white rounded-full w-16 h-16 mt-9 ml-auto"><img src={powerIcon}/></div> */}
                        <div className="text-white font-bold text-2xl pt-20"> 100 Watt</div>
                    </div>
                    <div className="rounded-3xl text-center font-semibold h-44 w-44 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-xl">
                        <div className="flex flex-row">
                          
                        </div>

                        {/* <div className="bg-white rounded-full w-16 h-16 mt-9 ml-auto"><img src={powerIcon}/></div> */}
                        <div className="text-white font-bold text-2xl pt-20">20 V</div>
                    </div>

                    <div className="rounded-3xl text-center font-semibold h-44 w-44 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-xl">
                        <div className="flex flex-row">
                          
                        </div>

                        {/* <div className="bg-white rounded-full w-16 h-16 mt-9 ml-auto"><img src={powerIcon}/></div> */}
                        <div className="text-white font-bold text-2xl pt-20">200 Amh</div>
                    </div>

                    <div className="rounded-3xl text-center font-semibold h-44 w-44 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-xl">
                        <div className="flex flex-row">
                          
                        </div>

                        {/* <div className="bg-white rounded-full w-16 h-16 mt-9 ml-auto"><img src={powerIcon}/></div> */}
                        <div className="text-white font-bold text-2xl pt-20">100 K/h</div>
                    </div>

                </div>
            </div>
        </>
    )
}
export default PowerComponents