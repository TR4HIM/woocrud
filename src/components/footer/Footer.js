import React  from 'react';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const Footer = () => {
    return (
        <footer id="main-footer">
            {(new Date().getFullYear())} © WooCrud. All Rights Reserved. Crafted with { <FavoriteBorderIcon /> } By <a href="https://github.com/TR4HIM/woocrud"> <strong>Soufiane</strong> </a>
        </footer>
    )
};

export default  Footer;