import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {



  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  constructor() {
      // read the data from storage

      const data = this.storage.getItem('cartItems');
      if (data !== null) {
        this.cartItems = JSON.parse(data);

        console.log("cart service constructor, cartItem data: " + this.cartItems);

        // compute total
        this.computeCartTotals();
      }

   }



  addToCart(theCartItem: CartItem){

    // check if the item exist
    let alreadyExistsInCart: boolean = false;
    let existingCartItem!: CartItem;

    // find the item in the cart based on item id

    if(this.cartItems.length>0){


      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id === theCartItem.id){
          existingCartItem = tempCartItem;
          break;
        }
      }

    }

    // check if we fond it

    alreadyExistsInCart = (existingCartItem !== undefined);

    // console.log(`if the item existed or not ${alreadyExistsInCart}`);

    if (alreadyExistsInCart==true) {
      existingCartItem.quantity++;

      // console.log(`updating quantity: ${existingCartItem.quantity}`);

    }else{

      // a new item is going to add to the cart
      this.cartItems.push(theCartItem);
    }

    // compute the total price of the cart 
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceVaule: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      // console.log(`current item in the cart:`);
      // console.log(`name: ${currentCartItem.name}, quantity=${currentCartItem.quantity}, unitePrice=${currentCartItem.unitPrice}`);

      totalPriceVaule += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }


    // publish the new value to all subscribers, all the subscribers will received the new data
    this.totalPrice.next(totalPriceVaule);
    this.totalQuantity.next(totalQuantityValue);


    // log the cart data

    this.logCartData(totalPriceVaule,totalQuantityValue);

    // persist the cart data
    this.persistCartItems();


  }

  persistCartItems(){
    console.log("cart service persistCartItem, start persisting");
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
    console.log("cart service persistCartItem, finish persisting");
  }

  logCartData(totalPriceVaule: number, totalQuantityValue: number) {

    console.log(`Contents of the cart:`);
    for(let tempCartItem of this.cartItems){
        const subTotalPriceValue = tempCartItem.quantity * tempCartItem.unitPrice;
        console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitePrice=${tempCartItem.unitPrice}, subtotalPrice = ${subTotalPriceValue}`);
    }

    console.log(`totalPrice: ${totalPriceVaule.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log(`----`);
  }


  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity===0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    // get index of the item in the array

    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id===theCartItem.id ); 
     

    // if found, remove the item from the array
    if(itemIndex>-1){
      this.cartItems.splice(itemIndex,1);

      this.computeCartTotals();

    }

  }
}
