/** @format */

export interface IInventarioItem {
	patrimonio: string | null;
	nome: string | null;
	descricaoBem: string | null;
	localizacao: string | null;
	servidor: string | null;
	responsavel: string | null;
	cimbpm: string | null;
	dataTransf: string | null;
}

export interface IInventarioPaginado {
	data: IInventarioItem[];
	total: number;
	pagina: number;
	limite: number;
}
