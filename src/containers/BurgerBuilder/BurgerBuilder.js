import React from 'react';
import Aux from '../../hoc/Aux'

const { Component } = require("react");
class BurgerBuilder extends Component{
    render(){
        return(
            <Aux>
                <div>Burger</div>
                <div>Burger Controls</div>

            </Aux>

        );
    }
}

export default BurgerBuilder;