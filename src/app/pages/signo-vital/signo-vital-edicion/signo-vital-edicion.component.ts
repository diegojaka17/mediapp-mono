import { PacienteDialogoComponent } from './../paciente-dialogo/paciente-dialogo.component';
import { map } from 'rxjs/operators';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { PacienteService } from './../../../_service/paciente.service';
import { Paciente } from './../../../_model/paciente';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SignoVitalService } from 'src/app/_service/signoVital.service';
import { SignoVital } from 'src/app/_model/signoVital';

@Component({
  selector: 'app-signo-vital-edicion',
  templateUrl: './signo-vital-edicion.component.html',
  styleUrls: ['./signo-vital-edicion.component.css']
})
export class SignoVitalEdicionComponent implements OnInit {

  form: FormGroup;
  pacientes: Paciente[]=[];
  id: number;
  edicion: boolean;

  myControlPaciente: FormControl = new FormControl();
  pacienteSeleccionado: Paciente;
  pacientesFiltrados: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private signoVitalService : SignoVitalService,
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar,
    private dialog : MatDialog
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'paciente' : this.myControlPaciente,
      'fecha' : new FormControl(''),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoRespiratorio': new FormControl('')
    });

    this.listarPacientes();

    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });

    this.signoVitalService.pacienteCambio.subscribe(data => {
      this.myControlPaciente.setValue(data);
    });

  }

  filtrarPacientes(val : any){    
    console.log(val);
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.dni.includes(val.dni));
    } else {
      return this.pacientes.filter(option =>
        option.nombres.toLowerCase().includes(val.toLowerCase()) || option.apellidos.toLowerCase().includes(val.toLowerCase()) || option.dni.includes(val));
    }
  }

  mostrarPaciente(val : Paciente){
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  initForm(){
    if(this.edicion){
      this.signoVitalService.listarPorId(this.id).subscribe(data => {
        this.myControlPaciente.setValue(data.paciente);
        this.form = new FormGroup({
          'id': new FormControl(data.idSignoVital),
          'paciente' : this.myControlPaciente,
          'fecha': new FormControl(data.fecha),
          'temperatura': new FormControl(data.temperatura),
          'pulso': new FormControl(data.pulso),
          'ritmoRespiratorio': new FormControl(data.ritmoRespirarotio)
        });
      });
    }
  }

  get f() { return this.form.controls; }

  operar(){

    //TE ASEGURAS QUE EL FORM ESTE VALIDO PARA PROSEGUIR
    if(this.form.invalid){
      return;
    }

    let signoVital = new SignoVital();
    signoVital.idSignoVital = this.form.value['id'];
    signoVital.fecha = this.form.value['fecha'];
    signoVital.temperatura = this.form.value['temperatura'];
    signoVital.pulso = this.form.value['pulso'];
    signoVital.ritmoRespirarotio = this.form.value['ritmoRespiratorio'];
    signoVital.paciente = this.form.value['paciente'];

    if(this.edicion){
      //servicio de edicion
      this.signoVitalService.modificar(signoVital).subscribe( () => {
        this.signoVitalService.listar().subscribe(data => {
          this.signoVitalService.signoVitalCambio.next(data);
          this.signoVitalService.mensajeCambio.next('SE MODIFICO');
        });
      });
    }else{
      //servicio de registro
      this.signoVitalService.registrar(signoVital).subscribe( () => {
        this.signoVitalService.listar().subscribe(data => {
          this.signoVitalService.signoVitalCambio.next(data);
          this.signoVitalService.mensajeCambio.next('SE REGISTRO');
        });
      });
    }
    this.router.navigate(['signo-vital']);
  }

  abrirDialogo(){
    let pac =  new Paciente();
    this.dialog.open(PacienteDialogoComponent, {
      width: '250px',
      data: pac
    });
  }

}
