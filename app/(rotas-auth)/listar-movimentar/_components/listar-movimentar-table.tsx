/** @format */

'use client';

import DataTable from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { IItem } from '@/types/item';
import { IUnidade } from '@/types/unidade';
import { getColumns } from './columns';

interface ListarMovimentarTableProps {
	dados: IItem[];
	total: number;
	pagina: number;
	limite: number;
	unidades: IUnidade[];
	statusSelect: { label: string; value: string }[];
	unidadeSelect: { label: string; value: string }[];
	tipoSelect: { label: string; value: string }[];
}

export default function ListarMovimentarTable({
	dados,
	total,
	pagina,
	limite,
	unidades,
	statusSelect,
	unidadeSelect,
	tipoSelect,
}: ListarMovimentarTableProps) {
	return (
		<>
			<div className="flex flex-wrap items-center gap-2 mb-2">
				<Filtros
					camposFiltraveis={[
						{ nome: 'Status', tag: 'status', tipo: 2, valores: statusSelect, default: 'ATIVO' },
						{ nome: 'Unidade', tag: 'unidade', tipo: 2, valores: unidadeSelect },
						{ nome: 'Tipo', tag: 'tipo', tipo: 2, valores: tipoSelect },
						{ nome: 'Buscar', tag: 'pesquisar', tipo: 0, placeholder: 'Procurar...' },
					]}
				/>
			</div>
			<DataTable columns={getColumns(unidades)} data={dados} />
			{dados.length > 0 && (
				<Pagination total={total} pagina={pagina} limite={limite} />
			)}
		</>
	);
}
