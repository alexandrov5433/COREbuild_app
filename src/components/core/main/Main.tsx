import ErrorBoundary from '../../general/errorBoundary/ErrorBoundary';
import './main.css';
import { Outlet } from "react-router";

export default function Main() {
    return (
        <main>
            <ErrorBoundary>
                <Outlet/>
            </ErrorBoundary>
        </main>
    );
}