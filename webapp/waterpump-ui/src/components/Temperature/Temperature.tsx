// import { useState, useEffect } from "react"
import { FC, useEffect,useState } from 'react';
import axios from 'axios';
import '../../styles/waterpump.css';
import TempIcon from '/temperature-high-com.svg';
interface Temperature {
    time: string,
    humidity1: number,
    humidity2: number,
    temp1c: number,
    temp1f: number,
    temp2c: number,
    temp2f: number,
    topic: string
}
// const TempData = [
//     {
//         topic: 1,
//         temp: 35,
//     },
//     {
//         topic: 1,
//         temp: 34,
//     }
// ]
type TempResponse = {
    time: string,
    humidity1: number,
    humidity2: number,
    temp1c: number,
    temp1f: number,
    temp2c: number,
    temp2f: number,
    topic: string
}
const GetDataTempLatest = async (): Promise<TempResponse[] | undefined> => {
    try {
        const response = await axios.get<TempResponse[]>('http://localhost:3100/temp/api/query/v1/state');
        //console.log(response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error to fetch data, please try again:', error.message);
        } else {
            console.error('Unexpected error because server connection is down:', error);
        }
    }
}
const TemperatureCard: FC<Temperature> = ({temp1c}) => {
    // const [isActive, setIsActive] = useState<boolean>(false);
    // const ChangeOnOff = (number: number) => {
    //     setIsActive(!isActive);
    //     console.log("pump" + number + isActive)
    // }
    useEffect(()=>{
    },[])
    return (
        <div className="flex flex-row flex-wrap h-full px-5 rounded-3xl shadow-xl bg-gradient-to-r from-orange-500 to-yellow-200">
            <div className={``}>
                <div className="text-4xl font-bold text-slate-800">temp <p className="text-white text-7xl">{temp1c} ℃</p></div>
                <div className="w-80 lg:w-96 mb-5">
                    <div className="w-fit bg-slate-50 rounded-full mt-3 ml-auto">
                        <img src={TempIcon} width={99} height={99} />
                    </div>
                </div>
            </div>
        </div>
    )
}
const TemperatureCardLoading: FC = () => {
    // const [isActive, setIsActive] = useState<boolean>(false);
    // const ChangeOnOff = (number: number) => {
    //     setIsActive(!isActive);
    //     console.log("pump" + number + isActive)
    // }
    useEffect(()=>{
    },[])
    return (
        <div className="flex flex-row flex-wrap h-full px-5 rounded-3xl shadow-xl bg-gradient-to-r from-slate-300 to-slate-200">
            <div className={``}>
                <div className="text-4xl font-bold text-slate-800"><p className="text-white text-7xl"></p></div>
                <div className="w-80 lg:w-96 mb-5">
          
                  <div className="w-52 h-52"></div>
                
                </div>
            </div>
        </div>
    )
}
const TempuratureComponents = () => {
    const [TempDataLatest, SetTempDataLatest] = useState<TempResponse[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetDataTempLatest();
                SetTempDataLatest(data);
                //console.log(TempDataLatest)
            } catch (error) {
                console.log("server connection error please contact admin!");
            }
        };
        setInterval(() => {
            fetchData();
        }, 1000)
    }, [])
    return (
        <>
            <br />
            <div className="px-5 lg:w-auto h-1/2 mt-auto mb-auto">
            {
                    TempDataLatest ? (
                        TempDataLatest.map((item, index) => (
                            <div className="pt-5" key={index}>
                                <TemperatureCard temp1c={item.temp1c} time={item.time} humidity1={0} humidity2={0} temp1f={0} temp2c={0} temp2f={0} topic={''} />
                                {/* <div>{item.temp1c}</div> */}
                            </div>
                        ))
                    ) : (TempDataLatest == undefined ? <div className='animate-pulse'><TemperatureCardLoading/></div> : <div>Connecting Error . . .</div>) 
                    
                }
                
            </div>

        </>
    )
}
export default TempuratureComponents