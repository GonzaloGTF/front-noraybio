import { useState } from 'react'
import './App.css'
import InfoJaulas from './components/InfoJaulas'
import ErrorContext from './ErrorContext';
import AnimalesContext from './AnimalesContext';

function App() {

  const [error, setError] = useState(null)
  const [infoAnimales, setInfoAnimales] = useState(null)
  const [inciAnimData, setInciAnimData] = useState(null)
  const [inciData, setInciData] = useState(null)
  return (
    <ErrorContext.Provider value={{ error, setError }}>
      <AnimalesContext.Provider value={{
        infoAnimales, setInfoAnimales,
        inciAnimData, setInciAnimData,
        inciData, setInciData
      }}>

        <InfoJaulas />

      </AnimalesContext.Provider>
    </ErrorContext.Provider>
  )
}

export default App
