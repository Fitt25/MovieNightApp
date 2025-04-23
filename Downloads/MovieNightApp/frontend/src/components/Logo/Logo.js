import {useState} from 'react';
import './Logo.css';

const Logo = () => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div
        className="logo"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className={`acronym ${isHovered ? 'hidden' : ''}`}>CB</span>
        <span className={`full-name ${isHovered ? 'visible' : ''}`}>CouchBuddies</span>
      </div>
    );
};
  
export default Logo;