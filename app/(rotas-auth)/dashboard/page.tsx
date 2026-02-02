/** @format */

import { auth } from '@/lib/auth/auth';
import * as tiposService from '@/services/tipos';
import * as dashboardService from '@/services/dashboard';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

export default async function DashboardPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const tipo = typeof params.tipo === 'string' ? params.tipo : '';

	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const tiposRes = await tiposService.listarTipos(
		session.access_token,
		'Ativo',
	);
	const tipos = tiposRes.ok && tiposRes.data ? tiposRes.data : [];

	if (!tipo) {
		return (
			<div className="w-full px-0 md:px-8 pb-10 md:pb-14 h-full md:container mx-auto">
				<h1 className="text-xl md:text-4xl font-bold mb-6">Dashboard</h1>
				<p className="text-muted-foreground mb-4">
					Selecione um tipo de bem para ver a distribuição por localização.
				</p>
				<Card className="max-w-2xl">
					<CardHeader>
						<CardTitle className="text-primary">Selecione um item</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
							{tipos.length === 0 ? (
								<li className="text-muted-foreground py-4">
									Nenhum tipo de bem cadastrado.
								</li>
							) : (
								tipos.map((t) => (
									<li key={t.idtipos}>
										<Link
											href={`/dashboard?tipo=${encodeURIComponent(t.tipo)}`}
											className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
											<span>{t.tipo}</span>
											<ChevronRight className="h-4 w-4 opacity-50" />
										</Link>
									</li>
								))
							)}
						</ul>
					</CardContent>
				</Card>
			</div>
		);
	}

	const statsRes = await dashboardService.getEstatisticasDashboard(
		session.access_token,
		tipo,
	);
	const stats = statsRes.ok && statsRes.data ? statsRes.data : null;

	return (
		<div className="w-full px-0 md:px-8 pb-10 md:pb-14 h-full md:container mx-auto">
			<div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
				<Link href="/dashboard" className="hover:text-primary">
					Dashboard
				</Link>
				<ChevronRight className="h-4 w-4" />
				<span className="text-foreground font-medium">{tipo}</span>
			</div>
			<h1 className="text-xl md:text-4xl font-bold mb-6">
				Distribuição: {tipo}
			</h1>

			{!stats ? (
				<p className="text-muted-foreground">
					Não foi possível carregar as estatísticas.
				</p>
			) : (
				<div className="space-y-6">
					<div className="flex flex-wrap gap-4">
						<Card className="min-w-[180px]">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Total
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-2xl font-bold">{stats.total}</p>
								<p className="text-xs text-muted-foreground">itens (exc. descartados)</p>
							</CardContent>
						</Card>
						<Card className="min-w-[180px]">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Sem localização
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-2xl font-bold">{stats.semLocalizacao}</p>
								<p className="text-xs text-muted-foreground">itens</p>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Por localização</CardTitle>
						</CardHeader>
						<CardContent className="p-0 pt-0">
							{stats.porLocalizacao.length === 0 ? (
								<p className="text-muted-foreground py-6 text-center">
									Nenhum item com localização definida.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow className="bg-primary hover:bg-primary">
											<TableHead className="text-white">Localização</TableHead>
											<TableHead className="text-white text-right">
												Quantidade
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{stats.porLocalizacao.map((row) => (
											<TableRow key={row.localizacao}>
												<TableCell className="font-medium">
													{row.localizacao}
												</TableCell>
												<TableCell className="text-right">
													<Badge variant="secondary">
														{row.quantidade}
													</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
