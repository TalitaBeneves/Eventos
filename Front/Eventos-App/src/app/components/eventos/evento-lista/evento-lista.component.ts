import { Pagination, PaginatedResult } from './../../../models/Pagination';
import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss'],
})
export class EventoListaComponent implements OnInit {
  public MostraImg: boolean = true;
  public modalRef?: BsModalRef;
  public eventoId!: number;
  public pagination = {} as Pagination;

  public eventos: Evento[] = [];
  termoBuscaChanged: Subject<string> = new Subject<string>();

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 5,
      totalItems: 1,
    } as Pagination;

    this.carregarEventos();
  }

  public filtrarEventos(evt: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged.pipe(debounceTime(900)).subscribe((filtrarPor) => {
        this.spinner.show();
        this.eventoService
          .getEventos(
            this.pagination.currentPage,
            this.pagination.itemsPerPage,
            filtrarPor
          )
          .subscribe(
            (res: PaginatedResult<Evento[]>) => {
              this.eventos = res.result;
              this.pagination = res.pagination;
            },
            (e: any) => {
              this.spinner.hide();
              this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
            }
          )
          .add(() => this.spinner.hide());
      });
    }
    this.termoBuscaChanged.next(evt.value);
  }

  motraImg(imagemURL: string): string {
    return imagemURL !== ''
      ? `${environment.apiURL}resources/images/${imagemURL}`
      : 'assets/image/semImagem.jpeg';
  }

  public carregarEventos(): void {
    this.spinner.show();

    this.eventoService
      .getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe(
        (res: PaginatedResult<Evento[]>) => {
          this.eventos = res.result;
          this.pagination = res.pagination;
        },
        (e: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
        }
      )
      .add(() => this.spinner.hide());
  }

  openModal(template: TemplateRef<any>, eventoId: number) {
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-bg' });
  }

  public pageChanged(event): void {
    this.pagination.currentPage = event.page;
    this.carregarEventos();
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();

    this.eventoService
      .deleteEvento(this.eventoId)
      .subscribe(
        (res: any) => {
          this.toastr.success('O evento foi deletado com sucesso', 'Deletado!');
          this.carregarEventos();
        },
        (e) => {
          this.toastr.error(
            `Erro ao tentar deletar o evento ${this.eventoId}`,
            'Erro!'
          );
        }
      )
      .add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
