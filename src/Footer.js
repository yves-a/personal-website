import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import EmailIcon from '@mui/icons-material/Email'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import { createTheme, ThemeProvider } from '@mui/material/styles'
const theme = createTheme()
theme.typography.h3 = {
  fontSize: '2rem',
  '@media (min-width:600px)': {
    fontSize: '2rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '4rem',
  },
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
const Footer = () => {
  return (
    <Container sx={{ minHeight: '150px', m: 2 }}>
      <ThemeProvider theme={theme}>
        <Typography variant="h3" component="div" gutterBottom align="left">
          Get in Touch.
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          I am always excited to discuss my experiences and framework.
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          Connect with me through LinkedIn or send me an email.
        </Typography>
        <Typography variant="h6" component="div" gutterBottom>
          Looking forward to hearing from you!
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <a href="mailto:yalikalfic@yahoo.com" id="footer">
              <EmailIcon sx={{ color: 'black' }} />
            </a>
          </Grid>
          <Grid item xs={1}>
            <a href="https://www.linkedin.com/in/yves-alikalfic-621b45220/">
              <LinkedInIcon sx={{ color: 'black' }} />
            </a>
          </Grid>
          <Grid item xs={1}>
            <a href="https://github.com/yves-a">
              <GitHubIcon sx={{ color: 'black' }} />
            </a>
          </Grid>
        </Grid>
      </ThemeProvider>
    </Container>
  )
}

export default Footer
