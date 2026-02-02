/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { importarUsuariosAD } from '@/services/usuarios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { UsersRound } from 'lucide-react';

export default function BotaoImportarAD() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	async function handleImportar() {
		setLoading(true);
		try {
			const { ok, error, data } = await importarUsuariosAD();
			if (ok && data) {
				const { importados, jaCadastrados } = data;
				if (importados > 0) {
					toast.success(
						`${importados} usuário(s) importado(s) do AD (padrão x/d + 6 dígitos). ${jaCadastrados > 0 ? `${jaCadastrados} já cadastrado(s).` : ''}`,
					);
					router.refresh();
				} else if (jaCadastrados > 0) {
					toast.info(`Nenhum novo usuário. ${jaCadastrados} já cadastrado(s) no sistema.`);
				} else {
					toast.info('Nenhum usuário no AD com padrão x/d + 6 dígitos (company=SMUL).');
				}
			} else {
				toast.error(error ?? 'Erro ao importar usuários do AD.');
			}
		} catch {
			toast.error('Erro ao importar usuários do AD.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			className="gap-2"
			onClick={handleImportar}
			disabled={loading}>
			<UsersRound className="h-4 w-4" />
			{loading ? 'Buscando...' : 'Importar do AD'}
		</Button>
	);
}
