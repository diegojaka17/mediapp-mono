import { switchMap } from 'rxjs/operators';
import { SignoVitalService } from './../../_service/signoVital.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SignoVital } from './../../_model/signoVital';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signo-vital',
  templateUrl: './signo-vital.component.html',
  styleUrls: ['./signo-vital.component.css']
})
export class SignoVitalComponent implements OnInit {

  displayedColumns = ['idSignoVital', 'fecha', 'temperatura', 'pulso', 'paciente','ritmoRespirarotio','acciones'];
  dataSource: MatTableDataSource<SignoVital>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private signoVitalService : SignoVitalService, private dialog : MatDialog, private snack: MatSnackBar) { }

  ngOnInit() {

    this.signoVitalService.signoVitalCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.signoVitalService.mensajeCambio.subscribe(data => {
      this.snack.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.signoVitalService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  filtrar(valor : string){
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(signoVital : SignoVital){
    this.signoVitalService.eliminar(signoVital.idSignoVital).pipe(switchMap( () => {
      return this.signoVitalService.listar();
    })).subscribe(data => {
      this.signoVitalService.signoVitalCambio.next(data);
      this.signoVitalService.mensajeCambio.next('SE ELIMINO');  
    });
  }

}
