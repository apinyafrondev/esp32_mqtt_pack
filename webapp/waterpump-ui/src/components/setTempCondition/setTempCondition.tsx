import { FC,useState,useEffect } from "react"
import axios from "axios";
interface SetPointData {
    id:number,
    num:number;
}
const UpdateDataSetPoint = async (number: number, setValueNum: any) => {
    const UpdateData: SetPointData = {
        id: number,
        // fan_name: "waterpump1",
        num: setValueNum,
        // details: "ปั้มน้ำ 1"
    };
    try {
        const response = await axios.patch<SetPointData>('http://localhost:3100/setpoint/api/v1/temp', UpdateData);
        console.log(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}
const SetTempCondition: FC = () => {
    // const [PointNum,SetPointNum] = useState();
    const [Number,SetNumber] = useState<string>();
    const handleClickSetNum = ()=>{
        UpdateDataSetPoint(1,Number);
        console.log(Number);
    }
    useEffect(()=>{
       
    })
    return (
        <>
            <div className="bg-white rounded-lg border-2 px-5 h-64 shadow-xl lg:mt-20">
        
                    <div className="text-center"><h1 className="text-slate-800 text-2xl">ตั้งค่าเงื่อนไขอุณหภูมิ</h1></div>
                    <div className=" mx-auto w-auto text-center space-x-5">
                        <input type="text" name="" id="" className="mt-5 h-10 rounded-lg border-2 bg-slate-100 text-center font-medium" placeholder="ค่าก่อนหน้า 30" onChange={(e)=>SetNumber(e.target.value)}/>
                        <button className="bg-sky-500 px-10 rounded-lg h-10 text-slate-50 font-bold hover:bg-green-500"onClick={handleClickSetNum}>enter</button>
                    </div>
                    <br />
                    <div className="text-center"><h1 className="text-slate-800 text-2xl">ตั้งค่าเงื่อนไขความชื้นสัมพัทธ์</h1></div>
                    <div className=" mx-auto w-auto text-center space-x-5">
                        <input type="text" name="" id="" className="mt-5 h-10 rounded-lg border-2 bg-slate-100 text-center font-medium" placeholder="ค่าก่อนหน้า 30" />
                        <button className="bg-sky-500 px-10 rounded-lg h-10 text-slate-50 font-bold hover:bg-green-500">enter</button>
                    </div>
                
            </div>

        </>
    )
}
export default SetTempCondition