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
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import {
  createAccountUsingEmail,
  usingFacebookAuthentication,
  usingGoogleAuthentication,
} from '../features/AuthSlice';

const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty('Name is required')
      .max(32, 'Name must be less than 100 characters'),
    email: z.string().nonempty('Email is required').email('Email is invalid'),
    phoneNumber: z
      .string()
      .nonempty('Phone number is required')
      .max(15, 'Phone number must be less than 15 digits')
      .min(10, 'Phone number must be atleast 10 digits'),
    dob: z.string().nonempty('Date of Birth is required'),
    password: z
      .string()
      .nonempty('Password is required')
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: z.string().nonempty('Please confirm your password'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  });

type TRegister = z.TypeOf<typeof registerSchema>;

const Register = () => {
  const [loading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const methods = useForm<TRegister>({
    resolver: zodResolver(registerSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitHandler: SubmitHandler<TRegister> = async (values) => {
    if (
      !values.email ||
      !values.name ||
      !values.password ||
      !values.dob ||
      !values.phoneNumber
    ) {
      toast.error('All fields are required');
      return;
    }

    const resp = await dispatch(createAccountUsingEmail(values));

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
        Register
      </Typography>
      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <FormInput
            name="name"
            required
            fullWidth
            label="Name"
            sx={{ mb: 2 }}
          />
          <FormInput
            name="email"
            required
            fullWidth
            label="Email Address"
            type="email"
            sx={{ mb: 2 }}
          />
          <FormInput
            name="phoneNumber"
            required
            fullWidth
            label="Phone Number"
            type="string"
            sx={{ mb: 2 }}
          />
          <FormInput
            name="dob"
            required
            fullWidth
            label="Date of Birth"
            InputLabelProps={{ shrink: true }}
            type="date"
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
          <FormInput
            name="passwordConfirm"
            required
            fullWidth
            label="Confirm Password"
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
            Register
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
        Already have an account? <Link to={'/login'}>Login</Link>
      </Typography>
    </Box>
  );
};

export default Register;
