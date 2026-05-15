import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { motion, useSpring, useTransform } from 'framer-motion';
import { login, register, clearError } from '../store/slices/authSlice';
import './AuthLanding.css';

const MONTHS = [
  { v: '01', label: 'Jan' },
  { v: '02', label: 'Feb' },
  { v: '03', label: 'Mar' },
  { v: '04', label: 'Apr' },
  { v: '05', label: 'May' },
  { v: '06', label: 'Jun' },
  { v: '07', label: 'Jul' },
  { v: '08', label: 'Aug' },
  { v: '09', label: 'Sep' },
  { v: '10', label: 'Oct' },
  { v: '11', label: 'Nov' },
  { v: '12', label: 'Dec' },
];

function LikeIllustration() {
  return (
    <svg
      className="auth-illustration"
      viewBox="0 0 320 280"
      width="100%"
      height="auto"
      style={{ maxWidth: 360 }}
      aria-hidden
    >
      <defs>
        <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1877F2" />
          <stop offset="100%" stopColor="#0d5dbf" />
        </linearGradient>
      </defs>
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="95" y="40" width="130" height="200" rx="18" fill="url(#phoneGrad)" />
        <rect x="108" y="58" width="104" height="150" rx="6" fill="#f0f2f5" opacity="0.25" />
        <ellipse cx="160" cy="228" rx="10" ry="10" fill="#1a1a1a" opacity="0.35" />
      </motion.g>
      <motion.g
        style={{ transformOrigin: '160px 150px' }}
        animate={{ rotate: [0, 2, -1, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M 155 95 C 130 85 105 100 100 130 L 95 175 C 92 195 105 210 125 212 L 195 215 C 215 216 232 198 228 178 L 218 125 C 212 100 185 88 165 95 Z"
          fill="#fff"
          stroke="#1c1e21"
          strokeWidth="2"
        />
      </motion.g>
      <motion.g
        animate={{ scale: [1, 1.08, 1], y: [0, -4, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M 218 72 C 218 62 208 55 198 58 C 192 52 180 54 176 62 C 172 54 160 52 154 58 C 144 55 134 62 134 72 C 134 88 154 102 176 118 C 198 102 218 88 218 72 Z"
          fill="#fa3e3e"
          stroke="#c32a2a"
          strokeWidth="1"
        />
      </motion.g>
      <motion.circle
        cx="118"
        cy="248"
        r="6"
        fill="#1877F2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle
        cx="202"
        cy="248"
        r="6"
        fill="#1877F2"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

const AuthLanding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const springX = useSpring(0, { stiffness: 48, damping: 18 });
  const springY = useSpring(0, { stiffness: 48, damping: 18 });

  const orb1x = useTransform(springX, (v) => v);
  const orb1y = useTransform(springY, (v) => v);
  const orb2x = useTransform(springX, (v) => -v * 0.7);
  const orb2y = useTransform(springY, (v) => -v * 0.6);
  const orb3x = useTransform(springX, (v) => v * 0.5);
  const orb3y = useTransform(springY, (v) => v * 0.8);

  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => String(y - 13 - i));
  }, []);

  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')), []);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErr, setLoginErr] = useState(null);
  const [loginBusy, setLoginBusy] = useState(false);

  const [regForm, setRegForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    gender: '',
  });
  const [regErr, setRegErr] = useState(null);
  const [regBusy, setRegBusy] = useState(false);

  const onMouseMove = useCallback(
    (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
      springX.set(x * 56);
      springY.set(y * 40);
    },
    [springX, springY]
  );

  const handleLoginChange = (e) => {
    setLoginForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setLoginErr(null);
  };

  const handleRegChange = (e) => {
    setRegForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setRegErr(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginErr(null);
    dispatch(clearError());
    setLoginBusy(true);
    try {
      await dispatch(login(loginForm)).unwrap();
      navigate('/');
    } catch (err) {
      setLoginErr(typeof err === 'string' ? err : 'Login failed');
    } finally {
      setLoginBusy(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegErr(null);
    dispatch(clearError());

    if (regForm.password !== regForm.confirmPassword) {
      setRegErr('Passwords do not match');
      return;
    }
    if (!regForm.birthMonth || !regForm.birthDay || !regForm.birthYear) {
      setRegErr('Please select your full birthday');
      return;
    }
    if (!regForm.gender) {
      setRegErr('Please select your gender');
      return;
    }

    const dateOfBirth = `${regForm.birthYear}-${regForm.birthMonth}-${regForm.birthDay}`;
    const payload = {
      firstName: regForm.firstName.trim(),
      lastName: regForm.lastName.trim(),
      email: regForm.email.trim(),
      password: regForm.password,
      dateOfBirth,
      gender: regForm.gender,
    };

    setRegBusy(true);
    try {
      await dispatch(register(payload)).unwrap();
      navigate('/');
    } catch (err) {
      setRegErr(typeof err === 'string' ? err : 'Registration failed');
    } finally {
      setRegBusy(false);
    }
  };

  return (
    <Box
      onMouseMove={onMouseMove}
      sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <div className="auth-bg-layer" aria-hidden>
        <motion.div className="auth-orb auth-orb-1" style={{ x: orb1x, y: orb1y }} />
        <motion.div className="auth-orb auth-orb-2" style={{ x: orb2x, y: orb2y }} />
        <motion.div className="auth-orb auth-orb-3" style={{ x: orb3x, y: orb3y }} />
        <div className="auth-grid-overlay" />
      </div>

      <Box component="header" className="auth-fb-header auth-content-wrap">
        <Box
          sx={{
            maxWidth: 980,
            mx: 'auto',
            px: 2,
            py: 1.25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            component="span"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.4rem' },
              letterSpacing: '-0.5px',
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            }}
          >
            facebook
          </Typography>

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1.25,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography sx={{ color: '#fff', fontSize: 12, mb: 0.25 }}>Email or Phone</Typography>
              <TextField
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                size="small"
                type="email"
                autoComplete="username"
                sx={{
                  width: 164,
                  bgcolor: '#fff',
                  '& .MuiOutlinedInput-root': { height: 24, fontSize: 13 },
                }}
              />
            </Box>
            <Box>
              <Typography sx={{ color: '#fff', fontSize: 12, mb: 0.25 }}>Password</Typography>
              <TextField
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                size="small"
                type="password"
                autoComplete="current-password"
                sx={{
                  width: 164,
                  bgcolor: '#fff',
                  '& .MuiOutlinedInput-root': { height: 24, fontSize: 13 },
                }}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              disabled={loginBusy}
              sx={{
                bgcolor: '#4267b2',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                py: 0.25,
                px: 1.5,
                minWidth: 50,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: '#365899' },
              }}
            >
              Log In
            </Button>
          </Box>
        </Box>
        {loginErr && (
          <Box sx={{ maxWidth: 980, mx: 'auto', px: 2, pb: 1 }}>
            <Alert severity="error" sx={{ py: 0 }}>
              {loginErr}
            </Alert>
          </Box>
        )}
      </Box>

      <Box
        component="main"
        className="auth-content-wrap"
        sx={{
          flex: 1,
          py: { xs: 3, md: 5 },
          px: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 980,
            mx: 'auto',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: 'space-between',
            gap: { xs: 4, md: 6 },
          }}
        >
          <Box sx={{ flex: 1, maxWidth: 520, pr: { md: 2 } }}>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              style={{
                transform: `translate(${(mouse.x - 0.5) * 12}px, ${(mouse.y - 0.5) * 8}px)`,
              }}
            >
              <LikeIllustration />
              <Typography
                sx={{
                  mt: 2,
                  fontSize: { xs: '1.35rem', sm: '1.6rem' },
                  fontWeight: 700,
                  color: '#1877F2',
                  lineHeight: 1.3,
                }}
              >
                Thanks for stopping by!
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: '1.05rem', color: '#1c1e21' }}>
                We hope to see you again soon.
              </Typography>
            </motion.div>
          </Box>

          <Box sx={{ width: '100%', maxWidth: 432 }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
            >
              <Typography sx={{ fontSize: '2.1rem', fontWeight: 600, color: '#1c1e21' }}>
                Create an account
              </Typography>
              <Typography sx={{ mt: 0.5, mb: 2, color: '#606770', fontSize: '1.05rem' }}>
                It&apos;s free and always will be.
              </Typography>

              {regErr && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {regErr}
                </Alert>
              )}

              <Box component="form" onSubmit={handleRegister}>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="firstName"
                      placeholder="First name"
                      value={regForm.firstName}
                      onChange={handleRegChange}
                      required
                      size="small"
                      sx={{ bgcolor: '#fff' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name="lastName"
                      placeholder="Last name"
                      value={regForm.lastName}
                      onChange={handleRegChange}
                      required
                      size="small"
                      sx={{ bgcolor: '#fff' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="email"
                      placeholder="Mobile number or email"
                      type="email"
                      value={regForm.email}
                      onChange={handleRegChange}
                      required
                      size="small"
                      sx={{ bgcolor: '#fff' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="password"
                      placeholder="Password"
                      type="password"
                      value={regForm.password}
                      onChange={handleRegChange}
                      required
                      size="small"
                      sx={{ bgcolor: '#fff' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="confirmPassword"
                      placeholder="Confirm password"
                      type="password"
                      value={regForm.confirmPassword}
                      onChange={handleRegChange}
                      required
                      size="small"
                      sx={{ bgcolor: '#fff' }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#606770', mb: 0.5 }}>
                      Birthday
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      <FormControl size="small" sx={{ minWidth: 110, bgcolor: '#fff' }}>
                        <TextField
                          select
                          name="birthMonth"
                          value={regForm.birthMonth}
                          onChange={handleRegChange}
                          size="small"
                          SelectProps={{ native: true }}
                        >
                          <option value="">Month</option>
                          {MONTHS.map((m) => (
                            <option key={m.v} value={m.v}>
                              {m.label}
                            </option>
                          ))}
                        </TextField>
                      </FormControl>
                      <FormControl size="small" sx={{ minWidth: 76, bgcolor: '#fff' }}>
                        <TextField
                          select
                          name="birthDay"
                          value={regForm.birthDay}
                          onChange={handleRegChange}
                          size="small"
                          SelectProps={{ native: true }}
                        >
                          <option value="">Day</option>
                          {days.map((d) => (
                            <option key={d} value={d}>
                              {parseInt(d, 10)}
                            </option>
                          ))}
                        </TextField>
                      </FormControl>
                      <FormControl size="small" sx={{ minWidth: 92, bgcolor: '#fff' }}>
                        <TextField
                          select
                          name="birthYear"
                          value={regForm.birthYear}
                          onChange={handleRegChange}
                          size="small"
                          SelectProps={{ native: true }}
                        >
                          <option value="">Year</option>
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </TextField>
                      </FormControl>
                      <Link
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        sx={{ fontSize: 11, maxWidth: 160, lineHeight: 1.2 }}
                      >
                        Why do I need to provide my date of birth?
                      </Link>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset" variant="standard">
                      <FormLabel component="legend" sx={{ fontSize: 13, fontWeight: 600, color: '#606770' }}>
                        Gender
                      </FormLabel>
                      <RadioGroup
                        row
                        name="gender"
                        value={regForm.gender}
                        onChange={handleRegChange}
                        sx={{ gap: 2, mt: 0.5 }}
                      >
                        <FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
                        <FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography sx={{ fontSize: 11, color: '#777', lineHeight: 1.35 }}>
                      By clicking Sign Up, you agree to our Terms, Data Policy and Cookies Policy. You may receive SMS
                      notifications from us and can opt out at any time.
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={regBusy}
                      sx={{
                        bgcolor: '#42b72a',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        px: 4,
                        py: 1.25,
                        textTransform: 'none',
                        minWidth: 200,
                        boxShadow: 'inset 0 1px 1px #a4e388',
                        '&:hover': { bgcolor: '#36a420' },
                      }}
                    >
                      {regBusy ? 'Creating account…' : 'Sign Up'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLanding;
