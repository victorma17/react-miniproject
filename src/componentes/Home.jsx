import { Header } from './Header.jsx'
import { Outlet } from 'react-router-dom'
import { Footer } from './Footer.jsx'

export function Home() {
    return (
        <div className='container d-flex flex-column justify-content-between'>
            <Header></Header>
            <div className='flex-grow-1'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    )
}