import FanComponents from './components/fans/fans'
import HumidityComponents from './components/Humidity/Humidity'
import PowerComponents from './components/power/power'
import PumpOnOff from './components/pumps/pumpsOnOff'
import TempuratureComponents from './components/Temperature/Temperature'
import SetTempCondition from './components/setTempCondition/setTempCondition'
function App() {
  return (
    <div className='w-fit mx-auto'>
      <div className='flex flex-col lg:flex-row'>
        <div>
          <PumpOnOff />
          <PowerComponents />

        </div>
        <div className='space-y-5'>
          <TempuratureComponents />
          <HumidityComponents />
        </div>

        <div className='space-y-5'>
          <TempuratureComponents />
          <HumidityComponents />
        </div>


      </div>
      <div className='flex flex-wrap mt-14'>
        <FanComponents />
        <SetTempCondition />
      </div>

    </div>
  )
}

export default App
