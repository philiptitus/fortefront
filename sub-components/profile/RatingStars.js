import React from 'react';
import { Star } from 'react-feather'; // Assuming there's a Star component available

const RatingStars = ({ rating }) => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            // Render a filled star
            stars.push(<Star key={i} size={20} color="#ffc107" />);
        } else {
            // Render an outline star
            stars.push(<Star key={i} size={20} color="#e4e5e9" />);
        }
    }

    return <>{stars}</>;
};

export default RatingStars;
