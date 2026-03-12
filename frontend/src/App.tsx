import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@shared/components/layout/MainLayout'
import { HomePage } from '@modules/home/components/HomePage'

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </MainLayout>
  )
}

export default App
