import { Table } from '@/components/Table/Table'
import { Head } from './Table/Head'
import { Body } from './Table/Body'
import { Footer } from './Footer'
import { Header } from './Header'

export const OrdersTable = () => {
	return (
		<>
			<Header />
			<Table>
				<Head />
				<Body />
			</Table>
			<Footer />
		</>
	)
}
