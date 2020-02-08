import { Subject } from 'rxjs';
import { SignoVital } from './../_model/signoVital';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Paciente } from '../_model/paciente';

@Injectable({
    providedIn: 'root'
})
export class SignoVitalService{

    signoVitalCambio = new Subject<SignoVital[]>();
    mensajeCambio = new Subject<string>();

    pacienteCambio = new Subject<Paciente>();

    url: string = `${environment.HOST}/signosVitales`;

    constructor(private http: HttpClient){}

    listar(){
        return this.http.get<SignoVital[]>(this.url);
      }
    
      listarPorId(idSignoVital: number) {
        return this.http.get<SignoVital>(`${this.url}/${idSignoVital}`);
      }
    
      registrar(SignoVital: SignoVital) {
        return this.http.post(this.url, SignoVital);
      }
    
      modificar(SignoVital: SignoVital) {
        return this.http.put(this.url, SignoVital);
      }
    
      eliminar(idSignoVital: number) {
        return this.http.delete(`${this.url}/${idSignoVital}`);
      }
}