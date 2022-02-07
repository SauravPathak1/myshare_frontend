import React from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import video from '../assets/share.mp4';
import logo from '../assets/logos.png';
import { FaFacebookF } from 'react-icons/fa';

import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    const { name, googleId, imageUrl, email } = response.profileObj;
    localStorage.setItem(
      'user',
      JSON.stringify({ name, id: googleId, image: imageUrl, email })
    );
    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl,
    };
    client.createIfNotExists(doc).then((response) => {
      navigate('/', { replace: true });
    });
  };
  const responseFacebook = (response) => {
    if (response.accessToken) {
      const { name, id, picture, email } = response;
      localStorage.setItem(
        'user',
        JSON.stringify({ name, id, image: picture.data.url, email })
      );
      const doc = {
        _id: id,
        _type: 'user',
        userName: name,
        image: picture.data.url,
      };
      client.createIfNotExists(doc).then((response) => {
        navigate('/', { replace: true });
      });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={video}
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
        <div className='absolute items-center justify-center flex flex-col top-0 left-0 bottom-0 right-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} className='' width='200px' alt='logo' />
          </div>
          <div className='shadow-2xl'>
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              render={(renderProps) => (
                <button
                  className='bg-mainColor flex justify-center items-center p-4 px-5 rounded-lg cursor-pointer outline-none'
                  type='button'
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className='mr-4' />
                  Sign in with Google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy='single_host_origin'
            />
          </div>
          <div className='shadow-2xl mt-6'>
            <FacebookLogin
              appId={process.env.REACT_APP_FB_APP_ID}
              callback={responseFacebook}
              className='bg-mainColor'
              fields='id,email,name,picture'
              render={(renderProps) => (
                <button
                  className='bg-mainColor flex justify-center items-center p-4 px-5 rounded-lg cursor-pointer outline-none'
                  type='button'
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FaFacebookF className='mr-4' />
                  Login with Facebook
                </button>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
