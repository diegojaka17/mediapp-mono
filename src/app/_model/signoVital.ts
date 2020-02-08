import { Paciente } from './paciente';
export class SignoVital{
    idSignoVital: number;
    paciente: Paciente;
    fecha: String;
    temperatura: number;
    pulso: number;
    ritmoRespirarotio: number;
}