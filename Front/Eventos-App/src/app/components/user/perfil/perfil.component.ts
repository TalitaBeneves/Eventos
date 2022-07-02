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

  constructor() {}

  ngOnInit(): void {}

  setFormValue(usuario: UserUpdate): void {
    this.usuario = usuario;
    console.log( this.usuario)
  }
}
