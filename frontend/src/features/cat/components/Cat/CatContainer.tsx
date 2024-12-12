import { Stack } from '@mui/material'

import { Cat } from './Cat'

const CatContainer = () => {
	return (
		<Stack position={'absolute'} left={10} bottom={-30} height={100} width={280}>
			<Cat />
		</Stack>
	)
}

export default CatContainer
