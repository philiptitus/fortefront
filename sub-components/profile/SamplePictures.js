import React from 'react';
import { Carousel, Image } from 'react-bootstrap';
import { API_URL } from 'store/constants/userConstants';

const SamplePictures = ({ hostel }) => {
    const images = [
        hostel?.imag1,
        hostel?.imag2,
        hostel?.imag3,
        hostel?.imag4,
        hostel?.imag5,
        hostel?.imag6,
        hostel?.imag7,
        hostel?.imag8,
        hostel?.imag9,
        hostel?.imag10
    ].filter(Boolean); // Filter out null or undefined images

    return (
        <div>
            <h6>Preview Images</h6>
            <Carousel indicators>
                {images.map((image, index) => (
                    <Carousel.Item key={index}>
                        <Image className="d-block w-100" src={API_URL + image} alt={`Slide ${index + 1}`} />
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}

export default SamplePictures;
