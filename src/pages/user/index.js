import React  from 'react';
import Button from '@material-ui/core/Button';
import { APP_ROUTES } from '../../config';


const UserProfile = ({history}) =>  {
    return (
        <div id="page-404">
            <div className="not-found-inner">
                
                <p>Profile Page</p>
                <Button variant="outlined" onClick={() => history.push(APP_ROUTES.MY_PRODUCTS)}>
                    Page D'acceuil
                </Button>
            </div>
        </div>
    ); 
}

 
export default  UserProfile;