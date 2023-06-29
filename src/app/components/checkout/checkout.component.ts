import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Lizy2ShopFormService } from 'src/app/services/lizy2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private lizy2ShopFormService: Lizy2ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zip:[''],
      }),
      billingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zip:[''],
      }),
      creditCard: this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expirationMonth:[''],
        expirationYear:['']
      })
    });

    // pupolate credit ard month
    const startMonth: number = new Date().getMonth()+1;
    console.log("startMonth: " + startMonth);

    this.lizy2ShopFormService.getCriditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate redit card year

    this.lizy2ShopFormService.getCriditCardYears().subscribe(
      data => {
        console.log("Retrived credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );


    // populate  countries
    this.lizy2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Reterived Countries: " + JSON.stringify(data))
        this.countries = data;
      }
    );


  }
  

  onSubmit(){
    console.log("handling submit button")

    console.log(this.checkoutFormGroup.get('customer')?.value)

    console.log("the shipping address country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name)
    console.log("the shipping address state is " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name)
  }

  copyShippingAddressToBillingAddress(event: any){

    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      this.billingAddressStates = this.shippingAddressStates;

    }else{
      this.checkoutFormGroup.controls.billingAddress.reset();

      this.billingAddressStates = [];
    }

  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    if(creditCardFormGroup){
      const currentYear: number = new Date().getFullYear();
      const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

      // if the current year is the selected year, then start from the current month
      let startMonth: number;

      if(currentYear === selectedYear){
        startMonth = new Date().getMonth()+1;
      }else{
        startMonth = 1;
      }

      this.lizy2ShopFormService.getCriditCardMonths(startMonth).subscribe(
        data => {
          console.log("Retrived credit card months: " + JSON.stringify(data));
          this.creditCardMonths = data;
        }
      )
    }  
  }


  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.lizy2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName==='shippingAddress'){
          this.shippingAddressStates = data
        }else{
          this.billingAddressStates = data
        }

        //select the first state by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );

  }

}
