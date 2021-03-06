import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import theme from '../theme'
import { useEffect } from 'react'

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_BACKEND_URL + '/graphql',
  headers: {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL!,
  },
  cache: new InMemoryCache(),
})

function fetchBackend() {
  fetch(process.env.NEXT_PUBLIC_BACKEND_URL!).then(() =>
    console.log('fetched backend')
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    fetchBackend()
    setInterval(() => {
      fetchBackend()
    }, 1000 * 60 * 29)
  }, [])

  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default MyApp
