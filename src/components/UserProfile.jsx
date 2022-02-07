import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

import { client } from '../client';
import {
  userCreatedPinsQuery,
  userSavedPinsQuery,
  userQuery,
} from '../utils/utils';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { MdSettingsApplications } from 'react-icons/md';

const randImage =
  'https://source.unsplash.com/1600x900/?nature,photography,technology';

const ActiveBtnStyles =
  'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const inactiveBtnStyles =
  'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = () => {
  const [user, setUser] = useState('');
  const [text, setText] = useState('Created');
  const [isCreated, setIsCreated] = useState(true);
  const [pins, setPins] = useState('');

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => setUser(data[0]));
  }, [userId]);

  useEffect(() => {
    if (text === 'Created') {
      const createPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createPinsQuery).then((data) => setPins(data));
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery).then((data) => setPins(data));
    }
  }, [text, userId]);

  const handleLogoutClick = () => {
    window.localStorage.clear();
    navigate('/login');
  };

  if (!user) return <Spinner message='Loading profile' />;

  return (
    <div className='relative p-2 justify-center items-center h-full'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img
              src={randImage}
              className='w-full h-370 shadow-lg object-cover 2xl:h-510'
              alt='banner-pic'
            />
            <img
              src={user.image}
              className='rounded-full w-20 h-20 shadow-xl mt-10 object-cover 2xl:h-510'
              alt='user-pic'
            />
            <h1 className='font-bold text-3xl text-center mt-3'>
              {user.userName}
            </h1>
            <div className='absolute top-0 z-1 right-0 p-2'>
              {userId === user._id && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  render={(renderProps) => (
                    <button
                      className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
                      type='button'
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color='red' fontSize={21} />
                    </button>
                  )}
                  onLogoutSuccess={handleLogoutClick}
                  cookiePolicy='single_host_origin'
                />
              )}
            </div>
          </div>
          <div className='text-center mt-3 mb-7'>
            <button
              type='button'
              className={`${isCreated ? ActiveBtnStyles : inactiveBtnStyles}`}
              onClick={(e) => {
                setText(e.target.textContent);
                setIsCreated(true);
              }}
            >
              Created
            </button>
            <button
              type='button'
              className={`${isCreated ? inactiveBtnStyles : ActiveBtnStyles}`}
              onClick={(e) => {
                setText(e.target.textContent);
                setIsCreated(false);
              }}
            >
              Saved
            </button>
          </div>
          {pins?.length ? (
            <div className='px-2'>
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>{`${
              isCreated
                ? 'No pins to show here. Please create some pins and come back'
                : 'No pins to show here. Please save some pins and come back.'
            }`}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
