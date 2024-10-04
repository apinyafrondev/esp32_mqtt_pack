// import { useState, useEffect } from "react"
import { FC,useState,useEffect } from 'react';
import axios from 'axios';
import '../../styles/waterpump.css';
import HumidityIcon from '/humidity-low-svgrepo-com.svg';
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
// const HumidityData = [
//     {
//         topic: 1,
//         humidty: 91,
//     },
//     {
//         topic: 1,
//         humidty: 90,
//     }
// ]
const GetDataHumidLatest = async (): Promise<TempResponse[] | undefined> => {
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
const HumidityCard: FC<Temperature> = ({ humidity1 }) => {
    // const [isActive, setIsActive] = useState<boolean>(false);
    // const ChangeOnOff = (number: number) => {
    //     setIsActive(!isActive);
    //     console.log("pump" + number + isActive)
    // }
    return (
        <div className="flex flex-wrap space-x-4 h-full px-5 rounded-3xl shadow-xl bg-gradient-to-r from-cyan-500 to-blue-500">
           <div className={``}>
                <div className="text-4xl font-bold text-slate-800">Humidity <p className="text-white text-7xl">{humidity1} RH%</p></div>
                <div className="w-80 lg:w-96 mb-5">
                    <div className="w-fit bg-slate-50 rounded-full mt-3 ml-auto">
                        <img src={HumidityIcon} width={99} height={99} />
                    </div>
                </div>
            </div>
        </div>
    )
}
const HumidityCardLoading: FC = () => {
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
const HumidityComponents = () => {
    const [HumidDataLatest, SetHumidDataLatest] = useState<TempResponse[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetDataHumidLatest();
                SetHumidDataLatest(data);
                //console.log(HumidDataLatest)
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
            {/* <div className="flex flex-row flex-wrap space-x-4"> */}
            <br />
            <div className="px-5 lg:w-auto h-1/2 mt-auto mb-auto">
            {
                    HumidDataLatest ? (
                        HumidDataLatest.map((item, index) => (
                            <div className="pt-5" key={index}>
                                <HumidityCard temp1c={item.temp1c} time={item.time} humidity1={item.humidity1} humidity2={0} temp1f={0} temp2c={0} temp2f={0} topic={''} />
                                {/* <div>{item.temp1c}</div> */}
                            </div>
                        ))
                    ) : (HumidDataLatest == undefined ? <div className='animate-pulse'><HumidityCardLoading/></div> : <div>Connecting Error . . .</div>) 
                    
                }
                </div>
            {/* </div> */}
        </>
    )
}
export default HumidityComponents