import React  from 'react';
import Button from '@material-ui/core/Button';
import { APP_ROUTES } from '../../config';


const NotFound = () =>  {

    return (
        <div id="page-404">
            <img id="logo" src={`${process.env.PUBLIC_URL}/img/logo.png`} alt="kibo" /> 

            <div className="not-found-inner">
                <span>404</span>
                <p>Vous êtes perdu !</p>
                <Button variant="outlined" onClick={()=>this.props.history.push(APP_ROUTES.MY_PRODUCTS)}>
                    Page D'acceuil
                </Button>
            </div>

        </div>
    ); 
}

 
export default  NotFound;
