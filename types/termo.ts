/** @format */

export interface ITermoData {
	itensPatrimonio: string[];
	itensDescricao: string[];
	dataEntregue: string;
	unidadeEntregue: string;
	nomeEntrega: string;
	rfEntrega: string;
	dataRecebimento: string;
	unidadeRecebimento: string;
	nomeRecebimento: string;
	rfRecebimento: string;
}

export const TERMO_STORAGE_KEY = 'sgi-termo-dados';
