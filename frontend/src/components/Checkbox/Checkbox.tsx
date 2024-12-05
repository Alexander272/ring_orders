import { ChangeEvent, FC } from 'react'
import { Field, Input, Label, Svg } from './checkbox.style'

type Props = {
	id?: string
	label?: string
	name?: string
	value?: boolean
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

export const Checkbox: FC<Props & React.InputHTMLAttributes<HTMLInputElement>> = ({
	label,
	id,
	name,
	value,
	onChange,
	...attr
}) => {
	return (
		<Field>
			<Input id={id} name={name} checked={value} onChange={onChange} type='checkbox' {...attr} />

			<Label htmlFor={id}>
				<span>
					<Svg width='12px' height='10px'>
						<polyline points='1.5 6 4.5 9 10.5 1'></polyline>
					</Svg>
				</span>
				{label && <span>{label}</span>}
			</Label>
		</Field>
	)
}
