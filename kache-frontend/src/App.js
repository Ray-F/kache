import { ThemeProvider } from 'styled-components'
import theme from './styles/theme'
import MainRouter from './pages/MainRouter'

export default function App() {
  
  return (
    <ThemeProvider theme={theme}>
      <MainRouter />
    </ThemeProvider>
  )
}