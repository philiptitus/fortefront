'use client'
// import node module libraries
import { Suspense } from 'react';
import { Container } from 'react-bootstrap';
import { Provider } from "react-redux";
import store from 'store/store';

export default function AuthLayout({ children }) {
  return (
    <Provider store={store}>
<Suspense fallback={<div>Loading...</div>}>

    <Container className="d-flex flex-column">  
        {children}
    </Container>

    </Suspense>
    
    </Provider>
  )
}
