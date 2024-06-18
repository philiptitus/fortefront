'use client'
// import node module libraries
import { Container } from 'react-bootstrap';

// import widget as custom components
import { PageHeading } from 'widgets'

// import sub components

import {NewAccomodation} from 'sub-components';



const defaultValue = {
  hostel_name: 'Sunset Hostel',
  address: '123 Sunset Blvd, Nairobi, Kenya',
  room_price_1: 50,
  room_price_2: 80,
  room_price_4: 120,
  imag1: 'image1.jpg',
  imag2: 'image2.jpg',
  imag3: 'image3.jpg',
  imag4: 'image4.jpg',
  imag5: 'image5.jpg',
  imag6: 'image6.jpg',
  imag7: 'image7.jpg',
  imag8: 'image8.jpg',
  imag9: 'image9.jpg',
  imag10: 'image10.jpg',
};


const Settings = () => {
  return (
    <Container fluid className="p-6">

      {/* Page Heading */}
      <PageHeading heading="New Accomodation" />

      {/* General Settings */}

      {/* Email Settings */}
      {/* // DONE ... <EmailSetting /> */}

      {/* Settings for Preferences */}
      {/* // DONE ...<Preferences /> */}


      {/* <DeleteImage/> */}

      {/* Settings for Notifications */}
      {/* <Notifications /> */}

      <NewAccomodation/>


      {/* Delete Your Account */}
\
    </Container>
  )
}

export default Settings