import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import theme from '../theme'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default MyApp
