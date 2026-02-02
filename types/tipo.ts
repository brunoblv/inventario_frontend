/** @format */

export interface ITipo {
	idtipos: number;
	tipo: string;
	datatransf?: string;
	statustipo: string;
}

export interface ICreateTipo {
	tipo: string;
	statustipo?: string;
}

export interface IUpdateTipo {
	tipo?: string;
	statustipo?: string;
}
