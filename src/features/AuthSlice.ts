/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  FacebookAuthProvider,
} from 'firebase/auth';
import { db, firebaseAuth } from '../config/firebase';
import toast from 'react-hot-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface Istate {
  isLoggedIn: boolean;
  uid: string;
  name: string | null;
  email: string;
  dob: string;
  phoneNumber: string;
  isLoading: boolean;
}

// creating the initial state
const initialState: Istate = {
  isLoggedIn: false,
  uid: '',
  name: '',
  email: '',
  dob: '',
  phoneNumber: '',
  isLoading: false,
};

export interface IuserSignupData {
  name: string;
  email: string;
  password: string;
  dob: string;
  phoneNumber: string;
}

// function to create account using email id
export const createAccountUsingEmail = createAsyncThunk(
  '/auth/signup',
  async (userData: IuserSignupData) => {
    // creating the user account using email and password
    const res = await createUserWithEmailAndPassword(
      firebaseAuth,
      userData.email,
      userData.password
    );

    //  updating the user profile details
    firebaseAuth.currentUser &&
      (await updateProfile(firebaseAuth.currentUser, {
        displayName: userData.name,
      }));

    // adding the DOB and phoneNumber data to firestore
    await setDoc(doc(db, 'user', `${res.user.uid}`), {
      name: userData.name,
      email: userData.email,
      dob: userData.dob,
      phoneNumber: userData.phoneNumber,
    });

    return res.user;
  }
);

// function to create account using google account
export const usingGoogleAuthentication = createAsyncThunk(
  '/auth/google',
  async () => {
    // creating the user account using the google account
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(firebaseAuth, provider);
    const { isNewUser } = getAdditionalUserInfo(res)!;

    if (isNewUser) {
      //  updating the user profile details
      firebaseAuth.currentUser &&
        (await updateProfile(firebaseAuth.currentUser, {
          displayName: res.user.displayName,
        }));

      await setDoc(doc(db, 'user', `${res.user.uid}`), {
        name: res.user.displayName,
        email: res.user.email,
      });
    }

    return res;
  }
);

// function to create account using facebook account
export const usingFacebookAuthentication = createAsyncThunk(
  '/auth/facebook',
  async () => {
    // creating the user account using the google account
    const provider = new FacebookAuthProvider();
    const res = await signInWithPopup(firebaseAuth, provider);
    const { isNewUser } = getAdditionalUserInfo(res)!;

    if (isNewUser) {
      //  updating the user profile details
      firebaseAuth.currentUser &&
        (await updateProfile(firebaseAuth.currentUser, {
          displayName: res.user.displayName,
        }));

      await setDoc(doc(db, 'user', `${res.user.uid}`), {
        name: res.user.displayName,
        email: res.user.email,
      });
    }

    return res;
  }
);

export interface IuserLoginData {
  email: string;
  password: string;
}

// function to login using email and password
export const loginUsingEmail = createAsyncThunk(
  'auth/login',
  async (userData: IuserLoginData) => {
    try {
      // creating the user account using email and password
      const res = await signInWithEmailAndPassword(
        firebaseAuth,
        userData.email,
        userData.password
      );

      console.log('running from auth slice');

      return res.user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  }
);

// function to logout the user
export const logout = createAsyncThunk('/auth/logout', async () => {
  const res = await signOut(firebaseAuth);
  return res;
});

// function to get user data
export const getUserData = createAsyncThunk(
  'getUserData',
  async (id: string) => {
    try {
      // getting the data (user personal details)
      const docRef = await doc(db, 'user', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (error) {
      toast.error('Failed to get user data');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // cases for creating account using email and password
      .addCase(createAccountUsingEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAccountUsingEmail.fulfilled, (state) => {
        toast.success('Account created successfully');
        state.isLoading = false;
      })
      .addCase(createAccountUsingEmail.rejected, (state, action) => {
        const message: string | undefined = action.error.message as string;
        toast.error(message);
        state.isLoading = false;
      })
      // cases for creating account using google authentication
      .addCase(usingGoogleAuthentication.fulfilled, (state) => {
        toast.remove();
        toast.success('Logged in successfully');
        state.isLoggedIn = true;
      })
      .addCase(usingGoogleAuthentication.rejected, () => {
        toast.remove();
        toast.error('Failed to login using google');
      })
      // Cases for creating accoutn using facebook authentication
      .addCase(usingFacebookAuthentication.fulfilled, (state) => {
        toast.remove();
        toast.success('Logged in successfully');
        state.isLoggedIn = true;
      })
      .addCase(usingFacebookAuthentication.rejected, () => {
        toast.remove();
        toast.error('Failed to login using facebook');
      })
      // cases for user login using email and password
      .addCase(loginUsingEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUsingEmail.fulfilled, (state, action) => {
        if (action.payload) {
          toast.remove();
          toast.success('Logged in successfully');
          state.isLoggedIn = true;
          state.uid = action?.payload?.uid;
          state.isLoading = false;
        }
      })
      .addCase(loginUsingEmail.rejected, (state) => {
        toast.remove();
        toast.error('Invalid credentials');
        state.isLoading = false;
      })
      // cases for user logout
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.name = '';
        state.email = '';
        state.dob = '';
        state.phoneNumber = '';
        toast.success('Logout Successful');
      })
      .addCase(logout.rejected, () => {
        toast.error('Failed to logout');
      })
      .addCase(getUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.name = action?.payload?.name;
        state.email = action?.payload?.email;
        state.dob = action?.payload?.dob;
        state.phoneNumber = action?.payload?.phoneNumber;
        state.isLoading = false;
      })
      .addCase(getUserData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// exporting my reducers
// eslint-disable-next-line no-empty-pattern
export const {} = authSlice.actions;

// exporting the slice as default
export default authSlice.reducer;
