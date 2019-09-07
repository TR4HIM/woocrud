import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { APP_ROUTES } from '../config';


export default class NotFound extends Component {

    render() {

        return (
            <div id="page-404">
                <img id="logo" src={`${process.env.PUBLIC_URL}/img/kibo.png`} alt="kibo" /> 

                <div className="not-found-inner">
                    <span>404</span>
                    <p>Vous êtes perdu !</p>
                    <Button variant="outlined" onClick={()=>this.props.history.push(APP_ROUTES.MY_PRODUCTS)}>
                        Page d'acceuil
                    </Button>
                </div>

            </div>
        );
    }
}
