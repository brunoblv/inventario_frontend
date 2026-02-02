/** @format */

export interface ITransferenciaListItem {
	id: number;
	iditem: string | null;
	datatransf: string | null;
	localanterior: string | null;
	localnovo: string | null;
	usuario: string | null;
	patrimonio: string | null;
	descricaoBem: string | null;
}

export interface ITransferenciasListResponse {
	data: ITransferenciaListItem[];
	total: number;
	pagina: number;
	limite: number;
}

export interface ITransferenciaCabecalhoListItem {
	id: number;
	dataTransferencia: string;
	unidadeDestino: string | null;
	usuario: string | null;
	qtdItens: number;
	cimbpm: string | null;
}

export interface ITransferenciasCabecalhoListResponse {
	data: ITransferenciaCabecalhoListItem[];
	total: number;
	pagina: number;
	limite: number;
}

export interface ITransferenciaCabecalhoDetalheItem {
	patrimonio: string | null;
	tipo: string | null;
	marca: string | null;
	numserie: string | null;
	servidorAtual: string | null;
}

export interface ITransferenciaCabecalhoDetalhe {
	id: number;
	dataTransferencia: string;
	unidadeDestino: string | null;
	usuario: string | null;
	cimbpm: string | null;
	observacao: string | null;
	itens: ITransferenciaCabecalhoDetalheItem[];
}

/** Histórico de movimentações de um item (idbem) */
export interface IHistoricoItemMovimentacao {
	id: number;
	dataTransferencia: string;
	unidadeDestino: string | null;
	usuarioRegistro: string | null;
	cimbpm: string | null;
	servidorAnterior: string | null;
	servidorAtual: string | null;
	nomeResponsavel: string | null;
}
