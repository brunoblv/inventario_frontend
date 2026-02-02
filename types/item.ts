/** @format */

export interface IItem {
	idbem: number;
	patrimonio: string | null;
	tipo: string | null;
	descsbpm: string | null;
	numserie: string | null;
	tiposbpm: string | null;
	marca: string | null;
	modelo: string | null;
	localizacao: string | null;
	servidor: string | null;
	numprocesso: string | null;
	cimbpm: string | null;
	nome: string | null;
	statusitem: string | null;
	excluido: boolean;
}

export interface ICreateItem {
	patrimonio?: string;
	tipo?: string;
	descsbpm?: string;
	numserie?: string;
	tiposbpm?: string;
	marca?: string;
	modelo?: string;
	localizacao?: string;
	servidor?: string;
	numprocesso?: string;
	cimbpm?: string;
	nome?: string;
	statusitem?: string;
	excluido?: boolean;
}

export interface IUpdateItem {
	patrimonio?: string;
	tipo?: string;
	descsbpm?: string;
	numserie?: string;
	tiposbpm?: string;
	marca?: string;
	modelo?: string;
	localizacao?: string;
	servidor?: string;
	numprocesso?: string;
	cimbpm?: string;
	nome?: string;
	statusitem?: string;
	excluido?: boolean;
}
