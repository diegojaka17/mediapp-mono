import { SignoVitalService } from 'src/app/_service/signoVital.service';
import { switchMap } from 'rxjs/operators';
import { PacienteService } from './../../../_service/paciente.service';
import { Paciente } from './../../../_model/paciente';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';


@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

  paciente : Paciente;

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Paciente,
    private pacienteService: PacienteService,
    private signoVitalService: SignoVitalService
  ) { }

  ngOnInit() {
    this.paciente = new Paciente();
    this.paciente.idPaciente = this.data.idPaciente;
    this.paciente.nombres = this.data.nombres;
    this.paciente.apellidos = this.data.apellidos;
    this.paciente.dni = this.data.dni;
    this.paciente.direccion = this.data.direccion;
    this.paciente.telefono = this.data.telefono;
  }

  operar() {
      this.pacienteService.registrar(this.paciente).subscribe(data => {
        console.log('Paciente creado->'+data);
        this.paciente = <Paciente> data;
        debugger
        this.signoVitalService.pacienteCambio.next(this.paciente);
        //this.medicoService.mensajeCambio.next('SE MODIFICO');
      });  
    this.dialogRef.close();
  }

  cancelar() {
    this.dialogRef.close();
  }

}
