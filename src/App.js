import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Projects from './Projects'
import Container from '@mui/material/Container'
import Footer from './Footer'
import { createTheme, ThemeProvider } from '@mui/material/styles'
// import avatar from './img/avatar.jpeg'
import avatorBg from './img/avatar-no-bg.png'
const theme = createTheme()

theme.typography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Canela"',
    'Raleway',
    'Ubuntu',
  ].join(','),
}
theme.typography.h5 = {
  fontSize: '1.5rem',
  '@media (min-width:500px)': {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.8rem',
  },
}

theme.typography.h6 = {
  fontSize: '1.2rem',
  '@media (min-width:500px)': {
    fontSize: '1.2rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.5rem',
  },
}

theme.typography.h1 = {
  fontSize: '3rem',
  '@media (min-width:600px)': {
    fontSize: '6rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '6rem',
  },
}

const App = () => {
  return (
    <Box
      className="App"
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        margin: 0,
        padding: 0,
        fontFamily: 'Ubuntu',
        minWidth: 500,
      }}
    >
      <Container
        maxWidth="100%"
        sx={{
          m: 2,
          padding: 0,
          margin: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: '#fdd0d4',
          minHeight: '700px',
          position: 'relative',
        }}
      >
        <Box sx={{ flexGrow: 1, maxWidth: '100%' }}>
          <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>
              <Button
                href="/#yves"
                color="inherit"
                style={{ textTransform: 'lowercase' }}
              >
                Yves.
              </Button>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
              ></Typography>
              <Button
                href="/#projects"
                color="inherit"
                style={{ textTransform: 'lowercase' }}
              >
                projects.
              </Button>
              <Button
                href="/#footer"
                color="inherit"
                style={{ textTransform: 'lowercase' }}
              >
                contact.
              </Button>
            </Toolbar>
          </AppBar>
        </Box>
        <Container
          maxWidth="100%"
          sx={{
            m: 2,
          }}
          id="yves"
        >
          <Box
            sx={{
              m: 6,
              position: 'absolute',
              left: 0,
            }}
          >
            <ThemeProvider theme={theme}>
              <Typography
                variant="h1"
                component="div"
                align="left"
                color="#9fb5ff"
                gutterBottom
                sx={{ marginBottom: 2 }}
              >
                Yves Alikalfic.
              </Typography>

              <Typography
                variant="h5"
                component="div"
                align="left"
                gutterBottom
              >
                Computer Science student from Canada.
              </Typography>
              <Typography
                variant="h6"
                component="div"
                align="left"
                gutterBottom
              >
                Looking to expand my knowledge{' '}
                <Typography display="block"></Typography>and understanding in
                the fields of business and technology.
              </Typography>
            </ThemeProvider>
          </Box>
          {/* <Box
            component="img"
            sx={{
              width: { xs: '30%', md: '23%' },
              borderRadius: '4%',
              position: 'absolute',
              right: { xs: '30%', md: '10%' },
              bottom: 0,
            }}
            alt="Yves"
            src={avatorBg}
          /> */}
        </Container>
      </Container>
      {/* <Projects /> */}
      <Footer />
    </Box>
  )
}

export default App
