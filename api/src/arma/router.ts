
import { Router } from 'express'

import Players from './controllers/players'
import Gangs from './controllers/gangs'
import Vehicles from './controllers/vehicles'
import Properties from './controllers/properties'

const router = Router()

router.get('/players', Players.route('index'))
router.get('/players/deaths', Players.route('deathsIndex'))
router.get('/players/deaths/:identifier', Players.route('showDeath'))
router.route('/players/:identifier')
      .get(Players.route('show'))
      .patch(Players.route('update'))
router.get('/players/:identifier/deaths', Players.route('playerDeaths'))
router.get('/players/:identifier/vehicles', Players.route('playerVehicles'))
router.get('/players/:identifier/properties', Players.route('playerProperties'))
router.get('/players/:identifier/moneycache', Players.route('playerMoneyCache'))

router.get('/gangs', Gangs.route('index'))
router.get('/gangs/alliances', Gangs.route('alliancesIndex'))
router.get('/gangs/alliances/:identifier', Gangs.route('showAlliance'))
router.get('/gangs/:identifier', Gangs.route('show'))
router.get('/gangs/:identifier/alliances', Gangs.route('gangAlliances'))

router.get('/vehicles', Vehicles.route('index'))
router.get('/vehicles/:identifier', Vehicles.route('show'))

router.get('/properties', Properties.route('index'))
router.get('/properties/:identifier', Properties.route('show'))

// disputes?
// /meta router? for things such as infocars, house categories
// base bids?
// elections / polls
// cartel captures


export default router
