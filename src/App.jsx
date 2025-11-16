import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PaymentPage from './Page/PaymentPage'
import SubscriptionPage from './Page/SubscriptionPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SubscriptionPage />
      {/* <PaymentPage /> */}
    </>
  )
}

export default App
