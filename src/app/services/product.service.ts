import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  

  private baseUrl = 'http://localhost:8080/api/products';
  
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> {
    //build the url based on the product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPagenite(thePage:number, 
                        theSize: number, 
                        theCategoryId:number):Observable<GetResponseProducts>{

    // @Todo build url based on id, and page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` + `&page=${thePage}&size=${theSize}`;


    return this.httpClient.get<GetResponseProducts>(searchUrl); 
  }



  getProductList(theCategoryId:number):Observable<Product[]>{

      // @Todo build url based on id, will come back at this
      const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`


      return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string):Observable<Product[]> {
    // @Todo build url based on id, will come back at this
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`


    return this.getProducts(searchUrl);
  }

  searchProductsPagenite(thePage:number, 
                          theSize: number, 
                            theKeyword:string):Observable<GetResponseProducts>{

    // @Todo build url based on id, and page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` + `&page=${thePage}&size=${theSize}`;


    return this.httpClient.get<GetResponseProducts>(searchUrl); 
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategories>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
      );
  }

}

  interface GetResponseProducts {
    _embedded:{
      products:Product[];
    },
    page:{
      size: number,
      totalElements: number,
      totalPage: number,
      number: number
    }
}

interface GetResponseProductCategories {
  _embedded:{
    productCategory:ProductCategory[];
  }
}
