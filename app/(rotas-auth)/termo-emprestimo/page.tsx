/** @format */

import { auth } from '@/lib/auth/auth';
import * as unidadesService from '@/services/unidades';
import { redirect } from 'next/navigation';
import FormTermoEmprestimo from './_components/form-termo-emprestimo';

export default async function TermoEmprestimoPage() {
	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const { ok, data: unidades } = await unidadesService.listarUnidades(
		session.access_token,
	);

	const unidadesList = ok && unidades ? unidades : [];

	return (
		<div className="w-full relative px-0 md:px-8 pb-10 md:pb-0">
			<h1 className="text-xl md:text-4xl font-bold">
				Termo de Responsabilidade – Empréstimo de Equipamento
			</h1>
			<p className="text-muted-foreground mt-4 mb-6">
				Preencha os dados do solicitante e do equipamento para gerar o termo.
			</p>
			<FormTermoEmprestimo unidades={unidadesList} />
		</div>
	);
}
