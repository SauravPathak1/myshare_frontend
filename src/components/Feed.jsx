import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/utils';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (!pins?.length)
    return (
      <h2 className='text-center items-center mt-5'>{`No content here. ${
        categoryId
          ? 'Please add more pins of ' + categoryId + ' and come back later.'
          : ''
      }`}</h2>
    );
  if (loading) return <Spinner message='NO content here' />;
  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
