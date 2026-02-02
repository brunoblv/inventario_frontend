/** @format */

export interface IUnidade {
	id: number;
	unidades: string;
	sigla: string;
	codigo: string;
	statusunidade: string;
}

export interface ICreateUnidade {
	unidades: string;
	sigla: string;
	codigo: string;
	statusunidade?: string;
}

export interface IUpdateUnidade {
	unidades?: string;
	sigla?: string;
	codigo?: string;
	statusunidade?: string;
}
