import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;


  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
    // get a handle to the cartitem
    this.cartItems = this.cartService.cartItems;

    // subscribe to the total price
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice=data
    );

    // subscribe to total quantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity=data
    );

    // compute cart total price and total quantity
    this.cartService.computeCartTotals();
  }

  incrementQuantity(thecartItem: CartItem){
    this.cartService.addToCart(thecartItem);
  }

  decrementQuantity(tempCartItem: CartItem){
    this.cartService.decrementQuantity(tempCartItem);
  }

  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
    }

}
