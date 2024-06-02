import { Injectable } from '@angular/core';
import { LocalStoreService } from './local-store.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ApiManagementService {

  url = "https://localhost:44317/api/v1/";
  domain = "https://localhost:44317/";
  header = { 'Accept' : 'application/json', 'Authorization' : `Bearer ${this.store.getItem('token')}` };

  constructor(
    private store: LocalStoreService,
  ) { }

  errors(err, modalService:any = null){
    if(err.status == 401 || err.status == 403){
      if(modalService != null){
        modalService.dismissAll();
      }
      // this.authService.signout();
      return true;
    }else{
      Swal.fire({
        icon: 'error',
        title: 'خطا سرور',
        text: err?.response?.data?.message || 'لطفا بعدا امتحان کنید',
        confirmButtonText: "تایید"
      })
    }
    return false
  }
}
