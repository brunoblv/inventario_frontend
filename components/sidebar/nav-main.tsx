/** @format */

import {
	ChevronRight,
	House,
	LayoutGrid,
	LucideProps,
	Package,
	Users,
	Building2,
	Tags,
	FileText,
	ClipboardList,
	BarChart3,
	Truck,
} from 'lucide-react';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { validaUsuario } from '@/services/usuarios';
import { IUsuario } from '@/types/usuario';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import Link from '../link';

export async function NavMain() {
	let usuario: IUsuario | null = null;
	const { ok, data } = await validaUsuario();
	if (ok && data) {
		usuario = data as IUsuario;
	}
	interface IMenu {
		icone: ForwardRefExoticComponent<
			Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
		>;
		titulo: string;
		url?: string;
		permissao?: string;
		subItens?: ISubMenu[];
	}

	interface ISubMenu {
		titulo: string;
		url: string;
	}

	// Menu geral (todos os usuários logados)
	const menuUsuario: IMenu[] = [
		{ icone: House, titulo: 'Home', url: '/' },
		{ icone: FileText, titulo: 'Termo Entrega/Retirada', url: '/termo' },
		{ icone: ClipboardList, titulo: 'Termo Empréstimo', url: '/termo-emprestimo' },
	];

	// Menu administração (ADM)
	const menuAdmin: IMenu[] = [
		{ icone: Users, titulo: 'Usuários', url: '/usuarios' },
		{ icone: Building2, titulo: 'Unidades', url: '/unidades' },
		{ icone: Package, titulo: 'Cadastro de Bens', url: '/cadastro-de-bens' },
		{ icone: Tags, titulo: 'Tipos de Bens', url: '/tipos-de-bens' },
		{ icone: LayoutGrid, titulo: 'Inventário', url: '/inventario' },
		{ icone: Truck, titulo: 'Movimentar Bens', url: '/movimentar' },
		{ icone: BarChart3, titulo: 'Dashboard', url: '/dashboard' },
	];

	return (
		<SidebarContent>
			<SidebarGroup className='space-y-2'>
				{menuUsuario && (
					<>
						<SidebarGroupLabel>Geral</SidebarGroupLabel>
						<SidebarMenu>
							{menuUsuario.map((item: IMenu) =>
								item.subItens ? (
									<Collapsible
										key={item.titulo}
										asChild
										className='group/collapsible'>
										<SidebarMenuItem>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton tooltip={item.titulo}>
													{item.icone && <item.icone />}
													<span>{item.titulo}</span>
													{item.subItens && (
														<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
													)}
												</SidebarMenuButton>
											</CollapsibleTrigger>
											{item.subItens && (
												<CollapsibleContent>
													<SidebarMenuSub>
														{item.subItens?.map((subItem) => (
															<SidebarMenuSubItem key={subItem.titulo}>
																<Link href={item.url || '#'}>
																	{item.icone && <item.icone />}
																	<span>{item.titulo}</span>
																</Link>
															</SidebarMenuSubItem>
														))}
													</SidebarMenuSub>
												</CollapsibleContent>
											)}
										</SidebarMenuItem>
									</Collapsible>
								) : (
									<SidebarMenuItem
										key={item.titulo}
										className='z-50'>
										<Link href={item.url || '#'}>
											{item.icone && <item.icone />}
											<span>{item.titulo}</span>
										</Link>
									</SidebarMenuItem>
								),
							)}
						</SidebarMenu>
					</>
				)}
				{menuAdmin &&
					usuario &&
					usuario.permissao &&
					['DEV', 'ADM'].includes(usuario.permissao.toString()) && (
						<>
							<SidebarGroupLabel>Administração</SidebarGroupLabel>
							<SidebarMenu>
								{menuAdmin.map((item) =>
									item.subItens ? (
										<Collapsible
											key={item.titulo}
											asChild
											className='group/collapsible'>
											<SidebarMenuItem>
												<CollapsibleTrigger asChild>
													<SidebarMenuButton tooltip={item.titulo}>
														{item.icone && <item.icone />}
														<span>{item.titulo}</span>
														{item.subItens && (
															<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
														)}
													</SidebarMenuButton>
												</CollapsibleTrigger>
												{item.subItens && (
													<CollapsibleContent>
														<SidebarMenuSub>
															{item.subItens?.map((subItem) => (
																<SidebarMenuSubItem key={subItem.titulo}>
																	<Link href={item.url || '#'}>
																		{item.icone && <item.icone />}
																		<span>{item.titulo}</span>
																	</Link>
																</SidebarMenuSubItem>
															))}
														</SidebarMenuSub>
													</CollapsibleContent>
												)}
											</SidebarMenuItem>
										</Collapsible>
									) : (
										<SidebarMenuItem
											key={item.titulo}
											className='z-50'>
											<Link href={item.url || '#'}>
												{item.icone && <item.icone />}
												<span>{item.titulo}</span>
											</Link>
										</SidebarMenuItem>
									),
								)}
							</SidebarMenu>
						</>
					)}
			</SidebarGroup>
		</SidebarContent>
	);
}
