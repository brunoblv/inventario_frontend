/** @format */

export interface IDashboardEstatisticas {
	total: number;
	semLocalizacao: number;
	porLocalizacao: { localizacao: string; quantidade: number }[];
}
