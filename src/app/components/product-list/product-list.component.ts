import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {




  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new propertities for pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number=0;

  previousKeyword: string = "";
  


  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      ()=>{this.listProducts();
      }
    )
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }

    

  }

  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previous
    // then set the pagenumber to 1
    //

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);


    //search the product by the keyword
    this.productService.searchProductsPagenite(this.thePageNumber-1,
                                                this.thePageSize,
                                                  theKeyword).subscribe(this.processResult());
  }

  

  handleListProducts(){
    const id = this.route.snapshot.paramMap.get('id');
    // check if the id parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      // if the id is shown, get the id
      const id = this.route.snapshot.paramMap.get('id');
      if(id!==null){this.currentCategoryId = +id;}
      else{
        this.currentCategoryId = 1;
      }
    }

    //
    // check if we have a different category id
    // Note: Angular will resue a component it is being useing
    //

    // if there is different category id than previous
    // then set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber = ${this.thePageNumber}`);


    this.productService.getProductListPagenite(this.thePageNumber-1,
      this.thePageSize,
      this.currentCategoryId).subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
    }


    processResult() {
      return (data:any) => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number+1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;

      }
    }

    addToCart(theProduct: Product){

      console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

      //TODO heavy works here
      const theCartItem = new CartItem(theProduct);

      this.cartService.addToCart(theCartItem);
    }

}
