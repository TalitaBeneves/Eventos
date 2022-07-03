import { Component, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidatorField } from 'src/app/helpers/ValidatorField';
import { environment } from 'src/environments/environment';
import { UserUpdate } from './../../../models/identity/UserUpdate';
import { AccountService } from './../../../services/account.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  form: FormGroup | any;
  usuario = {} as UserUpdate;
  imagemURL = '';
  file: File;
  teste = 'src/assets/image/upload.png';

  constructor(
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  setFormValue(usuario: UserUpdate): void {
    this.usuario = usuario;
    if (this.usuario.imagemURL)
      this.imagemURL = `${environment.apiURL}resources/perfil/${this.usuario.imagemURL}`;
    else this.imagemURL = `./assets/image/upload.png`;
  }

  get isPalestrante(): boolean {
    return this.usuario.funcao === 'Palestrante';
  }

  onFileChange(ev: any) {
    const reader = new FileReader();
    reader.onload = (event: any) => (this.imagemURL = event.target.result);

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  private uploadImagem() {
    this.spinner.show();
    this.accountService
      .postUpload(this.file)
      .subscribe(
        () => {
          this.toastr.success('Imagem atualizada com Sucesso', 'Sucesso!');
        },
        (e) => {
          this.toastr.error('Erro ao faze upload de imagem', 'Erro!');
          console.error(e);
        }
      )
      .add(() => this.spinner.hide());
  }
}
