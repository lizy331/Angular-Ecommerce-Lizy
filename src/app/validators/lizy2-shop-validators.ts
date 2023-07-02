import { FormGroup, ValidationErrors } from "@angular/forms";


export class Lizy2ShopValidators {

    // white space validation
    static notOnlyWhitespace(control : FormGroup) : ValidationErrors {

        // check if the field only have the white space
        if((control.value!=null) && (control.value.trim().length===0)){
            // invalid, return the object
            return {'notOnlyWhitespace':true};
        }else{
            return {};
        }


    }


}
