import { useState, useEffect } from "react"
import { FC } from 'react';
import axios from 'axios';
import FanIcon from '/fan-black-silhouette-svgrepo-com.svg';
// import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import '../../styles/waterpump.css';
// import ChangeColor from "../changeColor/changeColor";
// interface TitleProps {
//     title: string;
//     subtitle?: string;
// }
interface CardFanProps {
    id: number,
    fan_name: string,
    status: number,
}
// interface Pump {
//     pump_id: number,
//     pump_name: string
// }
// interface TitleProps {
//     title: string;
//     subtitle?: string;
// }

// const Title: FC<TitleProps> = ({ title, subtitle }) => {
//     return (
//         <>
//             <h1>{title}</h1>
//             <h2>{subtitle}</h2>
//         </>
//     );
// };

type FanResponse = {
    id: number,
    fan_name: string,
    status: number,
}
const FanCard: FC<CardFanProps> = ({ id, status }) => {

    const [isActive, setIsActive] = useState<boolean>(false);
    // const [statusPost,SetStatusPost] = useState<number>(status);
    // console.log(+pump_id+" status "+statusPost)
    const ChangeOnOff = (number: number) => {
        // setIsActive(!isActive);
        if (status == 1) {
            PostDataOnOffWaterPumps(number, 0);
        }
        else if (status == 0) {
            PostDataOnOffWaterPumps(number, 1);
        }

        console.log("pump" + number + isActive + " status" + status)
    }
    useEffect(() => {

        GetDataOnOffWaterPumps();
        status == 1 ? setIsActive(true) : setIsActive(false);
    })
    return (
        <div className="bg-slate-150 px-5 pt-5 pb-5 border-slate-100 border-2 rounded-3xl shadow-xl">

            <div className="flex flex-col space-x-5 lg:flex-row">
                {
                    <div className="">
                        {/* <div className={`onoff-pump card border-2 rounded-lg border-cyan-400 shadow-md`+`${onPump === 0 ? 'selected' : ''}`} onClick={() => ChangeOnOff(pump.pump_id)}> */}
                        <div className={`card border-2 rounded-3xl border-cyan-100 shadow-md cursor-pointer ` + `${isActive ? 'bg-green-400' : 'bg-cyan-100'}`} onClick={() =>
                            ChangeOnOff(id)
                        }>

                            <img src={FanIcon} width={150} height={150} />
                        </div>
                    </div>

                }
            </div>
        </div>
    )
}
const FanCardLoading = () => {
    return (
        <div className="bg-slate-150 px-5 pt-5 pb-5 border-slate-100 border-2 rounded-3xl shadow-xl w-full">

            <div className="flex flex-col space-x-5 lg:flex-row">
        
                        <div className={`card rounded-3xl shadow-md cursor-pointer bg-slate-100`}>

                        </div>  
                         
               
            </div>
            
        </div>
    )
}
interface PostData {
    id: number,
    // fan_name: string,
    status: number,
    //
}

const PostDataOnOffWaterPumps = async (number: number, status: any) => {
    const postData: PostData = {
        id: number,
        // fan_name: "waterpump1",
        status: status,
        // details: "ปั้มน้ำ 1"
    };
    try {
        const response = await axios.patch<FanResponse>('http://localhost:3100/fan/api/onoff/v1/', postData);
        console.log(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}
const GetDataOnOffWaterPumps = async (): Promise<FanResponse[] | undefined> => {
    try {
        const response = await axios.get<FanResponse[]>('http://localhost:3100/fan/api/onoff/v1/state');
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
const FanComponents = () => {
    // const [onPump, SetOnPump] = useState<number>(0);
    // const [onPump2, SetOnPump2] = useState<number>(0);
    const [FanState, SetFanState] = useState<FanResponse[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetDataOnOffWaterPumps();
                SetFanState(data);
            } catch (error) {
                console.log("server connection error please contact admin!");
            }
        };
        setInterval(() => {
            fetchData();
        }, 1000)

    }, []
    )
    return (
        <>
            <div className="flex flex-warp flex-row">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 w-fit px-14 pt-14 pb-10 pr-auto">
                    {
                        FanState ? (
                            FanState.map((item) => (
                                <div key={item.id} className="pt-5">
                                    <FanCard id={item.id} fan_name={item.fan_name} status={item.status} />
                                </div>
                            ))
                        ) : (FanState == undefined ? <div className="animate-pulse"><FanCardLoading/></div> : <div>wait . . .</div>)
                    }
                </div>
            </div>
        </>
    )

}
export default FanComponents

{/* <div key={fan.id} className="pt-5">
                                <FanCard id={fan.id} fan_name={fan.fan_name}status={fan.status} />
                            </div> */}