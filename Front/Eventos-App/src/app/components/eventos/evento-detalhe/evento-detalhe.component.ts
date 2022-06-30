import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Lote } from './../../../models/Lote';
import { LoteService } from './../../../services/lote.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from './../../../services/evento.service';

import { ActivatedRoute, Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from 'src/app/models/Evento';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  form: FormGroup | any;
  evento = {} as Evento;
  estadoSalvar = 'post';
  eventoId: number;
  modalRef: BsModalRef;
  loteAtual = { id: 0, nome: '', indice: 0 };
  imagemURL = 'assets/image/upload.png';
  file: File;

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private routerActiv: ActivatedRoute,
    private router: Router,

    private eventoService: EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  get modoEditar() {
    return this.estadoSalvar === 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
    };
  }

  public carregarEvento(): void {
    this.eventoId = +this.routerActiv.snapshot.paramMap.get('id');

    if (this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(this.eventoId).subscribe(
        (evento: Evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento);

          if (this.evento.imagemURL !== '') {
            this.imagemURL = environment.apiURL + 'resources/images/' + this.evento.imagemURL;
          }

          this.evento.lotes.forEach((lote) => {
            this.lotes.push(this.criarLote(lote));
          });
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar Evento.', 'Erro!');
          console.error(error);
        },
        () => this.spinner.hide()
      );
    }
  }

  public validation(): void {
    this.form = this.fb.group({
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoa: ['', [Validators.max(5200)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: [''],
      lotes: this.fb.array([]),
    });
  }

  adicionarLote() {
    this.lotes.push(this.criarLote({ id: 0 } as Lote));
  }

  criarLote(lote: Lote) {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      preco: [lote.preco, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  returnTitle(nome: string): string {
    return nome == null || nome === '' ? 'Nome do Lote' : nome;
  }

  resetForm(): void {
    this.form.reset();
  }

  cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarEvento(): void {
    this.spinner.show();
    if (this.form.valid) {
      this.evento =
        this.estadoSalvar === 'post'
          ? { ...this.form.value }
          : { id: this.evento.id, ...this.form.value };

      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        (eventoRetorno: Evento) => {
          this.toastr.success('Evento salvo com Sucesso!', 'Sucesso!');
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
        },
        (error: any) => {
          console.error(error);
          this.spinner.hide();
          this.toastr.error('Error ao salvar evento', 'Erro!');
        },
        () => this.spinner.hide()
      );
    }
  }

  salvarLote() {
    if (this.form.controls.lotes.valid) {
      this.spinner.show();
      this.loteService
        .saveLote(this.eventoId, this.form.value.lotes)
        .subscribe(
          () => {
            this.toastr.success('Lotes salvos com Sucesso!', 'Sucesso!');
            this.lotes.reset();
          },
          (e) => {
            this.toastr.error('Erro ao tentar salvar lotes', 'Erro!');
            console.error(e);
          }
        )
        .add(() => this.spinner.hide());
    }
  }

  removerLote(template: TemplateRef<any>, indice: number) {
    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, { class: 'modal-gb' });
  }

  confirmDeletLote() {
    this.modalRef.hide();
    this.spinner.show();
    this.loteService
      .deleteLote(this.eventoId, this.loteAtual.id)
      .subscribe(
        () => {
          this.toastr.success('Lote deletado com sucesso', 'Sucesso!');
          this.lotes.removeAt(this.loteAtual.indice);
        },
        (e) => {
          this.toastr.error(
            `Erro ao tentar deletar o ${this.loteAtual.id}`,
            'Erro!'
          );
          console.error(e);
        }
      )
      .add(() => this.spinner.hide());
  }

  declineDeletLote() {
    this.modalRef.hide();
  }

  onFileChange(ev: any) {
    const reader = new FileReader();
    reader.onload = (event: any) => (this.imagemURL = event.target.result);

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  uploadImagem(): void {
    this.spinner.show();
    this.eventoService
      .postUpload(this.eventoId, this.file)
      .subscribe(
        () => {
          this.carregarEvento();
          this.toastr.success('Imagem atualizada com Sucesso', 'Sucesso!');
        },
        (e) => {
          this.toastr.error('Erro ao fazer upload de imagem', 'Erro!');
          console.error(e);
        }
      )
      .add(() => this.spinner.hide());
  }
}
