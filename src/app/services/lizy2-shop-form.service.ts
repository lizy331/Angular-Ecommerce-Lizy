import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { map } from 'rxjs/operators';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Lizy2ShopFormService {


  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]>{
      return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
        map(response => response._embedded.countries)
      );
  }

  getStates(theCountryCode: string): Observable<State[]>{
    //search url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCriditCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] = [];

    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth)
    }

    return of(data);
  }


  getCriditCardYears(): Observable<number[]>{
    let data: number[] = [];

    // build an array for "Year" drop down list
    // start at the current year and loop through next 10 year

    const startYear: number = new Date().getFullYear(); 
    const endYear: number = startYear + 10;

    for(let theYear = startYear;theYear<=endYear;theYear++){
      data.push(theYear);
    }

    return of(data);
  }

  getCreditcard() {
    throw new Error('Method not implemented.');
  }
}

interface GetResponseCountries{
  _embedded: {
    countries: Country[]
  }
}

interface GetResponseStates{
  _embedded: {
    states: State[]
  }
}