import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PaginatedResult, Pagination } from 'src/app/models/Pagination';
import { Palestrante } from 'src/app/models/Palestrante';
import { PalestranteService } from 'src/app/services/palestrante.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss'],
})
export class PalestranteListaComponent implements OnInit {
  termoBuscaChanged: Subject<string> = new Subject<string>();
  public pagination = {} as Pagination;
  public palestrantes: Palestrante[] = [];
  public palestranteId: number;

  constructor(
    private palestranteService: PalestranteService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 5,
      totalItems: 1,
    } as Pagination;

    this.carregarPalestrantes();
  }

  public filtrarPalestrantes(evt: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged.pipe(debounceTime(900)).subscribe((filtrarPor) => {
        this.spinner.show();
        this.palestranteService
          .getPalestrantes(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filtrarPor
          )
          .subscribe(
            (res: PaginatedResult<Palestrante[]>) => {
              this.palestrantes = res.result;
              this.pagination = res.pagination;
            },
            (e: any) => {
              this.spinner.hide();
              this.toastr.error('Erro ao Carregar os Palestrantes', 'Erro!');
            }
          )
          .add(() => this.spinner.hide());
      });
    }
    this.termoBuscaChanged.next(evt.value);
  }

  getImagemUrl(imagemName: string): string {
    if (imagemName)
      return `${environment.apiURL}resources/perfil/${imagemName}`;
    else return `./assets/image/upload.png`;
  }

  public carregarPalestrantes(): void {
    this.spinner.show();

    this.palestranteService
      .getPalestrantes(
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .subscribe(
        (res: PaginatedResult<Palestrante[]>) => {
          this.palestrantes = res.result;

          this.pagination = res.pagination;
        },
        (e: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao Carregar os Palestrantes', 'Erro!');
        }
      )
      .add(() => this.spinner.hide());
  }
}
