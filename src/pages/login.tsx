import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

import FormInput from '../components/FormInput';
import {
  usingGoogleAuthentication,
  loginUsingEmail,
  usingFacebookAuthentication,
} from '../features/AuthSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';

const loginSchema = z.object({
  email: z.string().nonempty('Email is required').email('Email is invalid'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

type TLogin = z.TypeOf<typeof loginSchema>;

export default function Login() {
  const [loading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const methods = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitHandler: SubmitHandler<TLogin> = async (values) => {
    // function to handle login using email and password
    // checking the empty fields
    if (!values.email || !values.password) {
      toast.error('All fields are required');
      return;
    }

    const resp = await dispatch(loginUsingEmail(values));

    // clearing the state
    if (resp.payload) {
      reset();
      navigate('/upload');
    }
  };

  return (
    <Box sx={{ maxWidth: '30rem' }} margin="auto" marginTop={8}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: '2rem' }}
        align="center"
      >
        Login
      </Typography>
      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <FormInput
            name="email"
            required
            fullWidth
            label="Email Address"
            type="email"
            sx={{ mb: 2 }}
          />
          <FormInput
            name="password"
            required
            fullWidth
            label="Password"
            type="password"
            sx={{ mb: 2 }}
          />

          <LoadingButton
            variant="contained"
            fullWidth
            type="submit"
            loading={loading}
            sx={{ py: '0.8rem', mt: '1rem' }}
            disabled={isSubmitting}
          >
            Login
          </LoadingButton>
        </Box>
      </FormProvider>

      <Button
        onClick={() => dispatch(usingGoogleAuthentication())}
        fullWidth
        sx={{ py: '0.8rem', mt: '1rem' }}
      >
        <GoogleIcon />{' '}
        <span style={{ marginLeft: '0.5rem' }}>Continue with Google</span>
      </Button>

      <Button
        onClick={() => dispatch(usingFacebookAuthentication())}
        fullWidth
        sx={{ py: '0.8rem', mt: '1rem' }}
      >
        <FacebookIcon />{' '}
        <span style={{ marginLeft: '0.5rem' }}>Continue with Facebook</span>
      </Button>

      <Typography align="center" marginTop={2}>
        Don't already have an account? <Link to={'/register'}>register</Link>
      </Typography>
    </Box>
  );
}
