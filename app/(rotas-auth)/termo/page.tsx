/** @format */

import { auth } from '@/lib/auth/auth';
import * as unidadesService from '@/services/unidades';
import { redirect } from 'next/navigation';
import FormTermo from './_components/form-termo';

export default async function TermoPage() {
	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const { ok, data: unidades } = await unidadesService.listarUnidades(
		session.access_token,
	);

	const unidadesList = ok && unidades ? unidades : [];

	return (
		<div className="w-full relative px-0 md:px-8 pb-10 md:pb-0">
			<h1 className="text-xl md:text-4xl font-bold">
				Termo Entrega/Retirada
			</h1>
			<p className="text-muted-foreground mt-4 mb-6">
				Preencha os itens e os dados de entrega e recebimento para gerar o
				termo.
			</p>
			<FormTermo unidades={unidadesList} />
		</div>
	);
}
