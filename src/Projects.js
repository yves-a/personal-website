import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea } from '@mui/material'
import Grid from '@mui/material/Grid'
// import { Container } from '@mui/system'
import Box from '@mui/material/Box'
import checker from './img/product-checker.png'
import spotify from './img/spotify.png'
import medical from './img/medical.png'
import { createTheme, ThemeProvider } from '@mui/material/styles'
const theme = createTheme()
theme.typography.h3 = {
  fontSize: '2rem',
  fontFamily: ['Roboto'],
  '@media (min-width:600px)': {
    fontSize: '2rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '4rem',
  },
}

theme.typography.h5 = {
  fontSize: '0.76rem',
  fontFamily: ['Roboto'],
  '@media (min-width:400px)': {
    fontSize: '0.76rem',
  },
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2rem',
  },
}
theme.typography.body2 = {
  fontFamily: ['Roboto'],
  fontSize: '0.7rem',
  '@media (min-width:400px)': {
    fontSize: '0.7rem',
  },
  '@media (min-width:600px)': {
    fontSize: '1.1rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.2rem',
  },
}
const Projects = () => {
  return (
    <Box
      sx={{
        m: 2,
        paddingTop: 2,
        paddingLeft: 1,
        paddingBottom: 10,
        paddingRight: 1,
        margin: 0,
        width: '100%',
        height: '50vh',
        backgroundColor: '#fff5f7',
        minHeight: '500px',
        minWidth: 300,
      }}
    >
      <ThemeProvider theme={theme}>
        <Typography variant="h3" component="div" align="left" gutterBottom>
          Projects.
        </Typography>
        <Grid container spacing={1.5}>
          <Grid item xs={4}>
            <Card sx={{ maxWidth: 500 }}>
              <a
                href="https://github.com/yves-a/product-checker"
                style={{ textDecoration: 'none', color: 'black' }}
                id="projects"
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={checker}
                    alt="product checker"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Product Information Monitor
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Python program that recieves input from the user, and
                      returns the respective product and relevant information.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </a>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ maxWidth: 500 }}>
              <a
                href="https://spotify-web-app-yves.herokuapp.com/"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={spotify}
                    alt="spotify web app"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Reminiscing Record Player
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      React program that allows the user to see their top 10
                      most listened to songs from the past month, and make a
                      playlist out of their top hits, using the Spotify API.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </a>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ maxWidth: 500 }}>
              <a
                href="https://github.com/yves-a/medical-record-application"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={medical}
                    alt="medical record application"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Medical Record Application
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      React application that allows doctors to handle diagnoses
                      and necessary health information for their patients with
                      the help of TypeScript.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </a>
            </Card>
          </Grid>
        </Grid>
      </ThemeProvider>
    </Box>
  )
}
export default Projects
