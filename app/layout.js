import 'styles/theme.scss';
import { Provider } from "react-redux";
import store from 'store/store';

export const metadata = {
    title: 'FORTE - HMS',
    description: 'Hostel Administration Panel',
    keywords: 'Dash UI, Next.js 13, Admin dashboard, admin template, web apps, bootstrap 5, admin theme'
}

export default function RootLayout({ children }) {
    return (
            <html lang="en">
                <body className='bg-light'>
                    {children}
                </body>
            </html>
    )
}
