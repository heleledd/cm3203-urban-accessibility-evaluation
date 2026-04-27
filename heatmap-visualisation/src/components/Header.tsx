import '../styles/header.css';
import { MapPin } from 'lucide-react';

export default function Header() {
    return (
        <header>
            <div className="left-section">
                <MapPin className="headerImage" />
                <span className="header-title">accessibility tool</span>
            </div>
        </header>
    )
}