import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import WelcomePage from './pages/WelcomePage.jsx'

// Every page renders inside Layout (header + page + footer)
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<WelcomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
