import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DrawerLayout from '../components/DrawerLayout';
import Head from 'next/head';
import useLocalStorage from '../util/use-local-storage';

import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  const [channels, setChannels] = useLocalStorage("channels", [])
  const theme = createTheme({
      palette: {
        mode: 'dark'
      }
    })
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Head>
        <title>Simple Youtube Clone</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DrawerLayout channels={channels}>
        <Component {...pageProps} />
      </DrawerLayout>
    </ThemeProvider>
  )
}