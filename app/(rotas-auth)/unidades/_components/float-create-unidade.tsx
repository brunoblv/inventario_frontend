/** @format */

'use client';

import { useRouter } from 'next/navigation';
import ModalUnidade from './modal-unidade';

export default function FloatCreateUnidade() {
	const router = useRouter();
	return (
		<ModalUnidade isUpdating={false} onSuccess={() => router.refresh()} />
	);
}
