import { redirect } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import authState from 'recoil/auth';
import Swal from 'sweetalert2';

export default function Login() {
  const login = useSetRecoilState(authState);
  let errorTitle: string | null = null;
  let errorMessage: string | null = null;

  // STEP 1
  // check for errors from backend
  const errorParam = new URLSearchParams(window.location.search).get('error');
  const errorDescription = new URLSearchParams(window.location.search).get(
    'error_description'
  );

  if (errorParam) {
    // most common error is the access_denied error
    errorTitle = errorParam === 'access_denied' ? 'Access Denied' : errorParam;
    errorMessage = errorDescription;
  }

  // STEP 2
  // get tokens from url search pararms
  const accessToken = new URLSearchParams(window.location.search).get(
    'access_token'
  );
  const refreshToken = new URLSearchParams(window.location.search).get(
    'refresh_token'
  );

  if (accessToken && refreshToken) {
    login({ accessToken, refreshToken });
  } else if (!errorTitle) {
    errorTitle = 'Something went wrong';
    errorMessage = 'No authentication tokens provided';
  }

  // STEP 3
  // display any errors
  if (errorTitle) {
    Swal.fire({
      title: errorTitle,
      text: errorMessage ?? undefined,
      icon: 'error',
    });
  }

  redirect('/');
  return <>You shouldn't be here</>;
}
