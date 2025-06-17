import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidations {
  static invalidDocument(documentType: string) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (documentType === 'DNI') {
        if (!/^\d{8}$/.test(value)) {
          if(!/^\d+$/.test(value)){
            return { invalidNumberDNI: true };
          }else{
            return { invalidDigitosDNI: true };
          }
        }
      } else if (
        documentType === 'PASAPORTE' ||
        documentType === 'CE'
      ) {
        if (!/^[a-zA-Z0-9]{1,20}$/.test(value)) {
          return { invalidPassportOrCarnet: true };
        }
      }
      return null;
    };
  }
}