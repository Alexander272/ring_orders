import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'

import { AppRoutes } from '@/constants/routes'
import { Layout } from '@/components/Layout/Layout'
import { NotFound } from '@/pages/notFound/NotFoundLazy'
import { Home } from '@/pages/home/HomeLazy'
import { Auth } from '@/pages/auth/AuthLazy'
import { NewOrder } from '@/pages/new-order/NewOrderLazy'
import { Order } from '@/pages/order/OrderLazy'
// import PrivateRoute from './PrivateRoute'

const config: RouteObject[] = [
	{
		element: <Layout />,
		errorElement: <NotFound />,
		children: [
			{
				path: AppRoutes.Auth,
				element: <Auth />,
			},
			{
				path: AppRoutes.Home,
				// element: <PrivateRoute />,
				children: [
					{
						index: true,
						element: <Home />,
					},
					{
						path: AppRoutes.NewOrder,
						element: <NewOrder />,
					},
					{
						path: AppRoutes.Order,
						element: <Order />,
					},
				],
			},
		],
	},
]

export const router = createBrowserRouter(config)
