import React from 'react';
import Masonry from 'react-masonry-css';
import { fetchUser } from '../utils/utils';
import Pin from './Pin';

const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins }) => {
  const user = fetchUser();
  const checkOwner = (id) => {
    if (user.id === id) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div>
      <Masonry
        className='flex animate-slide-fwd'
        breakpointCols={breakpointObj}
      >
        {pins?.map((pin) => (
          <Pin
            key={pin._id}
            pin={pin}
            isOwner={checkOwner(pin?.postedBy?._id) ? 'true' : 'false'}
            className='w-max'
          />
        ))}
      </Masonry>
    </div>
  );
};

export default MasonryLayout;
