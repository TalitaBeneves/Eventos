import { UserUpdate } from 'src/app/models/identity/UserUpdate';
import { Evento } from "./Evento";
import { RedeSocial } from "./RedeSocial";

export interface Palestrante {
  id: number;
  user: UserUpdate;
  miniCurriculo: string;
  redesSociais: RedeSocial[];
  palestrantesEventos: Evento[];

}
