/** @format */

import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
	const session = await auth();
	if (!session?.access_token) redirect('/login');

	return (
		<div className="w-full relative px-0 md:px-8 pb-10 md:pb-14">
			<h1 className="text-xl md:text-4xl font-bold">Home</h1>
			<p className="text-muted-foreground mt-4 mb-5">
				Bem-vindo ao sistema de controle de inventário.
			</p>
		</div>
	);
}
