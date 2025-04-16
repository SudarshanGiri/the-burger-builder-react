import React from 'react';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrdarySummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner'

const INGREDIENT_PRICES ={
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};


const { Component } = require("react");
class BurgerBuilder extends Component{
    // constructor(props){
    //     super(props);
    //     this.state={..}
    // }

    state={
        ingredients:null,
        totalPrice: 4,
        purchaseable: false,
        purchasing:false,
        loading:false

    }

    componentDidMount(){
        axios.get('/ingredients.json')
            .then(response=>{
                console.log(response);
                this.setState({ingredients: response.data});

            });
    }
    updatePurchasestate(ingredients){
      
        const sum = Object.keys(ingredients)
            .map(igKey=>{
                return ingredients[igKey];
            })
            .reduce((sum, el)=>{
                return sum + el;
            },0);
        this.setState({purchaseable: sum>0});
    }
    addIngredientHandler =(type) =>{
        const oldCount =this.state.ingredients[type];
        const updatedCount = oldCount +1;
        const updatedIngredients={
            ...this.state.ingredients
        };
        updatedIngredients[type] =updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice =this.state.totalPrice;
        const newPrice=oldPrice +priceAddition;
        this.setState({totalPrice:newPrice, ingredients: updatedIngredients});
        this.updatePurchasestate(updatedIngredients);
    }

    removeIngredientHandler=(type)=>{
        const oldCount =this.state.ingredients[type];
        if (oldCount<=0){
            return;
        }
        const updatedCount = oldCount -1;
        const updatedIngredients={
            ...this.state.ingredients
        };
        updatedIngredients[type] =updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice =this.state.totalPrice;
        const newPrice=oldPrice - priceDeduction;
        this.setState({totalPrice:newPrice, ingredients: updatedIngredients})
        this.updatePurchasestate(updatedIngredients);

    }

    purchaseHandler=()=>{
        this.setState({purchasing:true});
    }
    purchaseCancelHandler=()=>{
        this.setState({purchasing:false});
    }
    purchaseContinueHandler=()=>{
        //alert('You continue!')
        this.setState({loading:true})
        const order={
            ingredients:this.state.ingredients,
            price:this.state.totalPrice,
            customer:{
                name:'Sudarshan Giri',
                address:{
                    street:'Nakhipot',
                    zipCode:'44700',
                    country:'Nepal'
                },
                email:'sudarshanhang@gmail.com',

            },
            deliveryMethod:'fastest'

        }

        axios.post('/orders.json', order)
            .then(response=>{
                this.setState({loading:false, purchasing:false});
            })
            .catch(error=>{
                this.setState({loading:false, purchasing:false});
            });

    }

    render(){
        const disabledInfo ={
            ...this.state.ingredients
        };
        for (let key in disabledInfo){
            disabledInfo[key]= disabledInfo[key]<=0
        }
        let orderSummary=null;

     
     
        let burger=<Spinner />

        if(this.state.ingredients){
            burger =(
                <>
                      <Burger ingredients={this.state.ingredients}/>
                        <BuildControls 
                            ingredientAdded={this.addIngredientHandler}
                            ingredientRemoved={this.removeIngredientHandler}
                            disabled={disabledInfo}
                            purchaseable={this.state.purchaseable}
                            ordered={this.purchaseHandler}
                            price={this.state.totalPrice} />
                </>
            );
            orderSummary=<OrderSummary ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler} />;

        }
        if(this.state.loading){
            orderSummary=<Spinner />;
        }
       
        return(
            <>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
              
            </>

        );
    }
}

export default BurgerBuilder;