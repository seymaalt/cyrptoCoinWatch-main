import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import axios from 'axios'


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        Smurf Coin
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const Login = () => {

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [rememberMe, setRememberMe] = useState(false);
  const [location, setLocation] = useState("/");

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Sayfa yüklendiğinde LocalStorage'dan verileri kontrol et
    const storedemail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    const storedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (storedemail && storedPassword && storedRememberMe) {
      setEmail(storedemail);
      setPassword(storedPassword);
      setRememberMe(storedRememberMe);
    }

  }, []);


  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    const savedPassword = localStorage.getItem(value);
    if (savedPassword) {
      setPassword(savedPassword);
    }
  };

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')
    const password = data.get('password')
    if (!email || !password) {
      //res.status(400).json("E-posta veya şifre eksik");
      alert("E-posta veya şifre eksik")
      return; // İşlemi burada sonlandır
    } else {
      axios.post('http://localhost:3333/users/login', { email, password })
        .then(result => {
          console.log(result)
          if (result.data == "Success") {
            console.log({
              email: data.get('email'),
              password: data.get('password'),
            });
            alert("Form başarıyla gönderildi")
            if (rememberMe) {
              localStorage.setItem('email', email);
              localStorage.setItem('password', password);
              localStorage.setItem('rememberMe', true);
            } else {
              localStorage.removeItem('email');
              localStorage.removeItem('password');
              localStorage.removeItem('rememberMe');
            }

          }
        })
        .catch(err => console.log(err))
    };
  }




  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Giriş Yap
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-Posta"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" type="checkbox" checked={rememberMe} onChange={handleCheckboxChange} />}
              label="Beni Hatırla"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Giriş Yap
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Şifremi Unuttum
                </Link>
              </Grid>
              <Grid item>
                <Link href="" variant="body2">
                  {"Hesabınız yok mu? Üye olun"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default Login