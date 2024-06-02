import {Inject, Injectable} from '@angular/core';
import axios, {AxiosError} from "axios";
import Swal from "sweetalert2";
import {LocalStoreService} from "./local-store.service";

@Injectable({
  providedIn: 'root'
})
export class BaseService<TModel> {
  Domain = "https://localhost:7246/";
  BaseUrl = this.Domain + "api/v1/";

  header = {'Accept': 'application/json', 'Authorization': `Bearer `};


  private localStorage: LocalStoreService = new LocalStoreService();

  constructor(@Inject("uri") protected Uri: string) {
  }
  async doRequest(url, method, data = null, showMessage = false) {
    let result;
    try {
      switch (method) {
        case "get":
          result = await axios.get(url, {headers: {Authorization: "Bearer " + this.localStorage.getItem("access_token")}});
          break;
        case 'patch':
          result = await axios.patch(url + `/`, data, {headers: {Authorization: "Bearer " + this.localStorage.getItem("access_token")}});
          break;
        case 'post':
          result = await axios.post(url + `/`, data, {headers: {Authorization: "Bearer " + this.localStorage.getItem("access_token")}});
          break;
        case 'delete':
          result = await axios.delete(url, {headers: {Authorization: "Bearer " + this.localStorage.getItem("access_token")}});

      }
      if (result.status != 200) {
        throw result.data.Message;
      }
      if(showMessage)
        Swal.fire({
          icon: 'success',
          title: 'موفقیت',
          text: result.data.message,
          confirmButtonText: 'تایید'
        })
      return result.data;

    } catch (e: any) {
      if (e instanceof AxiosError) {
        Error(e.response?.data?.Message);
        Swal.fire({
          icon: 'error',
          title: 'خطا',
          text: e.response?.data?.Message,
          confirmButtonText: 'تایید'
        })
      } else {
        Error(e.message ?? "خطایی رخ داده است");
        Swal.fire({
          icon: 'error',
          title: 'خطا',
          text: e.message ?? "خطایی رخ داده است",
          confirmButtonText: 'تایید'
        })
      }

      return null;
    }

  }

  async index(uri = this.Uri): Promise<TModel[]> {
    let res = await this.doRequest(this.BaseUrl + uri, 'get');
    return res.data;
  }

  async show(id): Promise<TModel> {
    let res = await this.doRequest(this.BaseUrl + this.Uri + `/${id}`, 'get');
    return res.data
  }

  async update(data): Promise<TModel> {
    let res = await this.doRequest(this.BaseUrl + this.Uri + `/${data?.id ?? 0}`, 'patch', data, true);
    return res.data;
  }

  async store(data): Promise<TModel> {
    let res = await this.doRequest(this.BaseUrl + this.Uri, 'post', data, true);
    return res.data;
  }

  async delete(data): Promise<boolean> {
    let res = await this.doRequest(this.BaseUrl + this.Uri + `/${data}`, 'delete', null, true);
    return res.data;
  }

  async post(data, uri, showMessage = false): Promise<TModel | null> {
    return await this.doRequest(this.BaseUrl + uri, 'post', data, showMessage);
  }
}
