import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { urlFor, client } from '../client';
import { fetchUser } from '../utils/utils';

const Pin = ({ pin: { postedBy, image, _id, destination, save }, isOwner }) => {
  const [togglePinFocus, setTogglePinFocus] = useState(false);
  const [savePin, setSavePin] = useState(false);
  const navigate = useNavigate();
  const user = fetchUser();
  const handleSaveButtonClick = (id) => {
    if (!pinSaved) {
      setSavePin(true);
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [
          {
            _key: uuidv4(),
            userId: user?.id,
            postedBy: { _ref: user?.id, _type: 'postedBy' },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setSavePin(false);
        });
    }
  };

  const handleDeleteButtonClick = (id) => {
    client.delete(id).then(() => window.location.reload());
  };

  const pinSaved = save?.filter(
    (eachpin) => eachpin?.postedBy?._id === user?.id
  )?.length
    ? true
    : false;

  return (
    <div className='m-2'>
      <div
        className='relative cursor-zoom-in w-auto hover:shadow-lg overflow-hidden rounded-lg transition-all duration-500 ease-in-out'
        onMouseEnter={() => setTogglePinFocus(true)}
        onMouseLeave={() => setTogglePinFocus(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
      >
        <img
          src={urlFor(image).width(250).url()}
          className='rounded-lg w-full'
          alt='user-post'
        />
        {togglePinFocus && (
          <div
            className='justify-between absolute top-0 h-full w-full flex flex-col p-2 pr-2 pt-2 pb-2 z-50 '
            style={{ height: '100%' }}
          >
            <div className='flex items-center justify-between'>
              <div className='flex gap-2 w-full justify-between'>
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className='bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                >
                  <MdDownloadForOffline />
                </a>
                {pinSaved ? (
                  <button
                    type='button'
                    className='bg-red-500 opacity-70 text-white font-bold px-5 py-1 text-base rounded-3xl outline-none hover:opacity-100 hover:shadow-md'
                  >
                    Saved {save?.length}
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveButtonClick(_id);
                    }}
                    className='bg-red-500 opacity-70 text-white font-bold px-5 py-1 text-base rounded-3xl outline-none hover:opacity-100 hover:shadow-md'
                  >
                    {savePin ? 'Saving' : 'Save'}
                  </button>
                )}
              </div>
            </div>
            <div className='flex justify-between w-full items-center gap-2'>
              {destination && (
                <a
                  className='bg-white flex items-center gap-2 text-black font-bold p-2 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                  href={destination}
                  rel='noreferrer'
                  target='_blank'
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination?.length > 15
                    ? `${destination.slice(0, 10)}...`
                    : destination}
                </a>
              )}
              {postedBy?._id === user?.id ? (
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteButtonClick(_id);
                  }}
                  className='bg-white opacity-70 text-dark font-bold p-2 text-base rounded-3xl outline-none hover:opacity-100 hover:shadow-md'
                >
                  <AiTwotoneDelete />
                </button>
              ) : (
                ''
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${postedBy._id}`}
        className='gap-2 flex mt-2 items-center'
      >
        <img
          className='w-8 h-8 rounded-full object-cover'
          src={postedBy?.image}
          alt='user-profile'
        />
        <p className='font-semibold capitalize'>{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
