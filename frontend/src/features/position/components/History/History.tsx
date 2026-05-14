import { FC, useState } from 'react'
import { Stack } from '@mui/material'

import { Tabs } from '@/components/Tabs/Tabs'
import { Tab } from '@/components/Tabs/Tab'
import { Made } from './Made'
import { Sent } from './Sent'
import { Accept } from './Accept'
import { Reject } from './Reject'

type Tab = 'made' | 'sent' | 'accept' | 'reject'

export const History: FC<{ rowId: string }> = ({ rowId }) => {
	const [tab, setTab] = useState<Tab>('made')

	const changeTab = (_event: React.SyntheticEvent, value: string) => {
		setTab(value as Tab)
	}

	return (
		<Stack mt={-2} spacing={2}>
			<Tabs value={tab} onChange={changeTab} centered>
				<Tab label='Изготовлено' value='made' />
				<Tab label='Отправлено' value='sent' />
				<Tab label='Принято' value='accept' />
				<Tab label='Брак' value='reject' />
			</Tabs>

			{tab == 'made' && <Made id={rowId} />}
			{tab == 'sent' && <Sent id={rowId} />}
			{tab == 'accept' && <Accept id={rowId} />}
			{tab == 'reject' && <Reject id={rowId} />}
		</Stack>
	)
}
