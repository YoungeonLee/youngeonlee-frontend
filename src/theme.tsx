import { extendTheme } from '@chakra-ui/react'

// const fonts = { mono: `'Menlo', monospace` }

// const breakpoints = createBreakpoints({
//   sm: '40em',
//   md: '52em',
//   lg: '64em',
//   xl: '80em',
// })

// const theme = extendTheme({
//   colors: {
//     black: '#16161D',
//   },
//   fonts,
//   breakpoints,
// })

const theme = extendTheme({
  components: {
    Popover: {
      variants: {
        responsive: {
          popper: {
            maxWidth: 'unset',
            width: 'unset',
          },
        },
      },
    },
  },
})

export default theme
