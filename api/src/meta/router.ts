
import { Router } from 'express'

import Vehicles from './controllers/vehicles'
import Items from './controllers/items'

const router = Router()

router.get('/vehicles', Vehicles.route('index'))
router.get('/vehicles/:identifier', Vehicles.route('show'))

router.get('/items', Items.route('index'))
router.get('/items/:identifier', Items.route('show'))

export default router